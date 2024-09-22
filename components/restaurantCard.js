import { themeColors } from '@/theme';
import { useNavigation } from 'expo-router';
import React from 'react'
import { Text, TouchableWithoutFeedback, View, Image } from 'react-native'
import * as Icon from "react-native-feather";

export default function RestaurantCard({restaurant}) {
    const navigation = useNavigation();
    return (
        <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Restaurant', {...restaurant})}
        >
          <View
            style={{
                shadowColor: themeColors.bgColorSecondary(0.5),
                shadowRadius: 7
            }} 
            className='mr-6 mb-2 bg-white rounded-3xl shadow-lg'>
            <Image className='h-36 w-64 rounded-t-3xl' source={{uri: restaurant.image_url}}/>
            <View className='px-3 pb-4 space-y-2'>
                <Text className='text-lg font-bold pt-2'>{restaurant.name}</Text>
                <View className='flex-row items-center space-x-1'>
                    {/* <Image source={require('../assets/images/fullStarIcon.png')} className='h-4 w-4'/>
                    <Text className='text-xs'>
                        <Text className="text-green-700">{restaurant.stars}</Text>
                        <Text className="text-gray-700">
                            ({restaurant.reviews}) • <Text className="font-semibold">{restaurant.category} </Text>
                        </Text>
                    </Text> */}
                </View>
                <View className='flex-row items-center space-x-1'>
                    <Icon.MapPin height="15" width="15" stroke="gray" />
                    <Text className='text-gray-500 text-sm'>{restaurant.street_name} - {restaurant.number}</Text>
                </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
}
