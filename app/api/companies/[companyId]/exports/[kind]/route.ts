// app/api/companies/[companyId]/exports/[kind]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { companyId: string; kind: string } }
) {
  const { companyId, kind } = params;

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      documents: true,
      risks: true,
      controls: {
        include: { baselineControl: true },
      },
    },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  let content = "";

  if (kind === "soa") {
    content += `Statement of Applicability - ${company.name}\n\n`;

    for (const c of company.controls) {
      content += `${c.baselineControl.code} - ${c.baselineControl.title}\n`;
      content += `Status: ${c.status}\n`;
      content += `Applicable: ${c.applicable}\n\n`;
    }
  }

  if (kind === "risks") {
    content += `Risk Register - ${company.name}\n\n`;

    for (const r of company.risks) {
      content += `${r.title}\n`;
      content += `Asset: ${r.asset}\n`;
      content += `Score: ${r.likelihood * r.impact}\n\n`;
    }
  }

  if (kind === "documents") {
    content += `Documents - ${company.name}\n\n`;

    for (const d of company.documents) {
      content += `${d.name} (${d.status})\n`;
    }
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename=${kind}.txt`,
    },
  });
}
