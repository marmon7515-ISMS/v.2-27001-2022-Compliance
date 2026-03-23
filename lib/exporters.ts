// lib/exporters.ts

import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { generateDocumentContent } from "@/lib/policy-generator";

type ExportKind = "soa" | "risks" | "documents";

type ExportCompany = {
  id?: string;
  name: string;
  framework: string;
  ownerName?: string;
  industry?: string;
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
  } | null;
  controls: Array<{
    applicable: boolean;
    justification: string;
    status: string;
    baselineControl: {
      code: string;
      title: string;
      domain: string;
    };
  }>;
  risks: Array<{
    title: string;
    category: string;
    asset: string;
    threat: string;
    vulnerability: string;
    likelihood: number;
    impact: number;
    residualLikelihood: number;
    residualImpact: number;
    treatment: string;
    status: string;
  }>;
  documents: Array<{
    name: string;
    category: string;
    required: boolean;
    reason: string;
    status: string;
  }>;
};

function exportTitle(kind: ExportKind): string {
  if (kind === "soa") {
    return "Statement of Applicability";
  }

  if (kind === "risks") {
    return "Risk Register";
  }

  return "Document Set";
}

function yesNo(value: boolean): string {
  return value ? "Sì" : "No";
}

function introLines(company: ExportCompany, title: string): string[] {
  return [
    title,
    `Cliente: ${company.name}`,
    `Framework: ${company.framework}`,
    `Descrizione: ${company.profile?.customerDescription ?? ""}`,
    `Settore: ${company.profile?.industry ?? ""}`,
    `Dimensione: ${company.profile?.companySize ?? ""}`,
    "",
  ];
}

function buildSoaLines(company: ExportCompany): string[] {
  const lines = introLines(company, exportTitle("soa"));

  for (const item of company.controls) {
    lines.push(`${item.baselineControl.code} - ${item.baselineControl.title}`);
    lines.push(`Dominio: ${item.baselineControl.domain}`);
    lines.push(`Applicabile: ${yesNo(item.applicable)}`);
    lines.push(`Stato: ${item.status}`);
    lines.push(`Motivazione: ${item.justification}`);
    lines.push("");
  }

  return lines;
}

function buildRisksLines(company: ExportCompany): string[] {
  const lines = introLines(company, exportTitle("risks"));

  for (const item of company.risks) {
    lines.push(item.title);
    lines.push(`Categoria: ${item.category}`);
    lines.push(`Asset: ${item.asset}`);
    lines.push(`Minaccia: ${item.threat}`);
    lines.push(`Vulnerabilità: ${item.vulnerability}`);
    lines.push(`Likelihood: ${item.likelihood}`);
    lines.push(`Impact: ${item.impact}`);
    lines.push(`Score inerente: ${item.likelihood * item.impact}`);
    lines.push(`Score residuo: ${item.residualLikelihood * item.residualImpact}`);
    lines.push(`Trattamento: ${item.treatment}`);
    lines.push(`Stato: ${item.status}`);
    lines.push("");
  }

  return lines;
}

function buildDocumentsLines(company: ExportCompany): string[] {
  const lines = introLines(company, exportTitle("documents"));

  for (const item of company.documents) {
    lines.push(item.name);
    lines.push(`Categoria: ${item.category}`);
    lines.push(`Richiesto: ${yesNo(item.required)}`);
    lines.push(`Stato: ${item.status}`);
    lines.push(`Motivazione: ${item.reason}`);
    lines.push("");
    lines.push(generateDocumentContent(item.name, company));
    lines.push("");
    lines.push("------------------------------------------------------------");
    lines.push("");
  }

  return lines;
}

function buildLines(kind: ExportKind, company: ExportCompany): string[] {
  if (kind === "soa") {
    return buildSoaLines(company);
  }

  if (kind === "risks") {
    return buildRisksLines(company);
  }

  return buildDocumentsLines(company);
}

function escapePdfText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "?");
}

function wrapPdfLine(text: string, maxLength = 95): string[] {
  if (!text) {
    return [""];
  }

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length <= maxLength) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function buildPdfContent(lines: string[]): string {
  const commands: string[] = ["BT", "/F1 11 Tf", "50 790 Td", "14 TL"];

  for (const rawLine of lines) {
    const wrappedLines = wrapPdfLine(rawLine);

    for (const line of wrappedLines) {
      commands.push(`(${escapePdfText(line)}) Tj`);
      commands.push("T*");
    }
  }

  commands.push("ET");

  return commands.join("\n");
}

