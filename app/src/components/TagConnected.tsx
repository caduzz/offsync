import { MaterialIcons } from "@expo/vector-icons";
import { useNetworkState } from "expo-network";
import { Text, View } from "react-native";

export function TagConnected () {
  const network = useNetworkState()

  return(
    <View className='w-full flex flex-row itens-between justify-between px-6 p-4'>
      {network.isConnected ?
        <View className={"bg-violet-100 w-8 h-8 flex items-center justify-center rounded-full"}>
          <Text className={"text-violet-700 text-sm font-medium"}>
            {network.type === "WIFI" ? <MaterialIcons name="wifi"/> : <MaterialIcons name="signal-cellular-alt"/>}
          </Text>
        </View>
        :
        <View className={"bg-red-100 w-8 h-8 flex items-center justify-center rounded-full"}>
          <Text className={"text-red-700 text-sm font-medium"}>
            <MaterialIcons name="sim-card-alert"/>
          </Text>
        </View>
      }
      <View className={`${network.isConnected ? "bg-violet-100" : "bg-red-100"} px-4 h-8 flex items-center justify-center rounded-full`}>
        <Text className={`${network.isConnected ? "text-violet-700 " : "text-red-700"} text-sm font-medium`}>
          {network.isConnected ? "conectado": "desconectado"}
        </Text>
      </View>
    </View>
  )
}