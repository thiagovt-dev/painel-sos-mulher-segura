"use server";

import { withErrorHandling } from "./errorAction";
import { http } from "@/lib/http/httpClient";
import { getSessionToken } from "./_getSessionToken";
import type { CreateDispatchDTO, Dispatch, ResolveOrCancelDTO } from "@/types/dispatch.interface";

export async function listDispatchByUnitAction(params: { unitId: string; dispatchStatus?: string; incidentStatus?: string; }) {
  return withErrorHandling<Dispatch[]>(async () => {
    const token = await getSessionToken();
    const q = new URLSearchParams({ unitId: params.unitId });
    if (params.dispatchStatus) q.set("dispatchStatus", params.dispatchStatus);
    if (params.incidentStatus) q.set("incidentStatus", params.incidentStatus);
    return http<Dispatch[]>(`/dispatch?${q}`, {}, { token });
  });
}

export async function createDispatchAction(payload: CreateDispatchDTO) {
  return withErrorHandling<Dispatch>(async () => {
    const token = await getSessionToken();
    const created = await http<Dispatch>("/dispatch", { method: "POST", body: payload }, { token });
    return created;
  });
}

export async function acceptDispatchAction(id: string) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http(`/dispatch/${id}/accept`, { method: "POST" }, { token });
    return { ok: true };
  });
}

export async function resolveDispatchAction(id: string, payload: ResolveOrCancelDTO) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http(`/dispatch/${id}/resolve`, { method: "POST", body: payload }, { token });
    return { ok: true };
  });
}

export async function cancelDispatchAction(id: string, payload: ResolveOrCancelDTO) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http(`/dispatch/${id}/cancel`, { method: "POST", body: payload }, { token });
    return { ok: true };
  });
}
