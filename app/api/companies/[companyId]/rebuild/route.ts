import { getSessionUser } from "@/lib/auth";
import { profileInputSchema } from "@/lib/profile-input";
import { rebuildCompanyFromProfile } from "@/lib/rebuild";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> },
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
  const parsed = profileInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid payload",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  await rebuildCompanyFromProfile(companyId, parsed.data);

  return Response.json({ message: "Baseline cliente rigenerata." });
}
