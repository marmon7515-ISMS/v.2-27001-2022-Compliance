// app/api/companies/[companyId]/exports/[kind]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function buildSoaText(company: Awaited<ReturnType<typeof prisma.company.findUniqueOrThrow>>) {
  const lines: string[] = [];

  lines.push(`Statement of Applicability - ${company.name}`);
  lines.push(`Framework: ${company.framework}`);
  lines.push("");

  for (const control of company.controls) {
    lines.push(`${control.baselineControl.code} - ${control.baselineControl.title}`);
    lines.push(`Status: ${control.status}`);
    lines.push(`Applicable: ${control.applicable ? "Yes" : "No"}`);
    lines.push(`Justification: ${control.justification ?? ""}`);
    lines.push("");
  }

  return lines.join("\n");
}

function buildRisksText(company: Awaited<ReturnType<typeof prisma.company.findUniqueOrThrow>>) {
  const lines: string[] = [];

  lines.push(`Risk Register - ${company.name}`);
  lines.push(`Framework: ${company.framework}`);
  lines.push("");

  for (const risk of company.risks) {
    lines.push(`${risk.title}`);
    lines.push(`Category: ${risk.category}`);
    lines.push(`Asset: ${risk.asset}`);
    lines.push(`Threat: ${risk.threat}`);
    lines.push(`Vulnerability: ${risk.vulnerability}`);
    lines.push(`Likelihood: ${risk.likelihood}`);
    lines.push(`Impact: ${risk.impact}`);
    lines.push(`Residual Likelihood: ${risk.residualLikelihood}`);
    lines.push(`Residual Impact: ${risk.residualImpact}`);
    lines.push(`Treatment: ${risk.treatment}`);
    lines.push(`Status: ${risk.status}`);
    lines.push("");
  }

  return lines.join("\n");
}

function buildDocumentsText(company: Awaited<ReturnType<typeof prisma.company.findUniqueOrThrow>>) {
  const lines: string[] = [];

  lines.push(`Document Set - ${company.name}`);
  lines.push(`Framework: ${company.framework}`);
  lines.push("");

  for (const document of company.documents) {
    lines.push(`${document.name}`);
    lines.push(`Category: ${document.category}`);
    lines.push(`Required: ${document.required ? "Yes" : "No"}`);
    lines.push(`Status: ${document.status}`);
    lines.push(`Reason: ${document.reason}`);
    lines.push("");
  }

  return lines.join("\n");
}

export async function GET(
  request: Request,
  context: { params: Promise<{ companyId: string; kind: string }> }
) {
  try {
    const { companyId, kind } = await context.params;
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get("format") ?? "txt").toLowerCase();

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        documents: {
          orderBy: { name: "asc" },
        },
        risks: {
          orderBy: { title: "asc" },
        },
        controls: {
          include: {
            baselineControl: true,
          },
          orderBy: {
            baselineControl: {
              code: "asc",
            },
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    let content = "";
    let baseName = "";

    if (kind === "soa") {
      content = buildSoaText(company);
      baseName = "statement-of-applicability";
    } else if (kind === "risks") {
      content = buildRisksText(company);
      baseName = "risk-register";
    } else if (kind === "documents") {
      content = buildDocumentsText(company);
      baseName = "document-set";
    } else {
      return NextResponse.json({ error: "Invalid export kind" }, { status: 400 });
    }

    const safeFormat = format === "pdf" || format === "docx" ? format : "txt";
    const fileName = `${baseName}-${company.id}.${safeFormat}`;

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("EXPORT_ROUTE_ERROR:", error);

    return NextResponse.json(
      {
        error: "Export failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
