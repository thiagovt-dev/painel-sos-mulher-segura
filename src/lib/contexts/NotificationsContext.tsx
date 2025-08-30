"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/contexts/ToastContext";
import type { Incident } from "@/types/incidents.interface";
import { listIncidentsAction } from "@/lib/actions/incidents.actions";
import { listUnitsAction } from "@/lib/actions/units.actions";
import { listDispatchByUnitAction } from "@/lib/actions/dispatch.actions";

export type NotificationItem = {
  id: string;
  title: string;
  createdAt: number;
  read?: boolean;
  meta?: { kind: 'incident' | 'dispatch'; id: string; status: string };
};

type Ctx = {
  items: NotificationItem[];
  unread: number;
  markAllRead: () => void;
};

const Ctx = React.createContext<Ctx | null>(null);

export function useNotifications() {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("NotificationsProvider ausente");
  return c;
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<NotificationItem[]>([]);
  const itemsRef = React.useRef<NotificationItem[]>([]);
  React.useEffect(() => { itemsRef.current = items; }, [items]);

  const incidentSnapRef = React.useRef<Record<string, string>>({});
  const dispatchSnapRef = React.useRef<Record<string, string>>({});
  // Persisted maps of last notified status per id (survive reload)
  const incidentNotifiedRef = React.useRef<Record<string, string>>({});
  const dispatchNotifiedRef = React.useRef<Record<string, string>>({});
  const router = useRouter();
  const { show } = useToast();
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const inc = localStorage.getItem('notified_incidents_v1');
        const dsp = localStorage.getItem('notified_dispatches_v1');
        if (inc) incidentNotifiedRef.current = JSON.parse(inc);
        if (dsp) dispatchNotifiedRef.current = JSON.parse(dsp);
      }
    } catch {}
  }, []);

  const [units, setUnits] = React.useState<{ id: string; name: string }[]>([]);
  const unitsRef = React.useRef<{ id: string; name: string }[]>([]);
  React.useEffect(() => { unitsRef.current = units; }, [units]);
  const lastUnitsFetchRef = React.useRef(0);

  const [unitCursor, setUnitCursor] = React.useState(0);
  const unitCursorRef = React.useRef(0);
  React.useEffect(() => { unitCursorRef.current = unitCursor; }, [unitCursor]);

  const [sseReady, setSseReady] = React.useState(false);
  // Prefer SSE stream over polling
  React.useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/notifications/stream');
      es.onopen = () => { setSseReady(true); };
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data || '{}');
          if (data?.type !== 'notify') return;
          const now = Date.now();
          const additions: NotificationItem[] = [];
          if (data.title) {
            additions.push({ id: `${now}-${Math.random()}`, title: data.title, createdAt: now, meta: data.meta });
          } else if (data.meta?.kind && data.meta?.id) {
            const kind = data.meta.kind as 'incident'|'dispatch';
            const id = data.meta.id as string;
            const status = String(data.meta.status || '');
            const title = kind === 'incident' ? `Incidente ${id} (${status})` : `Dispatch ${id} (${status})`;
            additions.push({ id: `${kind}-${id}-${now}`, title, createdAt: now, meta: { kind, id, status } });
          }
          if (additions.length) {
            const existingTitles = new Set(itemsRef.current.map(i => i.title));
            const unique = additions.filter(a => !existingTitles.has(a.title));
            if (unique.length) {
              setItems(prev => [...unique, ...prev].slice(0, 20));
              unique.forEach(u => {
                if (u.meta?.kind === 'incident' && u.meta.id && u.meta.status) {
                  incidentNotifiedRef.current[u.meta.id] = u.meta.status;
                }
                if (u.meta?.kind === 'dispatch' && u.meta.id && u.meta.status) {
                  dispatchNotifiedRef.current[u.meta.id] = u.meta.status;
                }
              });
            }
          }
        } catch {}
      };
      es.onerror = () => {
        setSseReady(false);
      };
    } catch {}
    return () => { try { es?.close(); } catch {} };
  }, []);

  React.useEffect(() => {
    let mounted = true;
    let visTimer: ReturnType<typeof setTimeout> | null = null;
    if (sseReady) {
      // SSE ativo; não fazer polling
      return () => {};
    }
    async function tick() {
      try {
        if (!mounted) return;
        if (typeof document !== 'undefined' && document.hidden) return; // pause quando aba estiver em background
        // Refresh units list every ~60s
        const now = Date.now();
        if (!unitsRef.current.length || now - lastUnitsFetchRef.current > 60000) {
          const ures = await listUnitsAction();
          if (!ures.success && ures.error?.toLowerCase().includes('sessão expirada')) {
            show('Sua sessão expirou. Faça login novamente.', 'warning');
            router.replace('/login');
            return;
          }
          if (!mounted) return;
          if (ures.success) {
            lastUnitsFetchRef.current = now;
            setUnits(ures.data!.map(u => ({ id: u.id, name: u.name })));
          }
        }

        // Incidents snapshot and detection
        const [open, inDisp, resolved, canceled] = await Promise.all([
          listIncidentsAction({ status: 'OPEN' }),
          listIncidentsAction({ status: 'IN_DISPATCH' }),
          listIncidentsAction({ status: 'RESOLVED' }),
          listIncidentsAction({ status: 'CANCELED' }),
        ]);
        if (!mounted) return;
        const all: Incident[] = [
          ...(open.success ? open.data! : []),
          ...(inDisp.success ? inDisp.data! : []),
          ...(resolved.success ? resolved.data! : []),
          ...(canceled.success ? canceled.data! : []),
        ];
        if ((!open.success || !inDisp.success || !resolved.success || !canceled.success)) {
          const err = open.error || inDisp.error || resolved.error || canceled.error || '';
          if (err.toLowerCase().includes('sessão expirada')) {
            show('Sua sessão expirou. Faça login novamente.', 'warning');
            router.replace('/login');
            return;
          }
        }
        const nextIncidentMap: Record<string, string> = {};
        all.forEach(i => { nextIncidentMap[i.id] = i.status; });

        const prevNotifiedIncident = incidentNotifiedRef.current;
        const newOnes = all.filter(i => !prevNotifiedIncident[i.id]);
        const changed = all.filter(i => prevNotifiedIncident[i.id] && prevNotifiedIncident[i.id] !== i.status);

        const additions: NotificationItem[] = [];
        newOnes.forEach(i => additions.push({ id: `new-${i.id}-${now}` as string, title: `Novo incidente ${i.code || i.id} (Aberto)`, createdAt: now, meta: { kind: 'incident', id: i.id, status: i.status } }));
        changed.forEach(i => additions.push({ id: `chg-${i.id}-${now}` as string, title: `Incidente ${i.code || i.id} mudou para ${i.status}`, createdAt: now, meta: { kind: 'incident', id: i.id, status: i.status } }));

        // Dispatch polling by batches; merge snapshot instead of overwriting
        if (unitsRef.current.length) {
          const batchSize = 10;
          const start = unitCursorRef.current % unitsRef.current.length;
          const end = Math.min(start + batchSize, unitsRef.current.length);
          const batch = unitsRef.current.slice(start, end);
          const results = await Promise.all(batch.map(u => listDispatchByUnitAction({ unitId: u.id })));
          if (!mounted) return;
          const dispatches: { id: string; status: string; label: string }[] = [];
          results.forEach((d, idx) => {
            if (d.success) d.data!.forEach(x => dispatches.push({ id: x.id, status: x.status, label: `${batch[idx].name} · ${x.status}` }));
          });
          const dMapBatch: Record<string, string> = {};
          dispatches.forEach(d => { dMapBatch[d.id] = d.status; });
          const prevNotifiedDispatch = dispatchNotifiedRef.current;
          const dNew = dispatches.filter(d => !prevNotifiedDispatch[d.id]);
          const dChanged = dispatches.filter(d => prevNotifiedDispatch[d.id] && prevNotifiedDispatch[d.id] !== d.status);
          dNew.forEach(d => additions.push({ id: `dnew-${d.id}-${now}`, title: `Novo dispatch (${d.label})`, createdAt: now, meta: { kind: 'dispatch', id: d.id, status: d.status } }));
          dChanged.forEach(d => additions.push({ id: `dchg-${d.id}-${now}`, title: `Dispatch mudou para ${d.status}`, createdAt: now, meta: { kind: 'dispatch', id: d.id, status: d.status } }));
          // Merge batch snapshot
          dispatchSnapRef.current = { ...dispatchSnapRef.current, ...dMapBatch };
          setUnitCursor((c) => (c + batchSize) % Math.max(1, unitsRef.current.length));
        }

        // Deduplicate additions against recent items by title
        if (additions.length) {
          const existingTitles = new Set(itemsRef.current.map(i => i.title));
          const unique = additions.filter(a => !existingTitles.has(a.title));
          if (unique.length) {
            // Keep a lightweight recent history (max 20)
            setItems(prev => [...unique, ...prev].slice(0, 20));
            // Atualiza mapas de itens notificados e persiste
            unique.forEach(u => {
              if (u.meta?.kind === 'incident') {
                incidentNotifiedRef.current[u.meta.id] = u.meta.status;
              } else if (u.meta?.kind === 'dispatch') {
                dispatchNotifiedRef.current[u.meta.id] = u.meta.status;
              }
            });
            try {
              if (typeof window !== 'undefined') {
                localStorage.setItem('notified_incidents_v1', JSON.stringify(incidentNotifiedRef.current));
                localStorage.setItem('notified_dispatches_v1', JSON.stringify(dispatchNotifiedRef.current));
              }
            } catch {}
            if (typeof window !== 'undefined' && 'Notification' in window) {
              if (Notification.permission === 'granted') {
                unique.forEach(n => new Notification('Notificação', { body: n.title }));
              }
            }
          }
        }
        incidentSnapRef.current = nextIncidentMap;
      } catch {}
    }
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(()=>{});
    }
    const onVis = () => {
      // Debounce: ao voltar visível, agenda tick em 500ms
      if (typeof document === 'undefined') return;
      if (!document.hidden) {
        if (visTimer) clearTimeout(visTimer);
        visTimer = setTimeout(() => { tick(); }, 500);
      }
    };
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVis);
    tick();
    // Poll every 10s to reduce load
    const interval = setInterval(tick, 10000);
    return () => { mounted = false; if (visTimer) clearTimeout(visTimer); clearInterval(interval); if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVis); };
  }, [sseReady, router, show]);

  const unread = items.filter(i => !i.read).length;
  const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, read: true })));

  return (
    <Ctx.Provider value={{ items, unread, markAllRead }}>
      {children}
    </Ctx.Provider>
  );
}
