"use server";

import { withErrorHandling } from "./errorAction";
import { http } from "@/lib/http/httpClient";
import { getSessionToken } from "./_getSessionToken";
import type { CreateEmergencyContactDTO, EmergencyContact, UpdateEmergencyContactDTO } from "@/types/emergency-contacts.interface";

export async function listEmergencyContactsAction() {
  return withErrorHandling<EmergencyContact[]>(async () => {
    const token = await getSessionToken();
    return http<EmergencyContact[]>("/emergency-contacts", {}, { token });
  });
}

export async function listCitizenEmergencyContactsAction(citizenId: string) {
  return withErrorHandling<EmergencyContact[]>(async () => {
    const token = await getSessionToken();
    return http<EmergencyContact[]>(`/admin/citizens/${citizenId}/contacts`, {}, { token });
  });
}

export async function createEmergencyContactAction(payload: CreateEmergencyContactDTO) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http("/emergency-contacts", { method: "POST", body: payload }, { token });
    return { ok: true };
  });
}

export async function updateEmergencyContactAction(id: string, payload: UpdateEmergencyContactDTO) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http(`/emergency-contacts/${id}`, { method: "PATCH", body: payload }, { token });
    return { ok: true };
  });
}

export async function deleteEmergencyContactAction(id: string) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http(`/emergency-contacts/${id}`, { method: "DELETE" }, { token });
    return { ok: true };
  });
}
