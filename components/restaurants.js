import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { categories } from "../constants/inedex.js";
import { useGetCommercesQuery } from "../redux/apis/commerce.js";
import { useNavigation } from 'expo-router';
import { themeColors } from "@/theme/index.js";

export default function Restaurants() {
  const [activeCategories, setActiveCategories] = useState(null);
  const {
    data: dataRestaurants = [],
    isLoading: isLoadingRestaurants,
    error: errorRestaurants,
    isSuccess,
  } = useGetCommercesQuery();
  const navigation = useNavigation();

  if (isLoadingRestaurants) {
    return (
      <ActivityIndicator size="large" color={themeColors.bgColorSecondary(1)} />
    );
  }

  return (
    <View className="mt-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="overflow-visible"
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
      >
        {dataRestaurants.map((restaurant, index) => {
          let isActive = restaurant.id == activeCategories;
          let btnClass = isActive ? "bg-gray-600" : "bg-gray-200";
          let textClass = isActive
            ? "text-gray-800 font-semibold"
            : "text-gray-500";
          return (
            <View
              key={index}
              className="flex justify-center items-center mr-5 "
            >
              <TouchableOpacity
                className={"p-1 shadow bg-comidin-dark-orange rounded-2xl"}
                onPress={() => navigation.navigate('Restaurant', {...restaurant})}
              >
                <Image
                  source={{ uri: restaurant.image_url }}
                  style={{ width: 140, height: 140, borderRadius: 10 }}
                />
              </TouchableOpacity>
              <Text className={"text-sm " + textClass}>{restaurant.name}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
