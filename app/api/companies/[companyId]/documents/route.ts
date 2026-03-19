import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  required: z.boolean(),
  reason: z.string().default(""),
  ownerName: z.string().optional().nullable()
});

export async function POST(request: Request, { params }: { params: Promise<{ companyId: string }> }) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { companyId } = await params;
  if (session.companyId !== "all" && session.companyId !== companyId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const document = await prisma.companyDocument.create({
    data: {
      companyId,
      status: parsed.data.required ? "DRAFT" : "NOT_REQUIRED",
      ...parsed.data
    }
  });

  return Response.json({ id: document.id, message: "Documento creato." });
}
