import React, { useContext } from "react";
import { View, Text, TextInput, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme/index.js";
import Categories from "./../components/categories.js";
import Promotions from "./../components/promotions.js";
import Restaurant from "./../components/restaurants.js";
import RestaurantsColumn from "./../components/restaurantColumn.js";
import FeaturedRow from "./../components/featuredRow.js";
import { useGetAllCommerceCategoryQuery } from "../redux/apis/commerce.js";
import SafeArea from "./../components/safeArea.js";
import { useAuth  } from '../context/AuthContext.js';
import CustomButton from "../components/formElements/CustomButton.js";
import { useSelector } from 'react-redux';

const ButtonSignOut = () => {
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return(
    <View className="w-full px-10 py-5">
      <CustomButton text="Cerrar sesión" onPress={handleLogout} />
    </View>
  )
}

const SearchBar = () => (
  <View className="flex-row items-center space-x-2 p-4 py-2">
    <View className="flex-row flex-1 items-center p-3 rounded-full border border-gray-300 bg-white">
      <Icon.Search height="25" width="25" stroke="gray" />
      <TextInput placeholder="Buscar comercio" className="ml-2 flex-1" />
      <View className="flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-l-gray-400">
        <Icon.MapPin height="20" width="20" stroke="gray" />
        <Text className="text-gray-400">Córdoba</Text>
      </View>
    </View>
    <View className="p-3 rounded-full bg-white">
      <Icon.Sliders height="20" width="20" strokeWidth={2.5} stroke="gray" />
    </View>
  </View>
);

export default function HomeScreen() {
  const userData = useSelector(state => state.user.userData);
  const firstName = userData?.first_name || 'Usuario';

  return (
    <SafeAreaView
      style={{paddingBottom: 10}}
      className="bg-comidin-light-orange"
    >
      <View className="bg-comidin-dark-orange pt-3 pb-3">
        <View className="flex-row items-center justify-start   px-4">
          <Text className="text-white text-xl font-bold">
            Hola, {firstName}!
          </Text>
        </View>
      </View>

      <SearchBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 10,
        }}
      >
        <Promotions />
        <Categories />
        <Text className="text-xl font-bold p-4">Locales</Text>
        <Restaurant />
        <ButtonSignOut />
      </ScrollView>
    </SafeAreaView>
  );
}
