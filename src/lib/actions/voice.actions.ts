"use server";

import { withErrorHandling } from "./errorAction";
import { http } from "@/lib/http/httpClient";
import { getSessionToken } from "./_getSessionToken";
import type { CloseVoiceDTO, JoinVoiceDTO, LeaveVoiceDTO } from "@/types/voice.interface";

export async function joinVoiceAction(payload: JoinVoiceDTO) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    const data = await http<{ url?: string; token?: string }>(
      "/voice/join", { method: "POST", body: payload }, { token }
    );
    return data; // ex.: credenciais LiveKit
  });
}

export async function leaveVoiceAction(payload: LeaveVoiceDTO) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http("/voice/leave", { method: "POST", body: payload }, { token });
    return { ok: true };
  });
}

export async function closeVoiceAction(payload: CloseVoiceDTO) {
  return withErrorHandling(async () => {
    const token = await getSessionToken();
    await http("/voice/close", { method: "POST", body: payload }, { token });
    return { ok: true };
  });
}