function createSimplePdfBuffer(lines: string[]): Buffer {
  const contentStream = buildPdfContent(lines);

  const objects: string[] = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    "2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj",
    `5 0 obj\n<< /Length ${Buffer.byteLength(contentStream, "utf8")} >>\nstream\n${contentStream}\nendstream\nendobj`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${object}\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, "utf8");

  pdf += `xref
0 ${objects.length + 1}
0000000000 65535 f 
`;

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n 
`;
  }

  pdf += `trailer
<< /Size ${objects.length + 1} /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF`;

  return Buffer.from(pdf, "utf8");
}

function buildIntroParagraphs(company: ExportCompany, title: string): Paragraph[] {
  return [
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 240 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Cliente: ${company.name}`, bold: true })],
    }),
    new Paragraph({ text: `Framework: ${company.framework}` }),
    new Paragraph({
      text: `Descrizione: ${company.profile?.customerDescription ?? ""}`,
    }),
    new Paragraph({
      text: `Settore: ${company.profile?.industry ?? ""}`,
    }),
    new Paragraph({
      text: `Dimensione: ${company.profile?.companySize ?? ""}`,
    }),
    new Paragraph({ text: "" }),
  ];
}

function buildDocxSoa(company: ExportCompany): Paragraph[] {
  const children: Paragraph[] = [];

  for (const item of company.controls) {
    children.push(
      new Paragraph({
        text: `${item.baselineControl.code} - ${item.baselineControl.title}`,
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({ text: `Dominio: ${item.baselineControl.domain}` }),
      new Paragraph({ text: `Applicabile: ${yesNo(item.applicable)}` }),
      new Paragraph({ text: `Stato: ${item.status}` }),
      new Paragraph({ text: `Motivazione: ${item.justification}` }),
      new Paragraph({ text: "" }),
    );
  }

  return children;
}

function buildDocxRisks(company: ExportCompany): Paragraph[] {
  const children: Paragraph[] = [];

  for (const item of company.risks) {
    children.push(
      new Paragraph({
        text: item.title,
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({ text: `Categoria: ${item.category}` }),
      new Paragraph({ text: `Asset: ${item.asset}` }),
      new Paragraph({ text: `Minaccia: ${item.threat}` }),
      new Paragraph({ text: `Vulnerabilità: ${item.vulnerability}` }),
      new Paragraph({ text: `Likelihood: ${item.likelihood}` }),
      new Paragraph({ text: `Impact: ${item.impact}` }),
      new Paragraph({
        text: `Score inerente: ${item.likelihood * item.impact}`,
      }),
      new Paragraph({
        text: `Score residuo: ${item.residualLikelihood * item.residualImpact}`,
      }),
      new Paragraph({ text: `Trattamento: ${item.treatment}` }),
      new Paragraph({ text: `Stato: ${item.status}` }),
      new Paragraph({ text: "" }),
    );
  }

  return children;
}

function contentToParagraphs(content: string): Paragraph[] {
  return content.split("\n").map((line) => new Paragraph({ text: line }));
}

function buildDocxDocuments(company: ExportCompany): Paragraph[] {
  const children: Paragraph[] = [];

  for (const item of company.documents) {
    const content = generateDocumentContent(item.name, company);

    children.push(
      new Paragraph({
        text: item.name,
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({ text: `Categoria: ${item.category}` }),
      new Paragraph({ text: `Richiesto: ${yesNo(item.required)}` }),
      new Paragraph({ text: `Stato: ${item.status}` }),
      new Paragraph({ text: `Motivazione: ${item.reason}` }),
      new Paragraph({ text: "" }),
      ...contentToParagraphs(content),
      new Paragraph({ text: "" }),
      new Paragraph({ text: "------------------------------------------------------------" }),
      new Paragraph({ text: "" }),
    );
  }

  return children;
}

export async function buildDocx(
  kind: ExportKind,
  company: ExportCompany,
): Promise<Buffer> {
  const title = exportTitle(kind);
  const children: Paragraph[] = [...buildIntroParagraphs(company, title)];

  if (kind === "soa") {
    children.push(...buildDocxSoa(company));
  } else if (kind === "risks") {
    children.push(...buildDocxRisks(company));
  } else {
    children.push(...buildDocxDocuments(company));
  }

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

export async function buildPdf(
  kind: ExportKind,
  company: ExportCompany,
): Promise<Buffer> {
  return createSimplePdfBuffer(buildLines(kind, company));
}
