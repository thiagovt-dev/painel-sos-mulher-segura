"use server";

import { getSessionToken } from "./_getSessionToken";
import { withErrorHandling } from "./errorAction";
import { http } from "@/lib/http/httpClient";
import type { VoiceRecording } from "@/types/voice-recordings.interface";

export async function listRecordingsByIncidentAction(incidentId: string) {
  return withErrorHandling<VoiceRecording[]>(async () => {
    const token = await getSessionToken();
    return http<VoiceRecording[]>(`/voice/recordings?incidentId=${encodeURIComponent(incidentId)}`, {}, { token });
  });
}
