import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onPress: () => void;
}
export default function Button({ children, onPress, className, disabled}: ButtonProps) {
  const classButton = `border-[1px] border-gray-200 rounded-md items-center px-4 py-4 mt-5 ${className}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={classButton}
      disabled={disabled}
    >
      <Text className='color-gray-500'>{children}</Text>
    </TouchableOpacity>
  );
}