import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  asset: z.string().min(1),
  threat: z.string().min(1),
  vulnerability: z.string().min(1),
  likelihood: z.number().int().min(1).max(5),
  impact: z.number().int().min(1).max(5),
  residualLikelihood: z.number().int().min(1).max(5),
  residualImpact: z.number().int().min(1).max(5),
  treatment: z.string().min(1),
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

  const risk = await prisma.companyRisk.create({
    data: { companyId, status: "OPEN", ...parsed.data }
  });

  return Response.json({ id: risk.id, message: "Rischio creato." });
}
