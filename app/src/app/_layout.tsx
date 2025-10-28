import '@/styles/global.css';

import React from "react";

import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthRoutes } from '@/routes/auth.routes';
import { AuthProvider } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppLayout() {
  return (
    <SafeAreaView className='flex-1'>
      <AuthProvider>
        <View className="flex-1 bg-white">
          <StatusBar style="dark"/>
          <AuthRoutes />
        </View>
      </AuthProvider>
    </SafeAreaView>
  );
}