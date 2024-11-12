import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from 'react-redux';
import { useGetAddressByUserIdQuery } from '../redux/apis/address';
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import { setCurrentAddress } from '../redux/slices/addressSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddressCard = ({ address, isDefault, onSetDefault }) => (
  <TouchableOpacity 
    className={`bg-white p-4 rounded-2xl mb-4 shadow-sm ${isDefault ? 'border-2 border-comidin-orange' : ''}`}
    onPress={onSetDefault}
  >
    <View className="flex-row justify-between items-start mb-2">
      <Text className="text-lg font-bold text-comidin-brown flex-1 mr-2">
        {address.street_name} {address.number}
      </Text>
      {isDefault && (
        <View className="bg-comidin-orange px-2 py-1 rounded shrink-0">
          <Text className="text-white text-sm">Predeterminada</Text>
        </View>
      )}
    </View>
    
    <View className="pt-2">
      <Text className="text-gray-600">Código postal: {address.postal_code}</Text>
      <Text className="text-gray-600">Tipo: {address.home_type}</Text>
      {address.reference && (
        <Text className="text-gray-600">Referencia: {address.reference}</Text>
      )}
    </View>
  </TouchableOpacity>
);

export default function SavedAddressesScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  const currentAddress = useSelector(state => state.address.currentAddress);
  const { data: addresses, isLoading, refetch } = useGetAddressByUserIdQuery(userData?.id);

  const handleAddNewAddress = () => {
    navigation.navigate('Location', { screen: 'Map', params: { fromSaved: true } });
  };

  const handleSetDefault = async (address) => {
    try {
      dispatch(setCurrentAddress(address));
      await AsyncStorage.setItem('userAddress', JSON.stringify(address));
      Alert.alert('Éxito', 'Dirección predeterminada actualizada');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la dirección predeterminada');
    }
  };

  return (
    <SafeAreaView className="bg-comidin-dark-orange pt-3 flex-1">
      <View className="flex-row items-center px-4 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon.ArrowLeft stroke="white" width={24} height={24} />
        </TouchableOpacity>
        <Text className="flex-1 text-white text-xl font-bold text-center mr-6">
          Mis Direcciones
        </Text>
      </View>

      <ScrollView className="flex-1 bg-comidin-light-orange px-4">
        <View className="py-6">
          <TouchableOpacity 
            onPress={handleAddNewAddress}
            className="bg-comidin-orange mb-4 p-4 rounded-2xl flex-row items-center justify-center"
          >
            <Icon.Plus stroke="white" width={24} height={24} />
            <Text className="text-white font-bold ml-2">Agregar Nueva Dirección</Text>
          </TouchableOpacity>

          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-lg text-gray-600">Cargando direcciones...</Text>
            </View>
          ) : addresses && addresses.length > 0 ? (
            addresses.map((address) => (
              <AddressCard 
                key={address.id} 
                address={address}
                isDefault={currentAddress?.id === address.id}
                onSetDefault={() => handleSetDefault(address)}
              />
            ))
          ) : (
            <View className="flex-1 justify-center items-center py-10">
              <Icon.MapPin 
                stroke="gray" 
                width={64} 
                height={64} 
                className="mb-4"
              />
              <Text className="text-lg text-gray-600 text-center">
                No tienes direcciones guardadas
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 