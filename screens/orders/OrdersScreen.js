import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from 'react-redux';
import { useGetUserOrdersQuery } from '../../redux/apis/order';
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';

// Función para formatear la fecha
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

// Componente para cada pedido
const OrderCard = ({ order, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="bg-white p-4 rounded-2xl mb-4 shadow-sm"
  >
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-lg font-bold text-comidin-brown">
        Pedido #{order.id}
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
    </View>
    
    <View className="border-t border-gray-200 pt-2">
      <Text className="text-gray-600">Comercio: {order.commerce.name}</Text>
      <Text className="text-gray-600">Total: ${order.total_amount}</Text>
      <Text className="text-gray-600">Tipo de entrega: {order.delivery_type}</Text>
      <Text className="text-gray-600">Dirección: {order.address.street_name} {order.address.number}</Text>
      <Text className="text-gray-600">Fecha: {formatDate(order.created_at)}</Text>
    </View>
  </TouchableOpacity>
);

export default function OrdersScreen() {
  const navigation = useNavigation();
  const userData = useSelector(state => state.user.userData);
  const { data: orders, isLoading, error } = useGetUserOrdersQuery(userData?.id);

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetail', { order });
  };

  return (
    <SafeAreaView className="bg-comidin-dark-orange pt-3 flex-1">
      <View className="flex-row items-center px-4 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon.ArrowLeft stroke="white" width={24} height={24} />
        </TouchableOpacity>
        <Text className="flex-1 text-white text-xl font-bold text-center mr-6">
          Mis Pedidos
        </Text>
      </View>

      <ScrollView className="flex-1 bg-comidin-light-orange px-4">
        <View className="py-6">
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-lg text-gray-600">Cargando pedidos...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-lg text-red-600">Error al cargar los pedidos</Text>
            </View>
          ) : orders && orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onPress={() => handleOrderPress(order)}
              />
            ))
          ) : (
            <View className="flex-1 justify-center items-center py-10">
              <Icon.ShoppingBag 
                stroke="gray" 
                width={64} 
                height={64} 
                className="mb-4"
              />
              <Text className="text-lg text-gray-600 text-center">
                Aún no has realizado ningún pedido
              </Text>
              <TouchableOpacity 
                className="mt-4 bg-comidin-orange px-6 py-3 rounded-full"
                onPress={() => navigation.navigate('HomeScreen')}
              >
                <Text className="text-white font-bold">
                  Explorar comercios
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 