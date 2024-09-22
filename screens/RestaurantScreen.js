import { themeColors } from '@/theme';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import * as Icon from "react-native-feather";
import DishRow from "../components/dishRow.js";
import CartIcon from "../components/cartIcon.js";
import { StatusBar } from 'expo-status-bar';
import { useDispatch } from 'react-redux';
import { setRestaurant } from '@/slices/restaurantSlice.js';

export default function RestaurantScreen() {
  const {params} = useRoute();
  let restaurant = params;
  const navigation = useNavigation();

  const dispatch = useDispatch();
  useEffect(() => {
    if(restaurant && restaurant.id){
      dispatch(setRestaurant({...restaurant}));
    }
  })
  return (
    <View>
      <CartIcon/>
      <StatusBar style="dark" backgroundColor='rgb(250, 243, 230)'/>
        <ScrollView>
          <View className='relative'>
            <Image className='h-72 w-full' source={restaurant.image}/>

            {/* Flecha de retorno */}
            <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className='absolute top-14 left-4 bg-gray-50 p-2 rounded-full shadow'>
              <Icon.ArrowLeft height="20" width="20" strokeWidth={3} stroke={themeColors.bgColorSecondary(1)} />
            </TouchableOpacity>
          </View>

          {/* Nombre de restaurant */}
          <View
            style={{borderTopLeftRadius: 40, borderTopRightRadius: 40}}
            className='bg-white -mt-12 pt-6'
          >
            <View className='px-5'>
              <Text className='text-3xl font-bold'>{restaurant.name}</Text>
              <View className='flex-row space-x-2 my-1'>
                <View className='flex-row items-center space-x-1'>
                      <Image source={require('../assets/images/fullStarIcon.png')} className='h-4 w-4'/>
                      <Text className='text-xs'>
                          <Text className="text-green-700">{restaurant.stars}</Text>
                          <Text className="text-gray-700">
                              ({restaurant.reviews}) • <Text className="font-semibold">{restaurant.category} </Text>
                          </Text>
                      </Text>
                  </View>
                  <View className='flex-row items-center space-x-1 w-full'>
                      <Icon.MapPin height="15" width="15" stroke="gray" />
                      <Text className='text-gray-500 text-sm'>{restaurant.street_name} - {restaurant.number}</Text>
                  </View>
              </View>
              <Text className='text-gray-500 mt-2'>{restaurant.description}</Text>
            </View>
          </View>
          {/* <View className='pb-36 bg-white h-screen'>
            <Text className='px-4 py-4 text-2xl font-bold'>Menu</Text>
            {
              restaurant.dishes.map((dish, index) => <DishRow item={{...dish}} key={index}/>)
            }
          </View> */}
        </ScrollView>
    </View>
  )
}
