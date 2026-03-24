import { ControlStatus, DocumentStatus, RiskStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { deriveControls, deriveDocuments, deriveRisks } from "@/lib/rules";
import type { ProfileInput } from "@/lib/profile-input";

export async function rebuildCompanyFromProfile(companyId: string, profile: ProfileInput) {
  const baselineControls = await prisma.baselineControl.findMany({
    orderBy: { code: "asc" },
  });

  const existingControls = await prisma.companyControl.findMany({
    where: { companyId },
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

    prisma.companyControl.deleteMany({
      where: { companyId },
    }),

    prisma.companyRisk.deleteMany({
      where: { companyId },
    }),

    prisma.companyDocument.deleteMany({
      where: { companyId },
    }),

    prisma.companyControl.createMany({
      data: controls.map((control) => {
        const normalizedCode = control.code.startsWith("A.")
          ? control.code
          : `A.${control.code}`;

        const baseline = baselineControls.find((item) => {
          const baselineCode = item.code.startsWith("A.") ? item.code : `A.${item.code}`;
          return baselineCode === normalizedCode;
        });

        if (!baseline) {
          throw new Error(`Missing baseline control ${control.code}`);
        }

        const existing = existingControls.find(
          (item) => item.baselineControlId === baseline.id,
        );

        const hasManualApplicable = existing?.manualApplicable !== null && existing?.manualApplicable !== undefined;
        const hasManualJustification =
          existing?.manualJustification !== null &&
          existing?.manualJustification !== undefined &&
          existing.manualJustification.trim() !== "";

        const finalApplicable = hasManualApplicable
          ? existing!.manualApplicable!
          : control.applicable;

        const finalJustification = hasManualJustification
          ? existing!.manualJustification!
          : control.justification;

        const finalStatus =
          existing?.status ??
          (finalApplicable ? ControlStatus.PLANNED : ControlStatus.NOT_APPLICABLE);

        return {
          companyId,
          baselineControlId: baseline.id,
          ownerName: existing?.ownerName ?? "",

          autoApplicable: control.applicable,
          autoJustification: control.justification,

          manualApplicable: existing?.manualApplicable ?? null,
          manualJustification: existing?.manualJustification ?? null,

          applicable: finalApplicable,
          justification: finalJustification,

          evidence: existing?.evidence ?? "",
          status: finalStatus,
        };
      }),
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
