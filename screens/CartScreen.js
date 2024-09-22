import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { themeColors } from "@/theme";
import * as Icon from "react-native-feather";
import { useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { selectRestaurant } from "@/slices/restaurantSlice";
import { removeToCart, selectCart, selectCartTotal } from "@/slices/cartSlice";

export default function CartScreen() {
    const restaurant = useSelector(selectRestaurant);
    const navigation = useNavigation();
    const cartItems =  useSelector(selectCart)
    const cartTotal =  useSelector(selectCartTotal)
    const [groupedItems, setGroupedItems] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        const items = cartItems.reduce((group, item) => {
            if(group[item.id]){
                group[item.id].push(item);
            }else {
                group[item.id] = [item];
            }
            return group;
        }, {});
        setGroupedItems(items);
    }, [cartItems])
  return (
    <View className="bg-white flex-1 pt-7">

        <View className="relative py-4 shadow-sm">
            {/* Flecha de retorno */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{backgroundColor: themeColors.bgColorPrimary(1)}}
                className="absolute z-10 rounded-full p-2 shadow top-5 left-2"
            >
                <Icon.ArrowLeft height="20" width="20" strokeWidth={3} stroke={themeColors.bgColorSecondary(1)} />
            </TouchableOpacity>

            {/* Nombre de restaurant */}
            <View>
                <Text className="text-center font-bold text-xl">Carrito</Text>
                <Text className="text-center text-gray-500">{restaurant.name}</Text>
            </View>
        </View>

        { /* Definir si va */}
        <View 
            style={{backgroundColor: themeColors.bgColorSecondary(0.2)}} 
            className="flex-row px-4 items-center"
        >
            <Image source={require('../assets/images/delivery.png')} className="w-20 h-20 rounded-full"></Image>
            <Text className="flex-1 pl-4">¡Preparemos el pedido!</Text>
            <TouchableOpacity>
                <Text className="font-bold" style={{color: themeColors.bgColorSecondary(1)}}>Editar</Text>
            </TouchableOpacity>
        </View>    

        {/* Lista de productos */}
        <ScrollView 
                className="bg-white"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 50
                }} 
        >
            {
                Object.entries(groupedItems).map(([key, items]) => {
                    let dish = items[0];
                    return (
                        <View key={key} 
                        className="flex-row justify-between items-center space-x-3 px-4 py-2 bg-white rounded-3xl mx-2 my-3 shadow-xl shadow-black">
                            <Text className="font-bold" style={{color: 'black'}}>{items.length}</Text>
                            <Image className="h-14 w-14 rounded-full" source={dish.image}/>
                            <Text className="flex-1 font-bold text-gray-700">{dish.name}</Text>
                            <Text className="font-bold text-gray-700">${dish.price}</Text>
                            <TouchableOpacity 
                                onPress={() => dispatch(removeToCart({id: dish.id}))}
                                className="p-1 rounded-full"
                                style={{backgroundColor: themeColors.bgColorSecondary(0.2)}}
                            >
                                <Icon.Minus strokeWidth={2} stroke="white" height={20} width={20} />
                            </TouchableOpacity>

                        </View>
                    )
                })
            }
        </ScrollView>

        <View className="p-6 px-8 rounded-t-3xl space-y-4" style={{backgroundColor: themeColors.bgColorPrimary(1)}}>
            <View className="flex-row justify-between ">
                <Text className="text-gray-700 font-extrabold">Total</Text>
                <Text className="text-gray-700 font-extrabold">${cartTotal}</Text>
            </View>
            <View>
                <TouchableOpacity
                    // onPress={ () => navigation.navigate('Checkout')} 
                    style={{backgroundColor: themeColors.bgColorSecondary(1)}}
                    className="p-3 rounded-full"
                >
                    <Text className="text-white text-center font-bold text-lg">
                        Pagar
                        </Text>
                </TouchableOpacity>
            </View>
        </View>

    </View>
  )
}
