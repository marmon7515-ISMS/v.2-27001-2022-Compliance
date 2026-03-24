import { ControlStatus } from "@prisma/client";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateControlSchema = z.object({
  controlId: z.string().min(1),
  manualApplicable: z.boolean().nullable().optional(),
  manualJustification: z.string().nullable().optional(),
  status: z.nativeEnum(ControlStatus).optional(),
  ownerName: z.string().optional(),
  evidence: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> },
) {
  const session = await getSessionUser();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId } = await params;

  if (session.companyId !== "all" && session.companyId !== companyId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = updateControlSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid payload",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const existing = await prisma.companyControl.findFirst({
    where: {
      id: parsed.data.controlId,
      companyId,
    },
  });

  if (!existing) {
    return Response.json({ error: "Control not found" }, { status: 404 });
  }

  const nextManualApplicable =
    parsed.data.manualApplicable !== undefined
      ? parsed.data.manualApplicable
      : existing.manualApplicable;

  const nextManualJustification =
    parsed.data.manualJustification !== undefined
      ? parsed.data.manualJustification
      : existing.manualJustification;

  const finalApplicable =
    nextManualApplicable !== null && nextManualApplicable !== undefined
      ? nextManualApplicable
      : existing.autoApplicable;

  const finalJustification =
    nextManualJustification !== null &&
    nextManualJustification !== undefined &&
    nextManualJustification.trim() !== ""
      ? nextManualJustification
      : existing.autoJustification;

  const updated = await prisma.companyControl.update({
    where: { id: existing.id },
    data: {
      manualApplicable:
        parsed.data.manualApplicable !== undefined
          ? parsed.data.manualApplicable
          : undefined,
      manualJustification:
        parsed.data.manualJustification !== undefined
          ? parsed.data.manualJustification
          : undefined,
      ownerName: parsed.data.ownerName !== undefined ? parsed.data.ownerName : undefined,
      evidence: parsed.data.evidence !== undefined ? parsed.data.evidence : undefined,
      status: parsed.data.status !== undefined ? parsed.data.status : undefined,

      applicable: finalApplicable,
      justification: finalJustification,
    },
  });

  return Response.json({
    message: "Controllo aggiornato.",
    control: updated,
  });
}