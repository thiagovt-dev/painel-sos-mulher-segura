import RecordingsTable from "./_components/RecordingsTable";
import { listRecordingsByIncidentAction } from "@/lib/actions/voice-recordings.actions";
import type { VoiceRecording } from "@/types/voice-recordings.interface";

export default async function VoiceRecordingsPage({ searchParams }: { searchParams: Promise<{ incidentId?: string }> }) {
  const { incidentId } = await searchParams;
  const res = incidentId 
    ? await listRecordingsByIncidentAction(incidentId) 
    : { success: true, data: [] as VoiceRecording[] };
  return <RecordingsTable rows={res.success ? res.data! : []} error={res.success ? undefined : res.error} />;
}
