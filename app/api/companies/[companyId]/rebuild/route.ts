import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { rebuildCompanyFromProfile } from "@/lib/rebuild";

const schema = z.object({
  cloudServices: z.boolean(),
  softwareDevelopment: z.boolean(),
  suppliersCritical: z.boolean(),
  remoteWorkforce: z.boolean(),
  physicalOfficeControl: z.boolean(),
  criticalProcesses: z.boolean(),
  personalData: z.boolean(),
  regulatedSector: z.boolean(),
  customerDescription: z.string(),
  uploadedContext: z.string()
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const session = await getSessionUser();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId } = await params;
  if (session.companyId !== "all" && session.companyId !== companyId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  await rebuildCompanyFromProfile(companyId, parsed.data);

  return Response.json({ message: "Baseline cliente rigenerata." });
}
