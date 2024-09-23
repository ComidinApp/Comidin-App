import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { themeColors } from '@/theme'
import * as Icon from "react-native-feather";
import { addToCart, removeToCart, selectCartItemsByID } from '@/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';


export default function DishRow({item}) {
    const dispatch = useDispatch();
    const totalItems = useSelector(state => selectCartItemsByID(state, item.id));
    const handleIncrese = () => {
        dispatch(addToCart({...item}));
    }
    const handleDecrese = () => {
        dispatch(removeToCart({id: item.id}));
    }
  return (
    <View className='flex-row items-center bg-white p-3 rounded-3xl shadow-2xl mx-2'>
      <Image source={{uri: item.product.image_url}} className='rounded-3xl' style={{height: 100, width:100}}/>
        <View className='flex flex-1 space-y-3'>
            <View className='pl-3'>
                <Text className='text-xl font-bold'>{item.product.name}</Text>
                <Text className='text-gray-700'>{item.product.description}</Text>
            </View>
            <View className='flex-row justify-between pl-3 items-center'>
                <Text className='text-green-700 font-bold text-lg'>${item.price}</Text>
                <View className='flex-row items-center'>
                    <TouchableOpacity 
                        onPress={handleDecrese}
                        disabled={!totalItems.length} 
                        className='p-1 rounded-full'
                        style={{backgroundColor: themeColors.bgColorSecondary(1)}}
                    >
                    <Icon.Minus strokeWidth={2} height={20} stroke={'white'}/>
                    </TouchableOpacity>
                    <Text className='px-3'> {totalItems.length} </Text>
                    <TouchableOpacity
                        onPress={handleIncrese} 
                        className='p-1 rounded-full'
                        style={{backgroundColor: themeColors.bgColorSecondary(1)}}
                    >
                    <Icon.Plus strokeWidth={2} height={20} stroke={'white'}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>    
    </View>
  )
}