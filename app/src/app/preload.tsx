import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export default function Preload() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }
  }, [loading, isAuthenticated])

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#0284c7" />
    </View>
  );
}