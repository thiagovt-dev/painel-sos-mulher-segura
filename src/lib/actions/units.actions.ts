"use server";

import { withErrorHandling } from "./errorAction";
import { http } from "@/lib/http/httpClient";
import { getSessionToken } from "./_getSessionToken";
import type { Unit, CreateUnitDTO, UpdateUnitDTO } from "@/types/units.interface";

export async function listUnitsAction() {
  return withErrorHandling<Unit[]>(async () => {
    const token = await getSessionToken();
    return http<Unit[]>("/units", {}, { token });
  });
}

export async function createUnitAction(payload: CreateUnitDTO) {
  return withErrorHandling<Unit>(async () => {
    const token = await getSessionToken();
    return http<Unit>("/units", { method: "POST", body: payload }, { token });
  });
}

export async function updateUnitAction(id: string, payload: UpdateUnitDTO) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http(`/units/${id}`, { method: "PATCH", body: payload }, { token });
    return { ok: true } as const;
  });
}

export async function resetUnitPinAction(id: string) {
  return withErrorHandling<{ unitId: string; pin: string }>(async () => {
    const token = await getSessionToken();
    return http<{ unitId: string; pin: string }>(`/units/${id}/reset-pin`, { method: "POST" }, { token });
  });
}
