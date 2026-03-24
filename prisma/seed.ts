// prisma/seed.ts

import {
  ControlStatus,
  DocumentStatus,
  PrismaClient,
  RiskStatus,
  UserRole,
} from "@prisma/client";

import { BASELINE_CONTROLS, BASELINE_DOCUMENTS, BASELINE_RISKS } from "../lib/baseline";
import { deriveControls, deriveDocuments, deriveRisks } from "../lib/rules";
import type { ProfileInput } from "../lib/profile-input";

const prisma = new PrismaClient();

async function resetDatabase() {
  await prisma.companyUpload.deleteMany();
  await prisma.companyDocument.deleteMany();
  await prisma.companyRisk.deleteMany();
  await prisma.companyControl.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.baselineDocument.deleteMany();
  await prisma.baselineRisk.deleteMany();
  await prisma.baselineControl.deleteMany();
}

async function seedBaseline() {
  await prisma.baselineControl.createMany({
    data: BASELINE_CONTROLS.map((control) => ({
      code: control.code,
      title: control.title,
      domain: control.domain,
      defaultApplicable: true,
      rationale:
        "Baseline Annex A ISO/IEC 27001:2022; l'applicabilità finale dipende dal profilo aziendale.",
    })),
  });

  await prisma.baselineRisk.createMany({
    data: BASELINE_RISKS.map((risk) => ({
      key: risk.key,
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
    })),
  });

  await prisma.baselineDocument.createMany({
    data: BASELINE_DOCUMENTS.map((doc) => ({
      key: doc.key,
      name: doc.name,
      category: doc.category,
      required: doc.trigger === "always",
      reason:
        doc.trigger === "always"
          ? "Documento di baseline richiesto per tutte le organizzazioni del perimetro."
          : "Documento applicabile in funzione delle caratteristiche del profilo aziendale.",
    })),
  });
}

async function seedCompany(
  id: string,
  name: string,
  framework: string,
  ownerName: string,
  industry: string,
  profile: ProfileInput,
) {
  const company = await prisma.company.create({
    data: {
      id,
      name,
      framework,
      ownerName,
      industry,
    },
  });

  await prisma.companyProfile.create({
    data: {
      companyId: company.id,
      ...profile,
    },
  });

  const baselineControls = await prisma.baselineControl.findMany({
    orderBy: { code: "asc" },
  });

  const derivedControls = deriveControls(profile);
  const derivedDocuments = deriveDocuments(profile);
  const derivedRisks = deriveRisks(profile);

  for (const control of derivedControls) {
    const baseline = baselineControls.find((item) => item.code === control.code);

    if (!baseline) {
      throw new Error(`Missing baseline control ${control.code} during seed`);
    }

    await prisma.companyControl.create({
      data: {
        companyId: company.id,
        baselineControlId: baseline.id,
        ownerName,

        autoApplicable: control.applicable,
        autoJustification: control.justification,

        manualApplicable: null,
        manualJustification: null,

        applicable: control.applicable,
        justification: control.justification,

        evidence: "",
        status: control.applicable
          ? ControlStatus.PLANNED
          : ControlStatus.NOT_APPLICABLE,
      },
    });
  }

  for (const document of derivedDocuments) {
    await prisma.companyDocument.create({
      data: {
        companyId: company.id,
        name: document.name,
        category: document.category,
        required: document.required,
        reason: document.reason,
        ownerName,
        status: document.required
          ? DocumentStatus.DRAFT
          : DocumentStatus.NOT_REQUIRED,
      },
    });
  }

  for (const risk of derivedRisks) {
    await prisma.companyRisk.create({
      data: {
        companyId: company.id,
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
        ownerName,
        status: RiskStatus.OPEN,
      },
    });
  }

  await prisma.companyUpload.createMany({
    data: [
      {
        companyId: company.id,
        name: "example-context.txt",
        mimeType: "text/plain",
        sizeBytes: 120,
        extractedText: profile.customerDescription,
        analysisNotes: "Documento demo iniziale.",
      },
      {
        companyId: company.id,
        name: "network-notes.txt",
        mimeType: "text/plain",
        sizeBytes: 96,
        extractedText: "Perimetro, asset critici, cloud e accessi privilegiati.",
        analysisNotes: "Note operative caricate in seed.",
      },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        companyId: company.id,
        title: "Confermare perimetro e asset critici",
        assignee: ownerName,
        priority: "High",
      },
      {
        companyId: company.id,
        title: "Completare checklist cliente",
        assignee: ownerName,
        priority: "High",
      },
      {
        companyId: company.id,
        title: "Validare SoA iniziale",
        assignee: ownerName,
        priority: "Medium",
      },
    ],
  });

  return company;
}

async function seedUsers(acmeId: string, betaId: string) {
  await prisma.user.createMany({
    data: [
      {
        id: "admin",
        name: "Giulia Rinaldi",
        username: "admin",
        email: "giulia@example.local",
        passwordHash: "admin12345",
        role: UserRole.SUPER_ADMIN,
        companyId: null,
        active: true,
      },
      {
        id: "acme-user",
        name: "Marco Conti",
        username: "acme",
        email: "marco@example.local",
        passwordHash: "acme12345",
        role: UserRole.COMPLIANCE_MANAGER,
        companyId: acmeId,
        active: true,
      },
      {
        id: "beta-user",
        name: "Sara Villa",
        username: "beta",
        email: "sara@example.local",
        passwordHash: "beta12345",
        role: UserRole.CLIENT_ADMIN,
        companyId: betaId,
        active: true,
      },
    ],
  });
}

async function main() {
  console.log("Seeding database...");

  await resetDatabase();
  await seedBaseline();

  const acme = await seedCompany(
    "acme-srl",
    "Acme Srl",
    "ISO 27001",
    "Giulia Rinaldi",
    "SaaS",
    {
      customerDescription:
        "PMI SaaS con lavoro ibrido, sviluppo software interno, servizi cloud e fornitori critici.",
      industry: "SaaS",
      companySize: "SMB",
      remoteWorkforce: true,
      physicalOfficeControl: true,
      softwareDevelopment: true,
      cloudHosted: true,
      personalDataProcessing: true,
      specialCategoryData: false,
      paymentProcessing: false,
      regulatedMarket: false,
      suppliersCritical: true,
      businessContinuityRequired: true,
      mobileDevicesUsed: true,
      privilegedAccessManaged: true,
      securityMonitoringNeeded: true,
    },
  );

  const beta = await seedCompany(
    "beta-logistics",
    "Beta Logistics",
    "ISO 27001 + NIS2",
    "Marco Conti",
    "Logistics",
    {
      customerDescription:
        "Azienda logistica con sedi operative, terminali distribuiti, fornitori critici e continuità operativa rilevante.",
      industry: "Logistics",
      companySize: "Mid-Market",
      remoteWorkforce: false,
      physicalOfficeControl: true,
      softwareDevelopment: false,
      cloudHosted: true,
      personalDataProcessing: true,
      specialCategoryData: false,
      paymentProcessing: false,
      regulatedMarket: false,
      suppliersCritical: true,
      businessContinuityRequired: true,
      mobileDevicesUsed: true,
      privilegedAccessManaged: true,
      securityMonitoringNeeded: true,
    },
  );

  await seedUsers(acme.id, beta.id);

  console.log("✅ SEED COMPLETATO");
}

main()
  .catch((error) => {
    console.error("SEED ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
