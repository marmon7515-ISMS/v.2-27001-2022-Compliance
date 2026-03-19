import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildDocx, buildPdf } from "@/lib/exporters";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string; kind: string }> }
) {
  const session = await getSessionUser();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { companyId, kind } = await params;
  if (session.companyId !== "all" && session.companyId !== companyId) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!["soa", "risks", "documents"].includes(kind)) {
    return new Response("Invalid export kind", { status: 400 });
  }

  const format = new URL(request.url).searchParams.get("format") ?? "docx";
  if (!["docx", "pdf"].includes(format)) {
    return new Response("Invalid export format", { status: 400 });
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      profile: true,
      controls: { include: { baselineControl: true }, orderBy: { baselineControl: { code: "asc" } } },
      risks: { orderBy: { title: "asc" } },
      documents: { orderBy: { name: "asc" } }
    }
  });

  if (!company) return new Response("Not found", { status: 404 });

  if (format === "docx") {
    const buffer = await buildDocx(kind as "soa" | "risks" | "documents", company);
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${kind}-${company.name}.docx"`
      }
    });
  }

  const buffer = await buildPdf(kind as "soa" | "risks" | "documents", company);
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${kind}-${company.name}.pdf"`
    }
  });
}
