import { useAudioRecorder, useAudioRecorderState, RecordingPresets, RecorderState, requestRecordingPermissionsAsync } from "expo-audio";
import { useState } from "react";

type UseAudioRecording = {
  toggleRecording: () => void,
  startRecording: () => Promise<void>,
  stopRecording: () => Promise<void>,
  removeRecord: (url: string) => void,
  resetRecord: () => void,
  setRecords: (value: RecorderState[]) => void,
  recording: RecorderState | null,
  records: RecorderState[]
}

export const useAudioRecording = (): UseAudioRecording => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recording = useAudioRecorderState(audioRecorder);

  const [records, setRecords] = useState<RecorderState[]>([])

  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
    }
  };

  const stopRecording = async () => {
    await audioRecorder.stop();

    setRecords(prev => [...prev, recording])
  };

  const removeRecord = (url: string) => setRecords(prev => prev.filter(item => item.url !== url));

  const resetRecord = () => setRecords([])

  const toggleRecording = async () => {
    const { granted } = await requestRecordingPermissionsAsync()

    if(granted){
      if (recording?.isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };
  return {toggleRecording, startRecording, stopRecording, removeRecord, resetRecord, recording, records, setRecords};
}