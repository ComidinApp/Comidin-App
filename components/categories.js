import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { categories } from '../constants/inedex.js';
import { useGetAllCommerceCategoryQuery } from "../redux/apis/commerce.js";

export default function Categories() {
    const [activeCategories, setActiveCategories] = useState(null);
    const {
      data: dataCategory = [],
      isLoading: isLoadingCategory,
      error: errorCategory,
      isSuccess
    } = useGetAllCommerceCategoryQuery();

  return (
    <View className='mt-4'>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className='overflow-visible'
        contentContainerStyle={{
            paddingHorizontal: 15
        }}>
            {
                dataCategory.map((category, index) => {
                    let isActive = category.id == activeCategories;
                    let btnClass = isActive? 'bg-gray-600': 'bg-gray-200';
                    let textClass = isActive? 'text-gray-800 font-semibold': 'text-gray-500';
                    return (
                        <View key={index} className='flex justify-center items-center mr-5'>
                            <TouchableOpacity 
                                className={'p-1 rounded-full shadow bg-gray-200 ' + btnClass}
                                onPress={()=> setActiveCategories(category.id)}>
                                    <Image source={category.image} style={{width: 45, height: 45}}/>
                            </TouchableOpacity>
                            <Text className={'text-sm ' + textClass}>{category.name}</Text>
                        </View>)
                    })
            }
      </ScrollView>
    </View>
  )
}