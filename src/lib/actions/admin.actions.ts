"use server";

import { withErrorHandling } from "./errorAction";
import { http } from "@/lib/http/httpClient";
import { getSessionToken } from "./_getSessionToken";
import type { AdminUser, CreateCitizenDTO } from "@/types/admin.interface";
import type { CitizenRow } from "@/types/citizens.interface";

export async function listAdminUsersAction() {
  return withErrorHandling<AdminUser[]>(async () => {
    const token = await getSessionToken();
    const res = await http<AdminUser[]>("/admin/users", {}, { token });
    return res.filter(admin => admin.roles.includes("ADMIN"));
  });
}

export async function listAdminCitizensAction() {
  return withErrorHandling<CitizenRow[]>(async () => {
    const token = await getSessionToken();
    return http<CitizenRow[]>("/admin/citizens", {}, { token });
  });
}

export async function createCitizenAction(payload: CreateCitizenDTO) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http("/admin/citizens", { method: "POST", body: payload }, { token });
    return { ok: true };
  });
}

export async function updateCitizenAction(id: string, profile: Record<string, unknown>) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http(`/admin/citizens/${id}`, { method: "PATCH", body: profile }, { token });
    return { ok: true };
  });
}

export async function createAdminUserAction(payload: { email: string; username: string; password: string }) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http("/admin/users/admin", { method: "POST", body: payload }, { token });
    return { ok: true };
  });
}
