import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import PDFDocument from "pdfkit";

type ExportCompany = {
  name: string;
  framework: string;
  profile?: {
    customerDescription?: string | null;
    uploadedContext?: string | null;
  } | null;
  controls: Array<{
    baselineControl: { code: string; title: string };
    applicable: boolean;
    justification: string;
    status: string;
  }>;
  risks: Array<{
    title: string;
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

function titlePage(company: ExportCompany, title: string) {
  return [
    new Paragraph({ text: title, heading: HeadingLevel.TITLE, spacing: { after: 240 } }),
    new Paragraph({ children: [new TextRun({ text: `Cliente: ${company.name}`, bold: true })] }),
    new Paragraph({ text: `Framework: ${company.framework}` }),
    new Paragraph({ text: `Descrizione: ${company.profile?.customerDescription ?? ""}` }),
    new Paragraph({ text: `Contesto raccolto: ${company.profile?.uploadedContext ?? ""}` })
  ];
}

export async function buildDocx(kind: "soa" | "risks" | "documents", company: ExportCompany) {
  const children: Paragraph[] = [];
  const title =
    kind === "soa" ? "Statement of Applicability" : kind === "risks" ? "Risk Register" : "Document Set";
  children.push(...titlePage(company, title));
  children.push(new Paragraph({ text: "" }));

  if (kind === "soa") {
    for (const item of company.controls) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${item.baselineControl.code} - ${item.baselineControl.title}`, bold: true })],
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({ text: `Applicabile: ${item.applicable ? "Sì" : "No"}` }),
        new Paragraph({ text: `Motivazione: ${item.justification}` }),
        new Paragraph({ text: `Stato: ${item.status}` })
      );
    }
  }

  if (kind === "risks") {
    for (const item of company.risks) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: item.title, bold: true })],
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({ text: `Asset: ${item.asset}` }),
        new Paragraph({ text: `Minaccia: ${item.threat}` }),
        new Paragraph({ text: `Vulnerabilità: ${item.vulnerability}` }),
        new Paragraph({ text: `Score inerente: ${item.likelihood * item.impact}` }),
        new Paragraph({ text: `Score residuo: ${item.residualLikelihood * item.residualImpact}` }),
        new Paragraph({ text: `Trattamento: ${item.treatment}` }),
        new Paragraph({ text: `Stato: ${item.status}` })
      );
    }
  }

  if (kind === "documents") {
    for (const item of company.documents) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: item.name, bold: true })],
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({ text: `Categoria: ${item.category}` }),
        new Paragraph({ text: `Necessario: ${item.required ? "Sì" : "No"}` }),
        new Paragraph({ text: `Motivazione: ${item.reason}` }),
        new Paragraph({ text: `Stato: ${item.status}` })
      );
    }
  }

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBuffer(doc);
}

export async function buildPdf(kind: "soa" | "risks" | "documents", company: ExportCompany): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 48, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    const title =
      kind === "soa" ? "Statement of Applicability" : kind === "risks" ? "Risk Register" : "Document Set";

    doc.fontSize(20).text(title);
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Cliente: ${company.name}`);
    doc.text(`Framework: ${company.framework}`);
    if (company.profile?.customerDescription) doc.text(`Descrizione: ${company.profile.customerDescription}`);
    if (company.profile?.uploadedContext) doc.text(`Contesto: ${company.profile.uploadedContext}`);
    doc.moveDown();

    if (kind === "soa") {
      company.controls.forEach((item) => {
        doc.fontSize(13).text(`${item.baselineControl.code} - ${item.baselineControl.title}`);
        doc.fontSize(10).text(`Applicabile: ${item.applicable ? "Sì" : "No"}`);
        doc.text(`Motivazione: ${item.justification}`);
        doc.text(`Stato: ${item.status}`);
        doc.moveDown();
      });
    }

    if (kind === "risks") {
      company.risks.forEach((item) => {
        doc.fontSize(13).text(item.title);
        doc.fontSize(10).text(`Asset: ${item.asset}`);
        doc.text(`Minaccia: ${item.threat}`);
        doc.text(`Vulnerabilità: ${item.vulnerability}`);
        doc.text(`Score inerente: ${item.likelihood * item.impact}`);
        doc.text(`Score residuo: ${item.residualLikelihood * item.residualImpact}`);
        doc.text(`Trattamento: ${item.treatment}`);
        doc.text(`Stato: ${item.status}`);
        doc.moveDown();
      });
    }

    if (kind === "documents") {
      company.documents.forEach((item) => {
        doc.fontSize(13).text(item.name);
        doc.fontSize(10).text(`Categoria: ${item.category}`);
        doc.text(`Necessario: ${item.required ? "Sì" : "No"}`);
        doc.text(`Motivazione: ${item.reason}`);
        doc.text(`Stato: ${item.status}`);
        doc.moveDown();
      });
    }

    doc.end();
  });
}
