"use server";

import { withErrorHandling } from "./errorAction";
import { http } from "@/lib/http/httpClient";
import { getSessionToken } from "./_getSessionToken";
import type { AdminUser, CreateCitizenDTO } from "@/types/admin.interface";

export async function listAdminUsersAction() {
  return withErrorHandling<AdminUser[]>(async () => {
    const token = await getSessionToken();
    return http<AdminUser[]>("/admin/users", {}, { token });
  });
}

export async function listAdminCitizensAction() {
  return withErrorHandling<any[]>(async () => {
    const token = await getSessionToken();
    return http<any[]>("/admin/citizens", {}, { token });
  });
}

export async function createCitizenAction(payload: CreateCitizenDTO) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http("/admin/citizens", { method: "POST", body: payload }, { token });
    return { ok: true };
  });
}
