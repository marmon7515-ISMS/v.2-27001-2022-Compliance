// lib/dashboard.ts

import { ControlStatus, DocumentStatus, RiskStatus, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { score, scoreLabel } from "@/lib/rules";
import { SessionUser } from "@/types";

function isSuperAdmin(session: SessionUser) {
  return session.role === UserRole.SUPER_ADMIN || session.companyId === "all";
}

export async function getAccessibleCompanies(session: SessionUser) {
  if (isSuperAdmin(session)) {
    return prisma.company.findMany({
      orderBy: { name: "asc" },
    });
  }

  if (!session.companyId) {
    return [];
  }

  return prisma.company.findMany({
    where: { id: session.companyId },
    orderBy: { name: "asc" },
  });
}

export async function getDashboardData(session: SessionUser, companyId?: string) {
  const allowedCompanies = await getAccessibleCompanies(session);

  const selectedCompany =
    allowedCompanies.find((company) => company.id === companyId) ?? allowedCompanies[0];

  if (!selectedCompany) {
    return {
      companies: [],
      users: [],
      selectedCompany: null,
    };
  }

  const [company, users] = await Promise.all([
    prisma.company.findUnique({
      where: { id: selectedCompany.id },
      include: {
        profile: true,
        controls: {
          include: { baselineControl: true },
          orderBy: { baselineControl: { code: "asc" } },
        },
        risks: {
          orderBy: { title: "asc" },
        },
        documents: {
          orderBy: { name: "asc" },
        },
        uploads: {
          orderBy: { createdAt: "desc" },
        },
        tasks: {
          orderBy: { dueDate: "asc" },
        },
      },
    }),
    isSuperAdmin(session)
      ? prisma.user.findMany({
          orderBy: { username: "asc" },
        })
      : prisma.user.findMany({
          where: {
            companyId: session.companyId ?? undefined,
          },
          orderBy: { username: "asc" },
        }),
  ]);

  if (!company) {
    return {
      companies: allowedCompanies,
      users,
      selectedCompany: null,
    };
  }

  const controlSummary = {
    total: company.controls.length,
    applicable: company.controls.filter((item) => item.applicable).length,
    notApplicable: company.controls.filter((item) => !item.applicable).length,
    implemented: company.controls.filter((item) =>
      [ControlStatus.IMPLEMENTED, ControlStatus.APPROVED].includes(item.status),
    ).length,
  };

  const riskSummary = {
    total: company.risks.length,
    open: company.risks.filter((item) => item.status !== RiskStatus.CLOSED).length,
    critical: company.risks.filter((item) => score(item.likelihood, item.impact) >= 15).length,
  };

  const documentSummary = {
    total: company.documents.length,
    required: company.documents.filter((item) => item.required).length,
    approved: company.documents.filter((item) => item.status === DocumentStatus.APPROVED).length,
  };

  return {
    companies: allowedCompanies,
    users,
    selectedCompany: {
      ...company,
      controlSummary,
      riskSummary,
      documentSummary,
      topRisks: company.risks
        .map((risk) => ({
          ...risk,
          score: score(risk.likelihood, risk.impact),
          scoreLabel: scoreLabel(score(risk.likelihood, risk.impact)),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 8),
    },
  };
}
