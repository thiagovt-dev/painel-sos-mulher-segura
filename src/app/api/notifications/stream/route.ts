export const runtime = 'nodejs';

import { emitNotify } from '@/lib/realtime/bus';
import { bus } from '@/lib/realtime/bus';

function sseId() {
  return Math.random().toString(36).slice(2);
}

export async function GET() {
  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      send({ type: 'ready' });

      const onNotify = (ev: any) => {
        try { send({ type: 'notify', ...ev }); } catch {}
      };
      bus.on('notify', onNotify);

      const ping = setInterval(() => {
        try { controller.enqueue(encoder.encode(`: ping\n\n`)); } catch {}
      }, 25000);

      const cleanup = () => {
        if (closed) return; closed = true;
        clearInterval(ping);
        bus.off('notify', onNotify);
        try { controller.close(); } catch {}
      };

      // @ts-ignore - not directly available; rely on client disconnect closing the stream
      (controller as any).cleanup = cleanup;
    },
    cancel() {
      closed = true;
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

