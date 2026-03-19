import { ControlStatus, DocumentStatus, RiskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deriveControls, deriveDocuments, deriveRisks } from "@/lib/rules";
import { ProfileInput } from "@/types";

export async function rebuildCompanyFromProfile(companyId: string, profile: ProfileInput) {
  const [baselineControls] = await Promise.all([
    prisma.baselineControl.findMany({ orderBy: { code: "asc" } })
  ]);

  const controls = deriveControls(profile);
  const risks = deriveRisks(profile);
  const documents = deriveDocuments(profile);

  await prisma.$transaction([
    prisma.companyProfile.upsert({
      where: { companyId },
      update: profile,
      create: { companyId, ...profile }
    }),
    prisma.companyControl.deleteMany({ where: { companyId } }),
    prisma.companyRisk.deleteMany({ where: { companyId } }),
    prisma.companyDocument.deleteMany({ where: { companyId } }),
    prisma.companyControl.createMany({
      data: controls.map((control) => {
        const baseline = baselineControls.find((item) => item.code === control.code);
        if (!baseline) {
          throw new Error(`Missing baseline control ${control.code}`);
        }

        return {
          companyId,
          baselineControlId: baseline.id,
          ownerName: null,
          status: control.applicable ? ControlStatus.PLANNED : ControlStatus.NOT_APPLICABLE,
          applicable: control.applicable,
          justification: control.justification,
          evidence: ""
        };
      })
    }),
    prisma.companyRisk.createMany({
      data: risks.map((risk) => ({
        companyId,
        title: risk.title,
        category: risk.category,
        asset: risk.asset,
        threat: risk.threat,
        vulnerability: risk.vulnerability,
        likelihood: risk.likelihood,
        impact: risk.impact,
        residualLikelihood: risk.residualLikelihood,
        residualImpact: risk.residualImpact,
        treatment: risk.treatment,
        status: RiskStatus.OPEN
      }))
    }),
    prisma.companyDocument.createMany({
      data: documents.map((doc) => ({
        companyId,
        name: doc.name,
        category: doc.category,
        required: doc.required,
        reason: doc.reason,
        status: doc.required ? DocumentStatus.DRAFT : DocumentStatus.NOT_REQUIRED
      }))
    })
  ]);
}
