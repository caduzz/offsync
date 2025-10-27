import { useNetworkState } from "expo-network";
import { Text, View } from "react-native";

const network = useNetworkState()

export function TagConnected ({ connected, disconnected }: { connected: any, disconnected: any}) {
  return(
    <View className={`${network.isConnected ? "bg-violet-100" : "bg-red-100"} px-3 py-1 rounded-full`}>
      <Text className={`${network.isConnected ? "text-violet-700 " : "text-red-700"} text-sm font-medium`}>
        {network.isConnected ? disconnected : connected}
      </Text>
    </View>
  )
}