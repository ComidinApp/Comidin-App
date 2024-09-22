import React from "react";
import { Text, TouchableOpacity } from "react-native";

const CustomButton = ({
  onPress,
  text,
  type = "PRIMARY",
}) => {
  return (
    <TouchableOpacity onPress={onPress} className={getClassNameInput(type)}>
      <Text className={getClassNameText(type)}>{text}</Text>
    </TouchableOpacity>
  );
};

const getClassNameInput = (param) => {
  if (param === 'PRIMARY') return 'w-full bg-comidin-dark-orange rounded-2xl py-3 items-center mb-3';
  if (param === 'SECONDARY') return 'clase2';
  if (param === 'TERTIARY') return 'pt-2 items-center';
  return 'w-full bg-orange-500 rounded-2xl py-3 items-center';
};
const getClassNameText = (param) => {
  if (param === 'PRIMARY') return 'text-white text-lg font-semibold ';
  if (param === 'SECONDARY') return 'clase2';
  if (param === 'TERTIARY') return 'text-gray-600 text-shadow-lg text-lg font-semibold';
  return 'text-white text-lg font-semibold';
};


export default CustomButton;
