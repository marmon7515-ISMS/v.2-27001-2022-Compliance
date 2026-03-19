import { getDashboardData } from "@/lib/dashboard";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId") ?? undefined;
  const data = await getDashboardData(session, companyId);

  return Response.json(data);
}
