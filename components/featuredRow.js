import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import RestaurantCard from './restaurantCard.js';

export default function FeaturedRow({title, restaurants, description}) {
  return (
    <View>
        <View className='flex-row items-center justify-between px-4'> 
            <View>
                <Text className='text-lg font-semibold'>{title}</Text>
                <Text className='text-gray-400'>{description}</Text>
            </View>
        </View>
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                paddingHorizontal: 15
            }}
            className='overflow-visible py-5' 
            >
            {
                restaurants.map((restaurant, index) => {
                    return (
                        <RestaurantCard key={index} restaurant={restaurant}/>
                    )
                })
            }
        </ScrollView>
    </View>
  )
}
