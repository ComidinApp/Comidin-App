import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { useGetAllCommerceByCategoryIdQuery } from "../redux/apis/commerce.js";
import { useNavigation } from '@react-navigation/core';
import { themeColors } from "@/theme/index.js";
import { useLoading } from '../context/LoadingContext.js';  

export default function RestaurantColumn({ idCategory }) {
  const { showLoading, hideLoading } = useLoading();
  const {
    data: dataRestaurants = [],
    isLoading: isLoadingRestaurants,
    error: errorRestaurants, 
    isSuccess,
  } = useGetAllCommerceByCategoryIdQuery(idCategory);
  const navigation = useNavigation();

  useEffect(() => {
    if (isLoadingRestaurants) {
      showLoading('Cargando datos...');
    } else {
      hideLoading();
    }
  }, [isLoadingRestaurants]);

  if (isLoadingRestaurants) {
    return (
      <ActivityIndicator size="large" color={themeColors.bgColorSecondary(1)} />
    );
  }

  return (
    <View className="mt-4">
      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
        className="overflow-visible"
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
      >
        {dataRestaurants.map((restaurant, index) => {
          return (
            <View key={index}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Restaurant", { ...restaurant })
                }
                className="flex flex-row items-center p-2 border-b border-gray-200"
              >
                <Image
                  source={{ uri: restaurant.image_url }}
                  style={{ width: 90, height: 90, borderRadius: 100 }}
                />
                <Text className={"text-xl font-black ml-5"}>
                  {restaurant.name}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
