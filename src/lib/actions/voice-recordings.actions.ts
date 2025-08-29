"use server";

import { getSessionToken } from "./_getSessionToken";
import { withErrorHandling } from "./errorAction";
import { http } from "@/lib/http/httpClient";

export async function listRecordingsByIncidentAction(incidentId: string) {
  return withErrorHandling<any[]>(async () => {
    const token = await getSessionToken();
    return http<any[]>(`/voice/recordings?incidentId=${encodeURIComponent(incidentId)}`, {}, { token });
  });
}
