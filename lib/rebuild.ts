import { ControlStatus, DocumentStatus, RiskStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { deriveControls, deriveDocuments, deriveRisks } from "@/lib/rules";
import type { ProfileInput } from "@/lib/profile-input";

export async function rebuildCompanyFromProfile(companyId: string, profile: ProfileInput) {
  const baselineControls = await prisma.baselineControl.findMany({
    orderBy: { code: "asc" },
  });

  const controls = deriveControls(profile);
  const risks = deriveRisks(profile);
  const documents = deriveDocuments(profile);

  await prisma.$transaction([
    prisma.companyProfile.upsert({
      where: { companyId },
      update: profile,
      create: { companyId, ...profile },
    }),

    prisma.companyControl.deleteMany({ where: { companyId } }),
    prisma.companyRisk.deleteMany({ where: { companyId } }),
    prisma.companyDocument.deleteMany({ where: { companyId } }),

    // carico eventuali controlli già esistenti per preservare override auditor
const existingControls = await prisma.companyControl.findMany({
  where: { companyId },
});

await prisma.companyControl.deleteMany({ where: { companyId } });

await prisma.companyControl.createMany({
  data: controls.map((control) => {
    const baseline = baselineControls.find((item) => item.code === control.code);

    if (!baseline) {
      throw new Error(`Missing baseline control ${control.code}`);
    }

    const existing = existingControls.find(
      (c) => c.baselineControlId === baseline.id,
    );

    const hasManualOverride =
      existing?.manualApplicable !== null ||
      existing?.manualJustification !== null;

    const finalApplicable = hasManualOverride
      ? existing?.manualApplicable ?? control.applicable
      : control.applicable;

    const finalJustification = hasManualOverride
      ? existing?.manualJustification ?? existing?.justification ?? control.justification
      : control.justification;

    return {
      companyId,
      baselineControlId: baseline.id,
      ownerName: existing?.ownerName ?? "",

      // automatico
      autoApplicable: control.applicable,
      autoJustification: control.justification,

      // override
      manualApplicable: existing?.manualApplicable ?? null,
      manualJustification: existing?.manualJustification ?? null,

      // finale
      applicable: finalApplicable,
      justification: finalJustification,

      evidence: existing?.evidence ?? "",
      status:
        existing?.status ??
        (finalApplicable ? ControlStatus.PLANNED : ControlStatus.NOT_APPLICABLE),
    };
  }),
});

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
        ownerName: "",
        status: RiskStatus.OPEN,
      })),
    }),

    prisma.companyDocument.createMany({
      data: documents.map((doc) => ({
        companyId,
        name: doc.name,
        category: doc.category,
        required: doc.required,
        reason: doc.reason,
        ownerName: "",
        status: doc.required ? DocumentStatus.DRAFT : DocumentStatus.NOT_REQUIRED,
      })),
    }),
  ]);
}
