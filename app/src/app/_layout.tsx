import '@/styles/global.css';

import React from "react";

import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthRoutes } from '@/routes/auth.routes';
import { AuthProvider } from '../context/AuthContext';

export default function AppLayout() {
  return (
    <AuthProvider>
      <View className="flex-1 bg-white">
        <StatusBar style="dark"/>
        <AuthRoutes />
      </View>
    </AuthProvider>
  );
}