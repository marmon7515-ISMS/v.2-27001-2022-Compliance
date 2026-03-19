import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BASELINE_CONTROLS, BASELINE_DOCUMENTS, BASELINE_RISKS, DEFAULT_PROFILE } from "@/lib/baseline";
import { deriveControls, deriveDocuments, deriveRisks } from "@/lib/rules";
import { hashPassword } from "@/lib/auth";

async function seedBaseline() {
  for (const control of BASELINE_CONTROLS) {
    await prisma.baselineControl.upsert({
      where: { code: control.code },
      update: {
        title: control.title,
        domain: control.domain,
        defaultApplicable: true,
        rationale: "Baseline generale; verificare applicabilità sul profilo cliente."
      },
      create: {
        code: control.code,
        title: control.title,
        domain: control.domain,
        defaultApplicable: true,
        rationale: "Baseline generale; verificare applicabilità sul profilo cliente."
      }
    });
  }

  for (const risk of BASELINE_RISKS) {
    await prisma.baselineRisk.upsert({
      where: { key: risk.key },
      update: risk,
      create: risk
    });
  }

  for (const document of BASELINE_DOCUMENTS) {
    await prisma.baselineDocument.upsert({
      where: { key: document.key },
      update: document,
      create: document
    });
  }
}

async function seedCompany(name: string, framework: string, ownerName: string, industry: string, profile = DEFAULT_PROFILE) {
  const company = await prisma.company.upsert({
    where: { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
    update: { name, framework, ownerName, industry },
    create: { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, framework, ownerName, industry }
  });

  await prisma.companyProfile.upsert({
    where: { companyId: company.id },
    update: profile,
    create: { companyId: company.id, ...profile }
  });

  await prisma.companyControl.deleteMany({ where: { companyId: company.id } });
  await prisma.companyRisk.deleteMany({ where: { companyId: company.id } });
  await prisma.companyDocument.deleteMany({ where: { companyId: company.id } });
  await prisma.companyUpload.deleteMany({ where: { companyId: company.id } });
  await prisma.task.deleteMany({ where: { companyId: company.id } });

  const baselineControls = await prisma.baselineControl.findMany();
  const controls = deriveControls(profile);
  const risks = deriveRisks(profile);
  const documents = deriveDocuments(profile);

  for (const control of controls) {
    const baseline = baselineControls.find((item) => item.code === control.code);
    if (!baseline) continue;

    await prisma.companyControl.create({
      data: {
        companyId: company.id,
        baselineControlId: baseline.id,
        ownerName,
        applicable: control.applicable,
        justification: control.justification,
        evidence: "",
        status: control.applicable ? "PLANNED" : "NOT_APPLICABLE"
      }
    });
  }

  for (const risk of risks) {
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
        ownerName
      }
    });
  }

  for (const document of documents) {
    await prisma.companyDocument.create({
      data: {
        companyId: company.id,
        name: document.name,
        category: document.category,
        required: document.required,
        reason: document.reason,
        ownerName,
        status: document.required ? "DRAFT" : "NOT_REQUIRED"
      }
    });
  }

  await prisma.task.createMany({
    data: [
      {
        companyId: company.id,
        title: "Confermare perimetro e asset critici",
        assignee: ownerName,
        priority: "High"
      },
      {
        companyId: company.id,
        title: "Completare checklist cliente",
        assignee: ownerName,
        priority: "High"
      }
    ]
  });

  await prisma.companyUpload.create({
    data: {
      companyId: company.id,
      name: "example-context.txt",
      mimeType: "text/plain",
      sizeBytes: 120,
      extractedText: profile.customerDescription,
      analysisNotes: "Documento seed con contesto iniziale."
    }
  });

  return company;
}

async function seedUsers(acmeId: string, betaId: string) {
  const users = [
    { name: "Giulia Rinaldi", username: "admin", password: "admin12345", role: UserRole.SUPER_ADMIN, companyId: "all", email: "giulia@example.local" },
    { name: "Marco Conti", username: "acme", password: "acme12345", role: UserRole.COMPLIANCE_MANAGER, companyId: acmeId, email: "marco@example.local" },
    { name: "Sara Villa", username: "beta", password: "beta12345", role: UserRole.CLIENT_ADMIN, companyId: betaId, email: "sara@example.local" }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {
        name: user.name,
        email: user.email,
        passwordHash: await hashPassword(user.password),
        role: user.role,
        companyId: user.companyId,
        active: true
      },
      create: {
        name: user.name,
        username: user.username,
        email: user.email,
        passwordHash: await hashPassword(user.password),
        role: user.role,
        companyId: user.companyId,
        active: true
      }
    });
  }
}

async function main() {
  await seedBaseline();
  const acme = await seedCompany("Acme Srl", "ISO 27001", "Giulia Rinaldi", "SaaS", DEFAULT_PROFILE);
  const beta = await seedCompany("Beta Logistics", "ISO 27001 + NIS2", "Marco Conti", "Logistics", {
    ...DEFAULT_PROFILE,
    physicalOfficeControl: true,
    remoteWorkforce: false,
    softwareDevelopment: false
  });
  await seedUsers(acme.id, beta.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
