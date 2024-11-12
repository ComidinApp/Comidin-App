import { themeColors } from "@/theme";
import { useRoute } from "@react-navigation/native";
import { useNavigation, useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useMemo } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Icon from "react-native-feather";
import DishRow from "../components/dishRow.js";
import CartIcon from "../components/cartIcon.js";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurant, selectRestaurant } from "../redux/slices/restaurantSlice.js";
import { clearCart } from '../redux/slices/cartSlice';
import { useGetpublicationByCommerceQuery } from "../redux/apis/publication.js";


const RestaurantProducts = ({ RestaurantId }) => {
  const {
    data: dataProducts = [],
    isLoading: isLoadingProducts,
    error: errorProducts,
  } = useGetpublicationByCommerceQuery(RestaurantId);

  if (isLoadingProducts) {
    return (
      <ActivityIndicator size="large" color={themeColors.bgColorSecondary(1)} />
    );
  }

  if (errorProducts) {
    return <Text>Error al cargar categorías: {errorProducts.message}</Text>;
  }

  return (
    <View className="bg-comidin-light-orange">
      <Text className="px-4 py-4 text-2xl font-bold">Menú</Text>
      {dataProducts.map((product, index) => (
        <DishRow item={{ ...product }} key={index} />
      ))}
    </View>
  );
};

export default function RestaurantScreen() {
  const { params } = useRoute();
  let restaurant = params;
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const currentRestaurant = useSelector(selectRestaurant);

  // Memorizar valores que se usan en useEffect
  const memoizedRestaurant = useMemo(() => restaurant, [restaurant]);

  useEffect(() => {
    dispatch(setRestaurant(memoizedRestaurant));
  }, [dispatch, memoizedRestaurant]);

  useEffect(() => {
    dispatch(clearCart());
  }, [currentRestaurant?.id]);

  useFocusEffect(
    React.useCallback(() => {
      // Vaciar el carrito cuando la pantalla recibe el foco
      dispatch(clearCart());
    }, [])
  );

  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <View className="flex-1 bg-comidin-light-orange">
      <CartIcon />
      <StatusBar style="dark" backgroundColor="rgb(250, 243, 230)" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="relative">
          <Image 
            className="h-72 w-full" 
            source={{ uri: restaurant.image_url }} 
          />

          <TouchableOpacity
            onPress={handleBack}
            className="absolute top-14 left-4 bg-gray-50 p-2 rounded-full shadow"
          >
            <Icon.ArrowLeft
              height="20"
              width="20"
              strokeWidth={3}
              stroke={themeColors.bgColorSecondary(1)}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
          className="bg-comidin-light-orange -mt-12 pt-6"
        >
          <View className="px-5">
            <Text className="text-3xl font-bold">{restaurant.name}</Text>
            <View className="flex-row space-x-2 my-1">
              <View className="flex-row items-center space-x-1">
                <Image
                  source={require("../assets/images/fullStarIcon.png")}
                  className="h-4 w-4"
                />
                <Text className="text-xs">
                  <Text className="text-green-700">4.8</Text>
                  <Text className="text-gray-700">
                    <Text className="font-semibold">
                      {restaurant.category}{" "}
                    </Text>
                  </Text>
                </Text>
              </View>
              <View className="flex-row items-center space-x-1 w-full">
                <Icon.MapPin height="15" width="15" stroke="gray" />
                <Text className="text-gray-500 text-sm">
                  {restaurant.street_name} - {restaurant.number}
                </Text>
              </View>
            </View>
            <Text className="text-gray-500 mt-2">{restaurant.description}</Text>
          </View>
        </View>

        <RestaurantProducts RestaurantId={restaurant.id} />
        
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
