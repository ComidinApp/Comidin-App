import React from "react";
import { View, Text, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme/index.js";
import Categories from "./../components/categories.js";
import Promotions from "./../components/promotions.js";
import Restaurant from "./../components/restaurants.js";
import FeaturedRow from "./../components/featuredRow.js";
import { useGetAllCommerceCategoryQuery } from "../redux/apis/commerce.js";

const SearchBar = () => (
  <View className="flex-row items-center space-x-2 px-4 pb-2">
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

const FeaturedCategories = () => {
  const {
    data: dataCategory = [],
    isLoading: isLoadingCategory,
    error: errorCategory,
  } = useGetAllCommerceCategoryQuery();

  if (isLoadingCategory) {
    return <ActivityIndicator size="large" color={themeColors.bgColorSecondary(1)} />;
  }

  if (errorCategory) {
    return <Text>Error al cargar categorías: {errorCategory.message}</Text>;
  }

  return (
    <View>
      {dataCategory.map((item) => (
        <CategoryRow key={item.id} category={item} />
      ))}
    </View>
  );
};

const CategoryRow = ({ category }) => {
  const { useGetAllCommerceByCategoryIdQuery } = require("../redux/apis/commerce.js");
  const {
    data: dataCommerce = [],
    isLoading: isLoadingCommerce,
    error: errorCommerce,
  } = useGetAllCommerceByCategoryIdQuery(category.id);

  if (isLoadingCommerce) {
    return  <ActivityIndicator size="large" color={themeColors.bgColorSecondary(1)} />;
  }

  if (errorCommerce) {
    return <Text>Error al cargar comercios para {category.name}: {errorCommerce.message}</Text>;
  }

  return (
    <FeaturedRow
      title={category.name}
      restaurants={dataCommerce}
      description={category.description}
    />
  );
};

export default function Navigation() {
  return (
    <SafeAreaView
      style={{paddingTop: 10, paddingBottom: 20}}
      className="bg-comidin-light-orange"
    >
      <StatusBar style="dark-content" />
      <SearchBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        <Text className="text-xl font-bold p-4">José Manuel Estrada</Text>
        <Promotions />
        <Text className="text-xl font-bold p-4">¿Qué vas a comer hoy?</Text>
        <Categories />
        <Text className="text-xl font-bold p-4">Locales</Text>
        <Restaurant />
      </ScrollView>
    </SafeAreaView>
  );
}