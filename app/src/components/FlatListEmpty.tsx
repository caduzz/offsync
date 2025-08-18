import { Entypo } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function FlatListEmpty() {
  return (
    <View className="w-full items-center justify-center p-2">
      <View className="bg-gray-100 rounded-full p-6 mb-4">
        <Entypo name="images" size={32} color="#9CA3AF" />
      </View>
      <Text className="text-gray-500 text-base font-medium mb-2">
        Nenhuma mídia adicionada
      </Text>
      <Text className="text-gray-400 text-sm text-center">
        Use os botões acima para adicionar fotos e vídeos à sua galeria
      </Text>
    </View>
  );
}