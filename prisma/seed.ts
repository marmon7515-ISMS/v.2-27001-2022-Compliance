// prisma/seed.ts

import { PrismaClient, UserRole } from "@prisma/client";

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
    data: [
      {
        code: "A.5.1",
        title: "Policies for information security",
        domain: "Organizational",
        defaultApplicable: true,
        rationale: "Baseline generale; verificare applicabilità sul profilo cliente.",
      },
      {
        code: "A.5.7",
        title: "Threat intelligence",
        domain: "Organizational",
        defaultApplicable: true,
        rationale: "Monitorare minacce rilevanti per il contesto aziendale.",
      },
      {
        code: "A.5.23",
        title: "Information security for use of cloud services",
        domain: "Technological",
        defaultApplicable: true,
        rationale: "Gestire i rischi collegati ai servizi cloud.",
      },
      {
        code: "A.5.30",
        title: "ICT readiness for business continuity",
        domain: "Organizational",
        defaultApplicable: true,
        rationale: "Supportare continuità operativa e ripristino.",
      },
      {
        code: "A.8.1",
        title: "User endpoint devices",
        domain: "Technological",
        defaultApplicable: true,
        rationale: "Proteggere laptop, desktop e dispositivi mobili.",
      },
      {
        code: "A.8.9",
        title: "Configuration management",
        domain: "Technological",
        defaultApplicable: true,
        rationale: "Ridurre errori e deviazioni di configurazione.",
      },
      {
        code: "A.8.12",
        title: "Data leakage prevention",
        domain: "Technological",
        defaultApplicable: true,
        rationale: "Proteggere dati sensibili e personali.",
      },
      {
        code: "A.8.13",
        title: "Information backup",
        domain: "Technological",
        defaultApplicable: true,
        rationale: "Garantire disponibilità e recuperabilità delle informazioni.",
      },
      {
        code: "A.8.15",
        title: "Logging",
        domain: "Technological",
        defaultApplicable: true,
        rationale: "Abilitare audit trail e investigazione eventi.",
      },
      {
        code: "A.8.16",
        title: "Monitoring activities",
        domain: "Technological",
        defaultApplicable: true,
        rationale: "Rilevare attività anomale e incidenti.",
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
      {
        key: "cloud-misconfig",
        title: "Errore di configurazione cloud",
        category: "Cloud",
        asset: "Tenant cloud e dati aziendali",
        threat: "Esposizione dati",
        vulnerability: "Controlli IAM e review insufficienti",
        likelihood: 3,
        impact: 5,
        residualLikelihood: 2,
        residualImpact: 2,
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
        key: "soa",
        name: "Statement of Applicability",
        category: "REGISTER",
        required: true,
        reason: "Documento centrale per la dichiarazione di applicabilità.",
      },
      {
        key: "incident-response",
        name: "Incident Response Procedure",
        category: "PROCEDURE",
        required: true,
        reason: "Gestione strutturata degli incidenti di sicurezza.",
      },
      {
        key: "backup-procedure",
        name: "Backup Procedure",
        category: "PROCEDURE",
        required: true,
        reason: "Ripristino dati e continuità del servizio.",
      },
      {
        key: "access-control-policy",
        name: "Access Control Policy",
        category: "POLICY",
        required: true,
        reason: "Gestione accessi e privilegi.",
      },
    ],
  });
}

async function seedCompany(
  id: string,
  name: string,
  framework: string,
  ownerName: string,
  industry: string,
  profile: {
    customerDescription: string;
    industry: string;
    companySize: string;
    remoteWorkforce: boolean;
    physicalOfficeControl: boolean;
    softwareDevelopment: boolean;
    cloudHosted: boolean;
    personalDataProcessing: boolean;
    specialCategoryData: boolean;
    paymentProcessing: boolean;
    regulatedMarket: boolean;
    suppliersCritical: boolean;
    businessContinuityRequired: boolean;
    mobileDevicesUsed: boolean;
    privilegedAccessManaged: boolean;
    securityMonitoringNeeded: boolean;
  },
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

  for (const control of baselineControls) {
    const applicable =
      control.code !== "A.5.30" ? true : profile.businessContinuityRequired;

    await prisma.companyControl.create({
      data: {
        companyId: company.id,
        baselineControlId: control.id,
        ownerName,
        applicable,
        justification: applicable
          ? "Applicabile al contesto aziendale."
          : "Non prioritario nel contesto attuale.",
        evidence: "",
        status: applicable ? "PLANNED" : "NOT_APPLICABLE",
      },
    });
  }

  const documents = [
    {
      name: "Information Security Policy",
      category: "POLICY",
      required: true,
      reason: "Documento base richiesto per l'ISMS.",
    },
    {
      name: "Risk Register",
      category: "REGISTER",
      required: true,
      reason: "Registro dei rischi necessario per la gestione del rischio.",
    },
    {
      name: "Statement of Applicability",
      category: "REGISTER",
      required: true,
      reason: "Documento centrale per la dichiarazione di applicabilità.",
    },
    {
      name: "Incident Response Procedure",
      category: "PROCEDURE",
      required: true,
      reason: "Necessaria per la gestione degli incidenti.",
    },
    {
      name: "Backup Procedure",
      category: "PROCEDURE",
      required: true,
      reason: "Necessaria per continuità e recupero dati.",
    },
    {
      name: "Secure Development Procedure",
      category: "PROCEDURE",
      required: profile.softwareDevelopment,
      reason: profile.softwareDevelopment
        ? "Richiesta perché l'azienda sviluppa software."
        : "Non richiesta perché l'azienda non sviluppa software.",
    },
  ];

  for (const document of documents) {
    await prisma.companyDocument.create({
      data: {
        companyId: company.id,
        name: document.name,
        category: document.category,
        required: document.required,
        reason: document.reason,
        ownerName,
        status: document.required ? "DRAFT" : "NOT_REQUIRED",
      },
    });
  }

  const risks = [
    {
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
      ownerName,
      status: "OPEN" as const,
    },
    {
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
      ownerName,
      status: "OPEN" as const,
    },
    {
      title: "Errore di configurazione cloud",
      category: "Cloud",
      asset: "Tenant cloud e dati aziendali",
      threat: "Esposizione dati",
      vulnerability: "Review IAM insufficiente",
      likelihood: 3,
      impact: 5,
      residualLikelihood: 2,
      residualImpact: 2,
      treatment: "Mitigate",
      ownerName,
      status: "TREATMENT_PLANNED" as const,
    },
  ];

  for (const risk of risks) {
    await prisma.companyRisk.create({
      data: {
        companyId: company.id,
        ...risk,
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
        companyId: "all",
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
      customerDescription: "PMI SaaS con lavoro ibrido e servizi cloud.",
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
      customerDescription: "Azienda logistica con sedi operative e terminali distribuiti.",
      industry: "Logistics",
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
