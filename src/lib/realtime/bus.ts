import "server-only";
import { EventEmitter } from "events";

export type NotifyEvent = {
  title?: string;
  meta?: { kind?: 'incident' | 'dispatch'; id?: string; status?: string; [k: string]: any };
  type?: string;
  payload?: any;
};

class Bus extends EventEmitter {}

// Singleton bus instance for this process
export const bus = globalThis.__notify_bus__ as Bus || new Bus();
// @ts-ignore
if (!globalThis.__notify_bus__) globalThis.__notify_bus__ = bus;

export function emitNotify(ev: NotifyEvent) {
  bus.emit('notify', ev);
}

