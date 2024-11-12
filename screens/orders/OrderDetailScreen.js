import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as Icon from "react-native-feather";
import { useNavigation, useRoute } from '@react-navigation/native';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function OrderDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params;

  return (
    <SafeAreaView className="bg-comidin-dark-orange pt-3 flex-1">
      <View className="flex-row items-center px-4 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon.ArrowLeft stroke="white" width={24} height={24} />
        </TouchableOpacity>
        <Text className="flex-1 text-white text-xl font-bold text-center mr-6">
          Detalle del Pedido #{order.id}
        </Text>
      </View>

      <ScrollView className="flex-1 bg-comidin-light-orange px-4">
        <View className="py-6">
          {/* Información del comercio */}
          <View className="bg-white p-4 rounded-2xl mb-4">
            <Text className="text-xl font-bold text-comidin-brown mb-2">
              {order.commerce.name}
            </Text>
            <Text className="text-gray-600">
              {order.address.street_name} {order.address.number}
            </Text>
          </View>

          {/* Estado del pedido */}
          <View className="bg-white p-4 rounded-2xl mb-4">
            <Text className="text-lg font-bold text-comidin-brown mb-2">
              Estado del pedido
            </Text>
            <Text className={`font-bold ${
              order.status === 'ready' ? 'text-green-600' :
              order.status === 'pending' ? 'text-yellow-600' :
              'text-gray-600'
            }`}>
              {order.status === 'ready' ? 'Listo para retirar' :
               order.status === 'pending' ? 'Pendiente' :
               order.status}
            </Text>
            <Text className="text-gray-600 mt-2">
              Realizado el {formatDate(order.created_at)}
            </Text>
          </View>

          {/* Detalles de los productos */}
          <View className="bg-white p-4 rounded-2xl mb-4">
            <Text className="text-lg font-bold text-comidin-brown mb-2">
              Productos
            </Text>
            {order.order_details.map((detail, index) => (
                
              <View key={index} className="flex-row justify-between py-2 border-b border-gray-100">
                <Text className="text-gray-600">{detail.quantity}x {detail.publication.product.name}</Text>
                <Text className="text-gray-600">${detail.amount}</Text>
              </View>
            ))}
            <View className="flex-row justify-between mt-4 pt-2 border-t border-gray-200">
              <Text className="font-bold text-comidin-brown">Total</Text>
              <Text className="font-bold text-comidin-brown">${order.total_amount}</Text>
            </View>
          </View>

          {/* Información de entrega */}
          <View className="bg-white p-4 rounded-2xl mb-4">
            <Text className="text-lg font-bold text-comidin-brown mb-2">
              Información de entrega
            </Text>
            <Text className="text-gray-600">{order.delivery_type}</Text>
            <Text className="text-gray-600">
              {order.address.street_name} {order.address.number}
            </Text>
            <Text className="text-gray-600">CP: {order.address.postal_code}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 