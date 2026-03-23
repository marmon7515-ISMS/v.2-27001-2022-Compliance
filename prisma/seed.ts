// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

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

  await prisma.baselineControl.createMany({
    data: [
      {
        code: "A.5.1",
        title: "Policies for information security",
        domain: "Organizational",
        defaultApplicable: true,
        rationale: "Define and approve information security policies.",
      },
      {
        code: "A.5.23",
        title: "Information security for use of cloud services",
        domain: "Technological",
        defaultApplicable: true,
        rationale: "Manage risks related to cloud services.",
      },
      {
        code: "A.8.13",
        title: "Information backup",
        domain: "Technological",
        defaultApplicable: true,
        rationale: "Protect availability and recoverability of information.",
      },
    ],
  });

  await prisma.baselineRisk.createMany({
    data: [
      {
        key: "phishing",
        title: "Phishing su account aziendali",
        category: "Identity",
        asset: "Email e workspace cloud",
        threat: "Furto credenziali",
        vulnerability: "Bassa consapevolezza utenti",
        likelihood: 4,
        impact: 4,
        residualLikelihood: 2,
        residualImpact: 2,
        treatment: "Mitigate",
      },
      {
        key: "ransomware",
        title: "Ransomware su endpoint",
        category: "Endpoint",
        asset: "Laptop e workstation",
        threat: "Cifratura malevola",
        vulnerability: "Patch management incompleto",
        likelihood: 4,
        impact: 5,
        residualLikelihood: 2,
        residualImpact: 3,
        treatment: "Mitigate",
      },
    ],
  });

  await prisma.baselineDocument.createMany({
    data: [
      {
        key: "infosec-policy",
        name: "Information Security Policy",
        category: "POLICY",
        required: true,
        reason: "Documento base richiesto per l'ISMS.",
      },
      {
        key: "risk-register",
        name: "Risk Register",
        category: "REGISTER",
        required: true,
        reason: "Registro dei rischi necessario per la gestione del rischio.",
      },
      {
        key: "incident-response",
        name: "Incident Response Procedure",
        category: "PROCEDURE",
        required: true,
        reason: "Gestione strutturata degli incidenti di sicurezza.",
      },
    ],
  });

  const acme = await prisma.company.create({
    data: {
      id: "acme-srl",
      name: "Acme Srl",
      framework: "ISO 27001",
      ownerName: "Mario Rossi",
      industry: "Tech",
    },
  });

  const beta = await prisma.company.create({
    data: {
      id: "beta-logistics",
      name: "Beta Logistics",
      framework: "ISO 27001",
      ownerName: "Luigi Bianchi",
      industry: "Logistica",
    },
  });

  await prisma.companyProfile.createMany({
    data: [
      {
        companyId: acme.id,
        customerDescription: "PMI SaaS con lavoro ibrido",
        industry: "Tech",
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
      {
        companyId: beta.id,
        customerDescription: "Azienda logistica con sedi operative",
        industry: "Logistica",
        companySize: "Mid-market",
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
    ],
  });

  const baselineControls = await prisma.baselineControl.findMany();
  const baselineDocuments = await prisma.baselineDocument.findMany();

  for (const control of baselineControls) {
    await prisma.companyControl.create({
      data: {
        companyId: acme.id,
        baselineControlId: control.id,
        ownerName: "Mario Rossi",
        applicable: true,
        justification: "Applicabile al contesto aziendale",
        evidence: "",
        status: "PLANNED",
      },
    });

    await prisma.companyControl.create({
      data: {
        companyId: beta.id,
        baselineControlId: control.id,
        ownerName: "Luigi Bianchi",
        applicable: true,
        justification: "Applicabile al contesto aziendale",
        evidence: "",
        status: "PLANNED",
      },
    });
  }

  for (const document of baselineDocuments) {
    await prisma.companyDocument.create({
      data: {
        companyId: acme.id,
        name: document.name,
        category: document.category,
        required: document.required,
        reason: document.reason,
        ownerName: "Mario Rossi",
        status: "DRAFT",
      },
    });

    await prisma.companyDocument.create({
      data: {
        companyId: beta.id,
        name: document.name,
        category: document.category,
        required: document.required,
        reason: document.reason,
        ownerName: "Luigi Bianchi",
        status: "DRAFT",
      },
    });
  }

  await prisma.companyRisk.createMany({
    data: [
      {
        companyId: acme.id,
        title: "Phishing su account aziendali",
        category: "Identity",
        asset: "Email e workspace cloud",
        threat: "Furto credenziali",
        vulnerability: "Bassa consapevolezza utenti",
        likelihood: 4,
        impact: 4,
        residualLikelihood: 2,
        residualImpact: 2,
        treatment: "Mitigate",
        ownerName: "Mario Rossi",
        status: "OPEN",
      },
      {
        companyId: beta.id,
        title: "Ransomware su endpoint",
        category: "Endpoint",
        asset: "Laptop e workstation",
        threat: "Cifratura malevola",
        vulnerability: "Patch management incompleto",
        likelihood: 4,
        impact: 5,
        residualLikelihood: 2,
        residualImpact: 3,
        treatment: "Mitigate",
        ownerName: "Luigi Bianchi",
        status: "OPEN",
      },
    ],
  });

  await prisma.user.createMany({
    data: [
      {
        id: "admin",
        name: "Admin",
        username: "admin",
        email: "admin@test.com",
        passwordHash: "admin12345",
        role: "SUPER_ADMIN",
      },
      {
        id: "acme-user",
        name: "Acme User",
        username: "acme",
        email: "acme@test.com",
        passwordHash: "acme12345",
        role: "COMPLIANCE_MANAGER",
        companyId: acme.id,
      },
      {
        id: "beta-user",
        name: "Beta User",
        username: "beta",
        email: "beta@test.com",
        passwordHash: "beta12345",
        role: "CLIENT_ADMIN",
        companyId: beta.id,
      },
    ],
  });

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
