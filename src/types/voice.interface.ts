export type VoiceMode = "PTT" | "FULL_DUPLEX";
export type ParticipantType = "UNIT" | "CITIZEN" | "DISPATCHER";
export interface JoinVoiceDTO {
  incidentId: string;
  participantType: ParticipantType;
  participantId: string;
  mode: VoiceMode;
  name: string;
}
export interface LeaveVoiceDTO { incidentId: string; name: string }
export interface CloseVoiceDTO { incidentId: string }
