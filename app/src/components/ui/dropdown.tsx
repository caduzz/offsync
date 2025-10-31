import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";

export type OptionItemDropDown = {
  value: string;
  label: string;
};

interface DropDownProps {
  data: OptionItemDropDown[];
  onChange: (item: OptionItemDropDown) => void;
  placeholder: string;
  select: string
}

export default function Dropdown({
  data,
  onChange,
  placeholder,
  select
}: DropDownProps) {
  const [expanded, setExpanded] = useState(false);

  const [left, setLeft] = useState(0);
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);

  const open = useCallback(() => {
    const node = (buttonRef.current as any);
    if (node && typeof node.measureInWindow === "function") {
      node.measureInWindow((x: number, y: number, width: number, height: number) => {
        const extraOffset = Platform.OS === "android" ? 8 : 12;
        const finalValue = y + height + extraOffset;
        setTop(finalValue);
        setLeft(x);
        setButtonWidth(width);
        setExpanded(true);
      });
    } else {
      setExpanded(true);
    }
  }, []);

  const close = useCallback(() => setExpanded(false), []);

  const [value, setValue] = useState(select);

  const buttonRef = useRef<View>(null);

  const [top, setTop] = useState(0);

  const onSelect = useCallback((item: OptionItemDropDown) => {
    onChange(item);
    setValue(item.label);
    setExpanded(false);
  }, []);
  return (
    <View>
      <TouchableOpacity
        ref={buttonRef}
        className="text-gray-700 border border-gray-200 p-4 rounded-md w-full mt-2 mb-4 flex flex-row justify-between items-center"
        activeOpacity={0.8}
        onPress={() => (expanded ? close() : open())}
      >
        <Text className="text-base opacity-80">{value || placeholder}</Text>
        <AntDesign color="#374151" className="opacity-80" name={expanded ? "caret-up" : "caret-down"} />
      </TouchableOpacity>
      {expanded ? (
        <Modal visible={expanded} transparent>
          <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
            <View className="flex-1">
              <View
                className="absolute bg-white p-2.5 rounded-md max-h-[250px] shadow"
                style={{ top, left, width: buttonWidth ?? '100%' }}
              >
                <FlatList
                  keyExtractor={(item) => item.value}
                  data={data}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      className="h-10 justify-center px-2"
                      onPress={() => onSelect(item)}
                    >
                      <Text className="text-base">{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View className="h-1" />
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}
    </View>
  );
}
