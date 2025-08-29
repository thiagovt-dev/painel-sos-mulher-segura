"use server";

import { withErrorHandling } from "./errorAction";
import { http } from "@/lib/http/httpClient";
import { getSessionToken } from "./_getSessionToken";
import type { Unit } from "@/types/units.interface";

export async function listUnitsAction() {
  return withErrorHandling<Unit[]>(async () => {
    const token = await getSessionToken();
    return http<Unit[]>("/units", {}, { token });
  });
}
