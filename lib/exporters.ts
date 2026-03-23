// lib/exporters.ts

import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import PDFDocument from "pdfkit";

type ExportKind = "soa" | "risks" | "documents";

type ExportCompany = {
  name: string;
  framework: string;
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

function buildIntro(company: ExportCompany, title: string): Paragraph[] {
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

function buildDocxDocuments(company: ExportCompany): Paragraph[] {
  const children: Paragraph[] = [];

  for (const item of company.documents) {
    children.push(
      new Paragraph({
        text: item.name,
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({ text: `Categoria: ${item.category}` }),
      new Paragraph({ text: `Richiesto: ${yesNo(item.required)}` }),
      new Paragraph({ text: `Stato: ${item.status}` }),
      new Paragraph({ text: `Motivazione: ${item.reason}` }),
      new Paragraph({ text: "" }),
    );
  }

  return children;
}

export async function buildDocx(kind: ExportKind, company: ExportCompany): Promise<Buffer> {
  const title = exportTitle(kind);
  const children: Paragraph[] = [...buildIntro(company, title)];

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

function writePdfHeader(doc: PDFKit.PDFDocument, company: ExportCompany, title: string) {
  doc.fontSize(20).text(title);
  doc.moveDown(0.5);
  doc.fontSize(11).text(`Cliente: ${company.name}`);
  doc.text(`Framework: ${company.framework}`);
  doc.text(`Descrizione: ${company.profile?.customerDescription ?? ""}`);
  doc.text(`Settore: ${company.profile?.industry ?? ""}`);
  doc.text(`Dimensione: ${company.profile?.companySize ?? ""}`);
  doc.moveDown();
}

function writePdfSoa(doc: PDFKit.PDFDocument, company: ExportCompany) {
  for (const item of company.controls) {
    doc.fontSize(13).text(`${item.baselineControl.code} - ${item.baselineControl.title}`);
    doc.fontSize(10).text(`Dominio: ${item.baselineControl.domain}`);
    doc.text(`Applicabile: ${yesNo(item.applicable)}`);
    doc.text(`Stato: ${item.status}`);
    doc.text(`Motivazione: ${item.justification}`);
    doc.moveDown();
  }
}

function writePdfRisks(doc: PDFKit.PDFDocument, company: ExportCompany) {
  for (const item of company.risks) {
    doc.fontSize(13).text(item.title);
    doc.fontSize(10).text(`Categoria: ${item.category}`);
    doc.text(`Asset: ${item.asset}`);
    doc.text(`Minaccia: ${item.threat}`);
    doc.text(`Vulnerabilità: ${item.vulnerability}`);
    doc.text(`Likelihood: ${item.likelihood}`);
    doc.text(`Impact: ${item.impact}`);
    doc.text(`Score inerente: ${item.likelihood * item.impact}`);
    doc.text(`Score residuo: ${item.residualLikelihood * item.residualImpact}`);
    doc.text(`Trattamento: ${item.treatment}`);
    doc.text(`Stato: ${item.status}`);
    doc.moveDown();
  }
}

function writePdfDocuments(doc: PDFKit.PDFDocument, company: ExportCompany) {
  for (const item of company.documents) {
    doc.fontSize(13).text(item.name);
    doc.fontSize(10).text(`Categoria: ${item.category}`);
    doc.text(`Richiesto: ${yesNo(item.required)}`);
    doc.text(`Stato: ${item.status}`);
    doc.text(`Motivazione: ${item.reason}`);
    doc.moveDown();
  }
}

export async function buildPdf(kind: ExportKind, company: ExportCompany): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 48,
        size: "A4",
      });

      const chunks: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => {
        chunks.push(Buffer.from(chunk));
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", (error: Error) => {
        reject(error);
      });

      writePdfHeader(doc, company, exportTitle(kind));

      if (kind === "soa") {
        writePdfSoa(doc, company);
      } else if (kind === "risks") {
        writePdfRisks(doc, company);
      } else {
        writePdfDocuments(doc, company);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
