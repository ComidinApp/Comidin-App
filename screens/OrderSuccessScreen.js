import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { useGetOrderStatusQuery } from '../redux/apis/order';
import { selectRestaurant } from "../redux/slices/restaurantSlice";
import * as Icon from "react-native-feather";

export default function OrderSuccessScreen({ route }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { orderId } = route.params;
    const restaurant = useSelector(selectRestaurant);
    
    // Función auxiliar para obtener el mensaje según el estado
    const getStatusMessage = (status) => {
        switch (status) {
            case 'pending':
                return 'Tu pedido ha sido realizado con éxito. Te avisaremos cuando el local lo confirme.';
            case 'confirmed':
                return 'Tu pedido está listo para ser retirado. Dirígete al local para recogerlo.';
            case 'ready':
                return 'Tu pedido está listo para ser retirado. Dirígete al local para recogerlo.';
            case 'completed':
                return 'Pedido entregado';
            case 'cancelled':
                return 'Pedido cancelado';
            case 'refunded':
                return 'Pedido reembolsado';
            default:
                return 'Procesando...';
        }
    };

    const { data: orderData } = useGetOrderStatusQuery(orderId, {
        pollingInterval: 5000,
    });

    const orderStatus = orderData?.status || 'pending';
    const message = getStatusMessage(orderStatus);

    const handleBackToHome = () => {
        dispatch(clearCart());
        navigation.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
        });
    };

    const getStatusColor = () => {
        switch (orderStatus) {
            case 'pending':
                return 'text-yellow-600';
            case 'confirmed':
                return 'text-orange-600';
            case 'ready':
                return 'text-green-600';
            case 'completed':
                return 'text-gray-600';
            case 'cancelled':
            case 'refunded':
                return 'text-red-600';
            default:
                return 'text-comidin-orange';
        }
    };

    return (
        <ImageBackground 
            source={require('../assets/images/backgroundOrder.png')} 
            className="flex-1"
            resizeMode="cover"
        >
            <View className="flex-1 relative">
                <View className="flex-1 items-center justify-center p-4">
                    <View className="bg-comidin-light-orange p-6 rounded-2xl w-full max-w-sm border-2 border-comidin-green/40">
                        <Image 
                            source={require('../assets/images/orderSuccess.png')}
                            className="w-32 h-32 self-center mb-4"
                            resizeMode="contain"
                        />
                        
                        <Text className={`text-xl font-extrabold ${getStatusColor()} text-center mb-2`}>
                            {message}
                        </Text>
                        {(orderStatus === 'confirmed' || orderStatus === 'pending') && (
                            <TouchableOpacity 
                                onPress={() => navigation.navigate('Directions')}
                                className="bg-white p-3 rounded-lg mt-4"
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
                        )}
                    </View>
                </View>

                <View className="absolute bottom-10 left-0 right-0 px-4">
                    <TouchableOpacity
                        onPress={handleBackToHome}
                        className="bg-comidin-dark-orange p-4 rounded-full"
                    >
                        <Text className="text-white font-bold text-center">
                            {orderStatus === 'confirmed' ? 'Ir a retirar' : 'Salir'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
} 