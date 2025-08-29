import "server-only";

export async function getServerSession(): Promise<{ ok: true }> {
  return { ok: true };
}
