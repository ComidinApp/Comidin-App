import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/core';
import { useSelector } from "react-redux";
import { selectRestaurant } from "../redux/slices/restaurantSlice";
import { selectCartItems, selectCartTotal } from "../redux/slices/cartSlice";
import { RadioButton } from 'react-native-paper';
import { handleIntegrationMP } from "../utils/MPIntegration.js"
import { openBrowserAsync } from "expo-web-browser";
import * as Icon from "react-native-feather";
import { themeColors } from "@/theme";
import { useCreateOrderMutation } from '../redux/apis/order';
import { useDispatch } from 'react-redux';
import { selectCurrentAddress } from '../redux/slices/addressSlice';
import { clearCart } from '../redux/slices/cartSlice';
import * as Linking from 'expo-linking';
import { useNotification } from '../context/NotificationContext'; // Importar el hook

export default function PaymentScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const restaurant = useSelector(selectRestaurant);
    const cartTotal = useSelector(selectCartTotal);
    const cartItems = useSelector(selectCartItems);
    const userData = useSelector(state => state.user.userData);
    const userAddress = useSelector(selectCurrentAddress);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [createOrder] = useCreateOrderMutation();
    const { expoPushToken } = useNotification(); // Obtener expoPushToken

    useEffect(() => {
        const handleDeepLink = async (event) => {
            let data = Linking.parse(event.url);
            const status = data.path?.split('/')[1]; // Obtiene 'success', 'failure' o 'pending'
            
            if (status === 'success') {
                const orderId = await handleCreateOrder('mercadopago', 'paid');
                if (orderId) {
                    navigation.navigate('OrderSuccess', { orderId });
                }
            } else if (status === 'failure') {
                Alert.alert('Error', 'El pago no pudo ser procesado');
            } else if (status === 'pending') {
                const orderId = await handleCreateOrder('mercadopago', 'pending');
                if (orderId) {
                    navigation.navigate('OrderSuccess', { orderId });
                }
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);

        return () => {
            subscription.remove();
        };
    }, []);

    const handleCreateOrder = async (paymentMethod, paymentStatus = 'pending') => {
        try {
            const orderData = {
                user_id: userData.id, // Assuming userData contains the user's ID
                commerce_id: restaurant.id, // Assuming restaurant object has the commerce ID
                address_id: userAddress.id, // Using the selected address ID
                created_at: new Date(),
                total_amount: cartTotal.toString(),
                status: paymentStatus,
                delivery_type: 'pickup', // Since this is pickup only
                payment_method: paymentMethod,
                items_quantity: cartItems.length,
                details: cartItems.map(item => ({
                    publication_id: item.id,
                    created_at: new Date(),
                    quantity: item.quantity.toString(),
                    amount: item.discounted_price.toString()
                })),
                token: expoPushToken, // Agregar el token a orderData
            };
            const response = await createOrder(orderData).unwrap();
            
            if (response) {
                dispatch(clearCart());
                return response.id; // Retornar el ID de la orden
            }
            throw new Error('No se recibió respuesta del servidor');
        } catch (error) {
            console.error('Error creating order:', error);
            Alert.alert('Error', 'No se pudo crear el pedido');
            return null;
        }
    };

    const handleBuy = async () => {
        if (selectedMethod === 'efectivo') {
            const orderId = await handleCreateOrder('cash', 'pending');
            if (orderId) {
                navigation.navigate('OrderSuccess', { orderId });
            }
        } else if (selectedMethod === 'mercadoPago') {
            try {
                // Primero creamos la orden
                const orderId = await handleCreateOrder('mercadopago', 'pending');
                
                if (!orderId) {
                    Alert.alert('Error', 'No se pudo crear el pedido');
                    return;
                }

                // Luego creamos la preferencia de MP
                const preferencia = {
                    "items": [{
                        "title": "Comidin",
                        "description": restaurant.name,
                        "picture_url": "https://comidin-assets-tjff.s3.amazonaws.com/commerce-logos/Comidin.png",
                        "category_id": "car_electronics",
                        "quantity": 1,
                        "currency_id": "$",
                        "unit_price": cartTotal
                    }],
                    "back_urls": {
                        "success": "comidin://payment/success",
                        "failure": "comidin://payment/failure",
                        "pending": "comidin://payment/pending"
                    },
                    "external_reference": orderId.toString(), // Agregamos el ID de la orden como referencia
                    "auto_return": "all",
                    "binary_mode": true
                };
                
                const mpUrl = await handleIntegrationMP(preferencia);
                if (!mpUrl) {
                    Alert.alert('Error', 'No se pudo iniciar el pago');
                    return;
                }

                // Abrimos Mercado Pago
                await openBrowserAsync(mpUrl);
                
                // Navegamos a la pantalla de éxito
                navigation.navigate('OrderSuccess', { orderId });

            } catch (error) {
                console.error('Error en el proceso de pago:', error);
                Alert.alert('Error', 'No se pudo completar el proceso de pago');
            }
        }
    };

    const getButtonConfig = () => {
        if (selectedMethod === 'efectivo') {
            return {
                text: "Confirmar pedido",
                color: themeColors.bgColorSecondary(1)
            };
        } else if (selectedMethod === 'mercadoPago') {
            return {
                text: "Ir a Mercado Pago",
                color: "#4287f5"
            };
        }
        return {
            text: "Confirmar pedido",
            color: themeColors.bgColorSecondary(1)
        };
    };

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
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Directions')}
                        className="bg-white p-3 rounded-lg"
                    >
                        <View className="flex-row items-center">
                            <Image 
                                source={require('../assets/images/delivery-boy.png')} 
                                className="w-12 h-12 mr-3 rounded-md"
                            />
                            <View className="flex-1">
                                <Text className="text-comidin-brown">
                                    {restaurant.street_name} {restaurant.number}, {restaurant.city}
                                </Text>
                                <Text className="text-comidin-dark-orange">
                                    Instrucciones para llegar
                                </Text>
                            </View>
                            <Icon.ChevronRight stroke="#95541b" />
                        </View>
                    </TouchableOpacity>
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
                        style={{backgroundColor: getButtonConfig().color}}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {getButtonConfig().text}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
} 