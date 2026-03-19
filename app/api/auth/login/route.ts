import { z } from "zod";
import { authenticate, createSession } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Dati non validi." }, { status: 400 });
  }

  const sessionUser = await authenticate(parsed.data.username, parsed.data.password);

  if (!sessionUser) {
    return Response.json({ error: "Credenziali non valide." }, { status: 401 });
  }

  await createSession(sessionUser);

  return Response.json({ ok: true });
}
