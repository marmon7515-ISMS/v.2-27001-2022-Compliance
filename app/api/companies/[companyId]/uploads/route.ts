import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ companyId: string }> }) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { companyId } = await params;
  if (session.companyId !== "all" && session.companyId !== companyId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Missing file" }, { status: 400 });
  }

  const mimeType = file.type || "application/octet-stream";
  const sizeBytes = file.size;
  let extractedText = "";

  if (mimeType.startsWith("text/") || /json|xml|csv/.test(mimeType) || /\.(txt|md|csv|json|xml)$/i.test(file.name)) {
    extractedText = await file.text();
  }

  const upload = await prisma.companyUpload.create({
    data: {
      companyId,
      name: file.name,
      mimeType,
      sizeBytes,
      extractedText,
      analysisNotes: extractedText ? "Contenuto testuale disponibile per analisi." : "File caricato; parsing automatico da estendere per PDF/DOCX."
    }
  });

  return Response.json({ id: upload.id, message: "File caricato.", parsedText: Boolean(extractedText) });
}
