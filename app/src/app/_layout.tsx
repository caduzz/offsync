import '@/styles/global.css';

import React from "react";

import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

import StackRoutes from "@/routes/stack.routes";

export default function AppLayout() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark"/>
      <StackRoutes />
    </View>
  );
}