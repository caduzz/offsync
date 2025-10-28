import { formatTime } from "@/utils/formatData";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { useEffect, useState, useRef } from "react";

import { Text, TouchableOpacity, View, TouchableWithoutFeedback, LayoutChangeEvent } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface AudioPlayerProps {
  url: string | null,
  onRemove?: (s: string | null) => void
}

export default function AudioPlayer ({ url, onRemove }: AudioPlayerProps) {
  const player = useAudioPlayer({ uri: url ? url : "" });
  const [isPlaying, setIsPlaying] = useState<boolean>(Boolean(player.playing));
  const [currentTimeState, setCurrentTimeState] = useState<number>(player.currentTime || 0);
  const lastSetRef = useRef<number>(0);

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

  const progress = player.duration ? player.currentTime / player.duration : 0;

  const progressSv = useSharedValue(progress);
  const barWidthSv = useSharedValue(0);

  useEffect(() => {
    if (player.currentStatus.didJustFinish) {
      player.seekTo(0)
      player.pause()
      setIsPlaying(false);
      setCurrentTimeState(0);
    }
  }, [player.currentStatus.didJustFinish])

  useEffect(() => {
    const statusPlaying = (player.currentStatus as any)?.playing ?? player.playing;
    setIsPlaying(Boolean(statusPlaying));
  }, [player.currentStatus?.playing, player.playing])
  
  useEffect(() => {
    progressSv.value = withTiming(progress, { duration: 250 });
  }, [progress]);

  useEffect(() => {
    let rafId: number | null = null;
    const tick = () => {
      if (player.playing) {
        const p = player.duration ? player.currentTime / player.duration : 0;

        progressSv.value = p;

        const now = Date.now();
        if (now - lastSetRef.current > 180) {
          lastSetRef.current = now;
          setCurrentTimeState(player.currentTime || 0);
        }

        setIsPlaying(true);
        rafId = requestAnimationFrame(tick);
      } else {
        setIsPlaying(false);
        setCurrentTimeState(player.currentTime || 0);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    if (player.playing) tick();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [player.playing, player.currentTime, player.duration]);

  return (
    <View className="flex-row items-center p-4 bg-gray-100 rounded-xl">
      {onRemove &&
      <TouchableOpacity className="absolute top-[-5] right-[-5] z-20 rounded-full p-1.5" onPress={() => onRemove(url)}>
        <AntDesign name="close" size={12}  color="#ef4444" />
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
          {formatTime(currentTimeState)}
        </Text>
        <View className="flex-1">
          <TouchableWithoutFeedback
            onPress={(e) => {
              if (!player.duration) return;
              const x = e.nativeEvent.locationX;
              const w = barWidthSv.value || 1;
              const frac = Math.max(0, Math.min(1, x / w));
              const newTime = frac * player.duration;
              player.seekTo(newTime);
              progressSv.value = withTiming(frac, { duration: 150 });
              setCurrentTimeState(newTime);
            }}
          >
            <View
              className="relative h-2 bg-gray-300 rounded-sm overflow-hidden mt-1"
              onLayout={(e: LayoutChangeEvent) => {
                const w = e.nativeEvent.layout.width;
                barWidthSv.value = w;
              }}
            >
              <Animated.View
                style={useAnimatedStyle(() => ({
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${progressSv.value * 100}%`
                }))}
                className="bg-gray-500 rounded-sm"
              />

              <Animated.View
                style={useAnimatedStyle(() => {
                  const size = 10;
                  const left = (barWidthSv.value || 0) * progressSv.value - size / 2;
                  return {
                    position: 'absolute',
                    top: -((size - 8) / 2),
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: '#6b7280',
                    transform: [{ translateX: left }]
                  };
                })}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Text className="text-xs text-gray-600">
          {formatTime(player.duration)}
        </Text>
      </View>
    </View>
  )
}