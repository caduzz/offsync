import { ImagePickerResult } from "@/@types/imagePicker";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";

interface FlatListItemProps {
  item: ImagePickerResult;
  onPress?: () => void;
  onRemove?: () => void;
}

export default function FlatListItem({ item, onPress, onRemove }: FlatListItemProps) {
  return (
    <TouchableOpacity className="w-52 h-40 rounded-lg" activeOpacity={0.8} onPress={onPress}>
      {onRemove && (
        <TouchableOpacity className="absolute top-2 right-2 z-20 bg-red-600 rounded-full p-1" onPress={onRemove}>
          <Ionicons name="close" size={12} color="white" />
        </TouchableOpacity>
      )}
      <View className="w-full h-full absolute bg-gray-900/70 rounded-lg items-center justify-center z-10">
      <View className="p-4 rounded-full bg-violet-200">
        {item.type === 'video' ? (
          <Ionicons name="videocam" size={20} color="#6d28d9" />
        ) : (
          <Ionicons name="image" size={20} color="#6d28d9" />
        )}
      </View>
      </View>
      <Image
        source={{ uri: item.uri }}
        className="w-full h-full rounded-lg"
        resizeMode="cover"
      />
    </TouchableOpacity>
  )
}
