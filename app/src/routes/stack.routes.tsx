import { Stack } from "expo-router";

export default function StackRoutes() {
  return (
    <Stack 
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="home"
      />
      <Stack.Screen
        name="form"
      />
    </Stack>
  );
}