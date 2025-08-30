export const runtime = 'nodejs';

import { emitNotify } from '@/lib/realtime/bus';

export async function POST(req: Request) {
  const secret = process.env.WEBHOOK_SECRET;
  const got = req.headers.get('x-webhook-secret') || req.headers.get('authorization')?.replace('Bearer ', '') || '';
  if (!secret || got !== secret) {
    return new Response('Unauthorized', { status: 401 });
  }
  try {
    const body = await req.json();
    // Expect body like { title?: string, meta?: {...}, type?: string, payload?: any }
    emitNotify(body);
  } catch {}
  return new Response(null, { status: 204 });
}

