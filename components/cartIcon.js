import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { themeColors } from '@/theme'
import { useNavigation } from 'expo-router';
import { useSelector } from 'react-redux';
import { selectCart, selectCartTotal } from '@/slices/cartSlice';

export default function CartIcon() {
  const navigation = useNavigation();  
  const cartItems = useSelector(selectCart);
  const cartTotal = useSelector(selectCartTotal)
  if(!cartItems || cartItems.length === 0){
    return null;
  }
  return (
    <View className="absolute bottom-5 w-full z-20">
      <TouchableOpacity
        onPress={() => navigation.navigate('Cart')}
        style={{backgroundColor: themeColors.bgColorSecondary(1)}}
        className='flex-row justify-between items-center mx-5 rounded-full p-4 py-3 shadow-lg'
      >
            <View className='p-2 px-4 rounded-full' style={{backgroundColor: themeColors.bgColorPrimary(0.4)}}>
                <Text className='font-extrabold text-white text-lg'>
                    {cartItems.length}
                </Text>
            </View>
            <Text className='flex-1 text-white text-center font-extrabold text-lg'>Ver carrito</Text>
            <Text className='text-white font-extrabold text-lg'>${cartTotal}</Text>
      </TouchableOpacity>
    </View>
  )
}

