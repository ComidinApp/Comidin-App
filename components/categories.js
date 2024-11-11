import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useGetAllCommerceCategoryQuery } from "../redux/apis/commerce.js";
import { useNavigation } from '@react-navigation/core';
import { useLoading } from '../context/LoadingContext.js';

export default function Categories() {
    const { showLoading, hideLoading } = useLoading();
    const {
      data: dataCategory = [],
      isLoading: isLoadingCategory,
      error: errorCategory,
    } = useGetAllCommerceCategoryQuery();

    const navigation = useNavigation();

    useEffect(() => {
        if (isLoadingCategory) {
            showLoading('Cargando datos...');
        } else {
            hideLoading();
        }
    }, [isLoadingCategory, showLoading, hideLoading]);

    if (errorCategory) {
        return <Text>Error al cargar categorías: {errorCategory.message}</Text>;
    }

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
                        return (
                            <View key={index} className='flex justify-center items-center mr-5 '>
                                <TouchableOpacity 
                                    className={'p-1 shadow bg-comidin-dark-orange rounded-2xl'}
                                    onPress={() => navigation.navigate('CommercesCategory', {idCategory: category.id})}>
                                        <Image 
                                          source={{uri: category.image_url}} 
                                          style={{width: 140, height: 140, borderRadius: 10}}/>
                                </TouchableOpacity>
                                <Text className={'text-sm text-gray-500'}>{category.name}</Text>
                            </View>
                        );
                    })
                }
            </ScrollView>
        </View>
    );
}