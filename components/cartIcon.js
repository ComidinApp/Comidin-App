import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ShoppingCartIcon } from 'react-native-heroicons/outline';
import { selectCartItems, selectCartItemsCount } from '../redux/slices/cartSlice';

const CartIcon = () => {
  const navigation = useNavigation();
  const itemCount = useSelector(selectCartItemsCount);
  
  if (itemCount === 0) return null;

  return (
    <View className="absolute bottom-10 w-full z-50">
      <TouchableOpacity
        onPress={() => navigation.navigate('Cart')}
        className="mx-5 bg-comidin-dark-orange p-4 rounded-lg flex-row items-center space-x-1"
      >
        <Text className="text-comidin-dark-orange bg-comidin-light-orange font-extrabold text-lg  py-1 px-2 rounded">
          {itemCount}
        </Text>
        <Text className="flex-1 text-white font-extrabold text-lg text-center">
          Ver Carrito
        </Text>
        <ShoppingCartIcon size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CartIcon;

