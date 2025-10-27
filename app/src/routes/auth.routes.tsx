import { Stack } from "expo-router";

export function AuthRoutes() {
  return (
    <Stack 
      initialRouteName="preload"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="preload"
      />
      <Stack.Screen
        name="login"
        options={{
          gestureEnabled: false
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          gestureEnabled: false
        }}
      />
      <Stack.Screen
        name="form"
        options={{
          gestureEnabled: false
        }}
      />
    </Stack>
  );
}