import React from "react";
import { View, Text, TextInput } from "react-native";

const CustomInput = ({ value, setValue, placeholder, secureTextEntry, capitalize="none" }) => {
  return (
    <View className="w-full max-w-md">
      <Text className="block text-xl font-bold mb-1 text-comidin-dark-orange">
        {placeholder}
      </Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        className="w-full h-12 mb-2 px-3 border border-gray-300 rounded-2xl bg-white"
        secureTextEntry={secureTextEntry}
        autoCapitalize={capitalize}
      />
    </View>
  );
};

export default CustomInput;
