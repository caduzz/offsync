import { ImagePickerResult } from "@/@types/imagePicker";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";

import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

interface ModalPreviewProps extends React.ComponentProps<typeof Modal> {
  onClose?: () => void;
  source: ImagePickerResult | null;
}

export default function ModalPreview({ onClose, source, ...props }: ModalPreviewProps) {
  const player = useVideoPlayer(source);

  return (
    <Modal {...props} transparent statusBarTranslucent>
      <View className="w-full h-full bg-gray-900/50 items-center justify-center p-10">
        <TouchableOpacity onPress={onClose} className="absolute top-14 right-6 z-10">
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        {!source ? (
          <View className="w-full h-full items-center justify-center">
            <Text>No media selected</Text>
          </View>
        ) : (
          source.type === 'video' ? (
            <View className="w-[300px] h-[535px] rounded-2xl overflow-hidden">
              <VideoView
                style={{
                  flex: 1,
                  overflow: "hidden",
                  backgroundColor: "#000000"
                }}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
              />
            </View>
          ) : (
            <Image
              className="rounded-lg w-full h-[515px]"
              resizeMode="contain"
              source={{ uri: source.uri }}
            />
          )
        )}
      </View>
    </Modal>
  );
}