import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PROFILE } from "@/lib/baseline";
import { rebuildCompanyFromProfile } from "@/lib/rebuild";

const schema = z.object({
  name: z.string().min(1),
  framework: z.string().min(1),
  industry: z.string().optional().default("General"),
  ownerName: z.string().optional().default("Compliance")
});

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session || session.companyId !== "all") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const company = await prisma.company.create({
    data: {
      name: parsed.data.name,
      framework: parsed.data.framework,
      industry: parsed.data.industry,
      ownerName: parsed.data.ownerName
    }
  });

  await rebuildCompanyFromProfile(company.id, DEFAULT_PROFILE);

  return Response.json({ id: company.id, message: "Cliente creato." });
}
