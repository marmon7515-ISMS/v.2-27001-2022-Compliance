import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mergeProfileSuggestion, suggestProfileFromText } from "@/lib/profile-parser";

export async function POST(request: Request, { params }: { params: Promise<{ companyId: string }> }) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { companyId } = await params;
  if (session.companyId !== "all" && session.companyId !== companyId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { profile: true, uploads: true }
  });

  if (!company || !company.profile) {
    return Response.json({ error: "Company not found" }, { status: 404 });
  }

  const combinedText = company.uploads.map((item) => item.extractedText || item.analysisNotes).join("\n\n");
  const suggestion = suggestProfileFromText(combinedText);
  const merged = mergeProfileSuggestion({
    cloudServices: company.profile.cloudServices,
    softwareDevelopment: company.profile.softwareDevelopment,
    suppliersCritical: company.profile.suppliersCritical,
    remoteWorkforce: company.profile.remoteWorkforce,
    physicalOfficeControl: company.profile.physicalOfficeControl,
    criticalProcesses: company.profile.criticalProcesses,
    personalData: company.profile.personalData,
    regulatedSector: company.profile.regulatedSector,
    customerDescription: company.profile.customerDescription,
    uploadedContext: company.profile.uploadedContext
  }, suggestion);

  await prisma.companyProfile.update({
    where: { companyId },
    data: merged
  });

  await prisma.companyUpload.updateMany({
    where: { companyId },
    data: { analysisNotes: suggestion.reasons.join(" | ") || "Nessun segnale rilevato." }
  });

  return Response.json({
    message: "Profilo aggiornato dai documenti caricati.",
    suggestion
  });
}
