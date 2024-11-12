import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { useGetOrderStatusQuery } from '../redux/apis/order';

export default function OrderSuccessScreen({ route }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { orderId } = route.params;
    
    // Función auxiliar para obtener el mensaje según el estado
    const getStatusMessage = (status) => {
        switch (status) {
            case 'pending':
                return 'Tu pedido ha sido realizado con éxito. Te avisaremos cuando el local lo confirme.';
            case 'confirmed':
                return 'Tu pedido ha sido realizado con éxito. Pronto te avisaremos cuando puedas retirarlo.';
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

    const { data: orderData, refetch } = useGetOrderStatusQuery(orderId, {
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

                        {orderStatus === 'ready' && (
                            <Text className="text-comidin-orange text-center font-bold mt-2">
                                Dirígete al local para retirar tu pedido
                            </Text>
                        )}
                    </View>
                </View>

                <View className="absolute bottom-10 left-0 right-0 px-4">
                    <TouchableOpacity
                        onPress={handleBackToHome}
                        className="bg-comidin-dark-orange p-4 rounded-full"
                    >
                        <Text className="text-white font-bold text-center">
                            {orderStatus === 'ready' ? 'Ir a retirar' : 'Salir'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
} 