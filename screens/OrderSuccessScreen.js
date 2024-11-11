import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OrderSuccessScreen({ route }) {
    const navigation = useNavigation();
    const { orderId } = route.params;

    return (
        <View className="flex-1 bg-white justify-center items-center p-4">
            <Text className="text-2xl font-bold text-comidin-brown mb-4">
                ¡Pedido confirmado!
            </Text>
            <Text className="text-comidin-brown text-center mb-8">
                Tu pedido #{orderId} ha sido registrado exitosamente
            </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                className="bg-comidin-orange p-4 rounded-full"
            >
                <Text className="text-white font-bold">
                    Volver al inicio
                </Text>
            </TouchableOpacity>
        </View>
    );
} 