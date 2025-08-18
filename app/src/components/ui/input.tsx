import { Text, TextInput, View } from "react-native";

interface InputProps extends React.ComponentProps<typeof TextInput> {
  label?: string;
}

export default function Input({ ...props }: InputProps) {
  return (
    <View className="w-full">
      <Text className="text-gray-700">{props.label}</Text>
      <TextInput
        className="text-gray-700 border border-gray-200 p-4 rounded-md w-full mt-2 mb-4"
        placeholderTextColor="#7c7c8a"
        {...props}
      />
    </View>
  );
}