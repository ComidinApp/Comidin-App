import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { categories } from "../constants/inedex.js";
import { useGetAllCommerceCategoryQuery } from "../redux/apis/commerce.js";

export default function Promotions() {
  return (
    <TouchableOpacity className="flex items-center">
      <ImageBackground
        source={require("../assets/images/promotion.png")}
        style={{ width: 360, height: 140, borderRadius: 20 }}
        imageStyle={{ borderRadius: 20 }}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-transparent bg-opacity-50 p-4 rounded-lg">
            <Text className="text-white text-lg font-bold text-center">
              Promociones
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
