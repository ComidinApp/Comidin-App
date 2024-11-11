import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/core';
import { useSelector } from "react-redux";
import { selectRestaurant } from "../redux/slices/restaurantSlice";
import { selectCartItems, selectCartTotal } from "../redux/slices/cartSlice";
import { RadioButton } from 'react-native-paper';
import { handleIntegrationMP } from "../utils/MPIntegration.js"
import { openBrowserAsync } from "expo-web-browser";
import * as Icon from "react-native-feather";
import { themeColors } from "@/theme";

export default function PaymentScreen() {
    const navigation = useNavigation();
    const restaurant = useSelector(selectRestaurant);
    const cartTotal = useSelector(selectCartTotal);
    const cartItems = useSelector(selectCartItems);
    const [selectedMethod, setSelectedMethod] = useState('');

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
        <View className="flex-1 bg-comidin-light-orange">
            {/* Header fijo */}
            <View className="pt-12 pb-4 bg-comidin-orange">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="px-4"
                >
                    <Icon.ArrowLeft height="24" width="24" stroke="white" />
                </TouchableOpacity>
            </View>

            {/* Contenido scrollable */}
            <ScrollView className="flex-1">
                {/* Detalles del pedido */}
                <View className="p-4">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-xl font-bold text-comidin-brown">Detalles de mi pedido</Text>
                    </View>

                    {cartItems.map((item, index) => (
                        <View key={index} className="flex-row items-center mb-2">
                            <Image 
                                source={{uri: item.product.image_url}} 
                                className="w-12 h-12 rounded-lg mr-3"
                            />
                            <View className="flex-1">
                                <Text className="text-comidin-brown font-semibold">{item.product.name}</Text>
                                <Text className="text-comidin-brown">${item.price}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Detalles de retiro */}
                <View className="p-4 border-t border-b border-gray-200">
                    <Text className="text-xl font-bold text-comidin-brown mb-2">Detalles de retiro</Text>
                    <View className="bg-white p-3 rounded-lg flex-row items-center">
                        <Image 
                            source={require('../assets/images/delivery-boy.png')} 
                            className="w-12 h-12 mr-3"
                        />
                        <View className="flex-1">
                            <Text className="text-comidin-brown">Calle Ituzaingó 789, Córdoba</Text>
                            <TouchableOpacity>
                                <Text className="text-comidin-dark-orange">Instrucciones para llegar</Text>
                            </TouchableOpacity>
                        </View>
                        <Icon.ChevronRight stroke="#95541b" />
                    </View>
                </View>

                {/* Resumen de compra */}
                <View className="p-4 border-b border-gray-200">
                    <Text className="text-xl font-bold text-comidin-brown mb-2">Resumen de tu compra</Text>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-comidin-brown">Tu pedido</Text>
                        <Text className="text-comidin-brown">${cartTotal}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-comidin-brown font-bold">Total</Text>
                        <Text className="text-comidin-brown font-bold">${cartTotal}</Text>
                    </View>
                </View>

                {/* Método de pago */}
                <View className="p-4">
                    <Text className="text-xl font-bold text-comidin-brown mb-2">Método de pago</Text>
                    <View className="bg-white rounded-lg p-2">
                        <TouchableOpacity 
                            className="flex-row items-center p-2"
                            onPress={() => setSelectedMethod('efectivo')}
                        >
                            <RadioButton
                                value="efectivo"
                                status={selectedMethod === 'efectivo' ? 'checked' : 'unchecked'}
                                onPress={() => setSelectedMethod('efectivo')}
                                color="#95541b"
                            />
                            <Text className="ml-2 text-comidin-brown">Efectivo</Text>
                        </TouchableOpacity>
                        <View className="h-px bg-gray-200" />
                        <TouchableOpacity 
                            className="flex-row items-center p-2"
                            onPress={() => setSelectedMethod('mercadoPago')}
                        >
                            <RadioButton
                                value="mercadoPago"
                                status={selectedMethod === 'mercadoPago' ? 'checked' : 'unchecked'}
                                onPress={() => setSelectedMethod('mercadoPago')}
                                color="#95541b"
                            />
                            <Text className="ml-2 text-comidin-brown">Mercado Pago</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Botón confirmar */}
                <View className="p-4">
                    <TouchableOpacity
                        onPress={handleBuy}
                        disabled={!selectedMethod}
                        className={`p-3 rounded-full ${!selectedMethod ? 'opacity-50' : ''}`}
                        style={{backgroundColor: themeColors.bgColorSecondary(1)}}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            Confirmar pedido
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
} 