import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { themeColors } from '@/theme'
import * as Icon from "react-native-feather";
import { addToCart, removeFromCart, selectCartItemsByID } from '../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';


export default function DishRow({item}) {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => selectCartItemsByID(state, item.id));
    const totalQuantity = useMemo(() => 
        cartItems.reduce((total, item) => total + item.quantity, 0),
        [cartItems]
    );
    const handleIncrese = () => {
        dispatch(addToCart({...item, selectedExtras: item.selectedExtras || {}}));
    }
    const handleDecrese = () => {
        dispatch(removeFromCart({
            id: item.id, 
            selectedExtras: item.selectedExtras || {}
        }));
    }
  return (
    <View className='flex-row items-center bg-white p-3 rounded-3xl shadow-2xl mb-3 mx-2'>
      <Image source={{uri: item.product.image_url}} className='rounded-3xl' style={{height: 100, width:100}}/>
        <View className='flex-1 space-y-2 pl-3'>
            <View>
                <Text className='text-xl font-bold' numberOfLines={2}>{item.product.name}</Text>
                <Text className='text-gray-700' numberOfLines={2}>{item.product.description}</Text>
            </View>
            <View className='flex-row justify-between items-center'>
                <Text className='text-green-700 font-bold text-lg'>${item.price}</Text>
                <View className='flex-row items-center'>
                    <TouchableOpacity 
                        onPress={handleDecrese}
                        disabled={!totalQuantity} 
                        className='p-1 rounded-full'
                        style={{backgroundColor: themeColors.bgColorSecondary(1)}}
                    >
                    <Icon.Minus strokeWidth={2} height={20} stroke={'white'}/>
                    </TouchableOpacity>
                    <Text className='px-3'> {totalQuantity} </Text>
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