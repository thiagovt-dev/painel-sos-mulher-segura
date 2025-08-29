"use server";

import { withErrorHandling } from "./errorAction";
import { http } from "@/lib/http/httpClient";
import { getSessionToken } from "./_getSessionToken";
import type { Incident, CloseIncidentDTO, CancelIncidentDTO } from "@/types/incidents.interface";

export async function listIncidentsAction(params?: { status?: string }) {
  return withErrorHandling<Incident[]>(async () => {
    const token = await getSessionToken();
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    const data = await http<Incident[]>(
      `/incidents${query.size ? `?${query}` : ""}`,
      {},
      { token }
    );
    return data;
  });
}

export async function closeIncidentAction(id: string, payload: CloseIncidentDTO) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http(`/incidents/${id}/close`, { method: "POST", body: payload }, { token });
    return { ok: true };
  });
}

export async function cancelIncidentAction(id: string, payload: CancelIncidentDTO) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http(`/incidents/${id}/cancel`, { method: "POST", body: payload }, { token });
    return { ok: true };
  });
}
