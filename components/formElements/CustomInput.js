import React from "react";
import { View, Text, TextInput } from "react-native";

const CustomInput = ({ 
  value, 
  setValue, 
  placeholder, 
  secureTextEntry, 
  capitalize="none",
  error,
  keyboardType
}) => {
  return (
    <View className="w-full max-w-md">
      <Text className="block text-xl font-bold mb-1 text-comidin-dark-orange">
        {placeholder}
      </Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        className={`w-full h-12 mb-1 px-3 border rounded-2xl bg-white
          ${error ? 'border-red-500' : 'border-gray-300'}`}
        secureTextEntry={secureTextEntry}
        autoCapitalize={capitalize}
        keyboardType={keyboardType}
      />
      {error && (
        <Text className="text-red-500 text-sm mb-2">
          {error}
        </Text>
      )}
    </View>
  );
};

export default CustomInput;
