import { formatTime } from "@/utils/formatData";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";

import { Text, TouchableOpacity, View } from "react-native";

interface AudioPlayerProps {
  url: string | null,
  onRemove?: (s: string | null) => void
}

export default function AudioPlayer ({ url, onRemove }: AudioPlayerProps) {
  const player = useAudioPlayer({ uri: url ? url : "" });
  const [isPlaying, setIsPlaying] = useState<boolean>(Boolean(player.playing));

  const toggleAudioPlayback = () => {
    if (!url) return;

    if (!player.playing) {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  }
  
  useEffect(() => {
    if (player.currentStatus.didJustFinish) {
      player.seekTo(0)
      player.pause()
      setIsPlaying(false);
    }
  }, [player.currentStatus.didJustFinish])

  useEffect(() => {
    const statusPlaying = (player.currentStatus as any)?.playing ?? player.playing;
    setIsPlaying(Boolean(statusPlaying));
  }, [player.currentStatus?.playing, player.playing, player.currentTime])

  const progress = player.duration ? player.currentTime / player.duration : 0;

  return (
    <View className="flex-row items-center p-4 bg-gray-100 rounded-xl">
      {onRemove &&
      <TouchableOpacity className="absolute top-[-6] right-[-6] z-20 bg-red-600 rounded-full p-1.5" onPress={() => onRemove(url)}>
        <Ionicons name="close" size={10} color="white" />
      </TouchableOpacity>
      }
      <TouchableOpacity onPress={toggleAudioPlayback}>
        <Entypo
          name={isPlaying ? 'controller-paus' : 'controller-play'}
          size={25}
          color={"#6b7280"}
        />
      </TouchableOpacity>

      <View className="flex-1 min-w-36 ml-3 flex-row gap-2 justify-center align-center">
        <Text className="text-xs text-gray-600">
          {formatTime(player.currentTime)}
        </Text>
        <View className="flex-1">
          <View className="flex-row h-2 bg-gray-300 rounded-sm overflow-hidden mt-1">
            <View className="bg-gray-500 rounded-sm" style={{ flex: progress }} />
            <View style={{ flex: 1 - progress }} />
          </View>
        </View>
        <Text className="text-xs text-gray-600">
          {formatTime(player.duration)}
        </Text>
      </View>
    </View>
  )
}