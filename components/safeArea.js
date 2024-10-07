import React from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function SafeArea({ children, textHeader }) {
  return (
    <SafeAreaView
      style={{ paddingTop: 10, height: "100%" }}
      className="bg-comidin-dark-orange"
    >
      <StatusBar style="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 40,
          height: "100%",
        }}
      >
        <Text className="text-white font-bold text-2xl px-4 pb-2">{textHeader}</Text>
        <View className="bg-comidin-light-orange h-full">
            {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
