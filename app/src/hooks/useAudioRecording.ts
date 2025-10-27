import { useAudioRecorder, useAudioRecorderState, RecordingPresets, RecorderState, requestRecordingPermissionsAsync, AudioQuality, IOSOutputFormat } from "expo-audio";
import { useState } from "react";

type UseAudioRecording = {
  toggleRecording: () => void,
  startRecording: () => Promise<void>,
  stopRecording: () => Promise<void>,
  removeRecord: (url: string | null) => void,
  resetRecord: () => void,
  setRecords: (value: RecorderState[]) => void,
  recording: RecorderState | null,
  records: RecorderState[]
  isProcessing: boolean
}

export const useAudioRecording = (): UseAudioRecording => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recording = useAudioRecorderState(audioRecorder);

  const [records, setRecords] = useState<RecorderState[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const startRecording = async () => {
    if (isProcessing || recording?.isRecording) return;
    setIsProcessing(true);
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  const stopRecording = async () => {
    if (isProcessing || !recording?.isRecording) return;
    setIsProcessing(true);
    await audioRecorder.stop();

    if (recording && recording.durationMillis >= 2000) {
      setRecords(prev => {
        if (recording.url && prev.some(r => r.url === recording.url)) {
          return prev;
        }
        return [...prev, recording];
      });
    }
    setIsProcessing(false);
  };

  const removeRecord = (url: string | null) => setRecords(prev => prev.filter(item => item.url !== url));

  const resetRecord = () => setRecords([]);

  const toggleRecording = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const { granted } = await requestRecordingPermissionsAsync();
    if (granted) {
      if (recording?.isRecording) await stopRecording();
      if (!recording?.isRecording) await startRecording();
    }
    setIsProcessing(false);
  };

  return { toggleRecording, startRecording, stopRecording, removeRecord, resetRecord, recording, records, setRecords, isProcessing };
}