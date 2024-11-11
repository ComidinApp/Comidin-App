import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { themeColors } from "@/theme";
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from "react-redux";
import { selectRestaurant } from "../redux/slices/restaurantSlice";
import { 
    addToCart,
    removeFromCart as removeToCart,
    selectCartItems,
    selectCartItemsCount,
    selectCartTotal
} from "../redux/slices/cartSlice";
import { RadioButton } from 'react-native-paper';
import { handleIntegrationMP } from "../utils/MPIntegration.js"
import { openBrowserAsync } from "expo-web-browser";

export default function CartScreen() {
    const restaurant = useSelector(selectRestaurant);
    const navigation = useNavigation();
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const [groupedItems, setGroupedItems] = useState({});
    const dispatch = useDispatch();
    const [selectedMethod, setSelectedMethod] = useState('');

    useEffect(() => {
        const items = cartItems.reduce((group, item) => {
            const key = `${item.id}-${JSON.stringify(item.selectedExtras)}`;
            if (!group[key]) {
                group[key] = item;
            }
            return group;
        }, {});
        setGroupedItems(items);
    }, [cartItems]);

    const PaymentMethodSelector = () => {
        return (
            <View>
                <Text className="text-lg font-bold px-6 text-comidin-brown">Método de pago</Text>  
                <View className=" m-4 p-1 bg-white rounded-lg border-2 border-comidin-brown">
                    <View className="space-y-1">
                        <TouchableOpacity 
                        className="flex-row items-center bg-white p-1 rounded-md"
                        onPress={() => setSelectedMethod('efectivo')}
                        >
                        <RadioButton
                            value="efectivo"
                            status={selectedMethod === 'efectivo' ? 'checked' : 'unchecked'}
                            onPress={() => setSelectedMethod('efectivo')}
                            color="#95541b"
                        />
                        <Text className="ml-2 text-comidin-green font-semibold">Efectivo</Text>
                        </TouchableOpacity>

                        <View className="h-px bg-comidin-brown" />

                        <TouchableOpacity 
                        className="flex-row items-center bg-white p-1 rounded-md"
                        onPress={() => setSelectedMethod('mercadoPago')}
                        >
                        <RadioButton
                            value="mercadoPago"
                            status={selectedMethod === 'mercadoPago' ? 'checked' : 'unchecked'}
                            onPress={() => setSelectedMethod('mercadoPago')}
                            color="#95541b"
                        />
                        <Text className="ml-2 text-comidin-green font-semibold">Mercado Pago</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
            </View>
        )
    }

    const handleBuy = async () => {
        const preferencia = {
            "items": [
                {
                  "title": "Comidin",
                  "description": restaurant.name,
                  "picture_url": "https://comidin-assets-tjff.s3.amazonaws.com/commerce-logos/Comidin.png",
                  "category_id": "car_electronics",
                  "quantity": 1,
                  "currency_id": "$",
                  "unit_price": cartTotal
                }
              ]
        }

        const data = await handleIntegrationMP(preferencia)
        if (!data) {
            return console.log("Ha ocurrido un error")
        }
        openBrowserAsync(data)
    }

  return (
    <View className="bg-comidin-orange flex-1 pt-7">
        
        <View className="py-4 w-full h-14">
            {/* Flecha de retorno */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute z-10 p-2 shadow top-2 left-2"
            >
                <Icon.ArrowLeft height="30" width="30" strokeWidth={4} stroke={themeColors.bgColorPrimary(1)} />
            </TouchableOpacity>

        </View>
            {/* Nombre de restaurant */}


        { /* Definir si va */}
        <View 
            className="bg-comidin-light-orange h-full"
        >
            <View className="p-6">
                <Text className="text-left font-semibold text-3xl text-comidin-brown">Mi pedido</Text>
                <Text className="text-left text-gray-500">{restaurant.name}</Text>
            </View>
          

        {/* Lista de productos */}
        <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 50
                }} 
        >
            {
                Object.entries(groupedItems).map(([key, item]) => {
                    const isMinQuantity = item.quantity <= 1;
                    return (
                        <View key={key} 
                        className="flex-row justify-between items-center space-x-3 px-4 py-2 bg-white rounded-3xl mx-2 my-3 shadow-xl shadow-black">
                            <Text className="font-bold" style={{color: 'black'}}>{item.quantity}</Text>
                            <Image className="h-14 w-14 rounded-full" source={{uri: item.product.image_url}}/>
                            <Text className="flex-1 font-bold text-gray-700">{item.product.name}</Text>
                            <Text className="font-bold text-gray-700">${item.price}</Text>
                            <View className="flex-row items-center space-x-2">
                                <TouchableOpacity 
                                    onPress={() => !isMinQuantity && dispatch(removeToCart({
                                        id: item.id,
                                        selectedExtras: item.selectedExtras || {}
                                    }))}
                                    className={`p-1 rounded-full ${isMinQuantity ? 'opacity-30' : ''}`}
                                    disabled={isMinQuantity}
                                    style={{backgroundColor: themeColors.bgColorSecondary(0.2)}}
                                >
                                    <Icon.Minus strokeWidth={2} stroke="white" height={20} width={20} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => dispatch(addToCart(item))}
                                    className="p-1 rounded-full"
                                    style={{backgroundColor: themeColors.bgColorSecondary(0.2)}}
                                >
                                    <Icon.Plus strokeWidth={2} stroke="white" height={20} width={20} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })
            }
            <PaymentMethodSelector />
        </ScrollView>

        <View className="pb-20 pt-4 px-8 rounded-t-3xl space-y-4 bg-comidin-orange/50">
            <View className="flex-row justify-between ">
                <Text className="text-gray-700 font-extrabold">Total</Text>
                <Text className="text-gray-700 font-extrabold">${cartTotal}</Text>
            </View>
            <View>
                <TouchableOpacity
                    // onPress={ () => navigation.navigate('Checkout')} 
                    style={{backgroundColor: themeColors.bgColorSecondary(1)}}
                    className="p-3 rounded-full"
                    onPress={handleBuy}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        Pagar
                        </Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>  

    </View>
  )
}
