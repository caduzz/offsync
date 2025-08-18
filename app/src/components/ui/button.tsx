import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onPress: () => void;
}
export default function Button({ children, onPress, className }: ButtonProps) {
  const classButton = `border-[1px] border-gray-200 rounded-md items-center px-4 py-4 mt-5 ${className}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={classButton}
    >
      <Text className='color-gray-500'>{children}</Text>
    </TouchableOpacity>
  );
}