import React from "react";
import { View, Text, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme/index.js";
import Categories from "../components/categories.js";
import Promotions from "../components/promotions.js";
import Restaurant from "../components/restaurants.js";
import RestaurantColumn from "../components/restaurantColumn.js";
import SafeArea from "../components/safeArea.js";
import { useGetAllCommerceCategoryQuery } from "../redux/apis/commerce.js";
import { useRoute } from '@react-navigation/native';

export default function CommercesCategoryScreen() {

  const route = useRoute();
  const { idCategory } = route.params;
  
  return (
    <SafeArea className="h-full" textHeader={'Locales en el área'}>
        <RestaurantColumn idCategory={idCategory}/>
    </SafeArea>
    // <SafeAreaView
    //   style={{paddingTop: 10, paddingBottom: 20}}
    //   className="bg-comidin-dark-orange"
    // >
    //   <StatusBar style="dark-content" />
    //   <ScrollView
    //     showsVerticalScrollIndicator={false}
    //     contentContainerStyle={{
    //       paddingBottom: 20,
    //     }}
    //   >
        
    //   </ScrollView>
    // </SafeAreaView>
  );
}