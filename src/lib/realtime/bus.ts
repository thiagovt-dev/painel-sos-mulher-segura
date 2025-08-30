import "server-only";
import { EventEmitter } from "events";

export type NotifyEvent = {
  title?: string;
  meta?: { kind?: 'incident' | 'dispatch'; id?: string; status?: string; [k: string]: unknown };
  type?: string;
  payload?: unknown;
};

class Bus extends EventEmitter {}

// Singleton bus instance for this process
declare global {
  var __notify_bus__: Bus | undefined;
}

export const bus: Bus = globalThis.__notify_bus__ ?? (globalThis.__notify_bus__ = new Bus());

export function emitNotify(ev: NotifyEvent) {
  bus.emit('notify', ev);
}
