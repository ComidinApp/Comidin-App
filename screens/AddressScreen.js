import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import CustomInput from '../components/formElements/CustomInput';
import CustomButton from '../components/formElements/CustomButton';
import { usePostAddressMutation } from '../redux/apis/address';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCurrentAddress } from '../redux/slices/addressSlice';

const AddressScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const [postAddress] = usePostAddressMutation();
  const userData = useSelector(state => state.user.userData);
  const { signOut } = useAuth();
  const dispatch = useDispatch();
  
  const [address, setAddress] = useState({
    street: '',
    number: '',
    city: '',
    state: '',
    zipCode: '',
    homeType: 'Casa', // Valor por defecto
    extraInfo: '',
    homeReferralName: '',
  });

  useEffect(() => {
    if (location) {
      setAddress({
        ...address,
        street: location.street || '',
        number: location.streetNumber || '',
        city: location.city || '',
        state: location.region || '',
        zipCode: location.postalCode || '',
        coordinates: `${location.latitude},${location.longitude}`,
      });
    }
  }, [location]);

  const handleConfirm = async () => {
    try {
      const addressData = {
        user_id: userData.id,
        street_name: address.street,
        number: address.number,
        postal_code: address.zipCode,
        home_type: address.homeType,
        extra_info: address.extraInfo,
        home_referral_name: address.homeReferralName,
        coordinates: address.coordinates,
      };

      const savedAddress = await postAddress(addressData).unwrap();
      
      dispatch(setCurrentAddress(savedAddress));
      
      await AsyncStorage.setItem('userAddress', JSON.stringify(savedAddress));

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'App',
          },
        ],
      });
    } catch (error) {
      console.error('Error al guardar la dirección:', error);
    }
  };

  return (
    <SafeAreaView className='bg-comidin-dark-orange pt-3 w-full'>
      <ScrollView showsVerticalScrollIndicator={false} className='h-full px-9 bg-comidin-light-orange'>
        <View className='items-center w-full'>
          <Text className='font-bold text-3xl text-comidin-dark-orange py-8'>
            Confirma tu dirección
          </Text>
          
          <CustomInput
            placeholder="Calle"
            value={address.street}
            setValue={(text) => setAddress({ ...address, street: text })}
            capitalize="words"
          />
          
          <CustomInput
            placeholder="Número"
            value={address.number}
            setValue={(text) => setAddress({ ...address, number: text })}
          />
          
          <CustomInput
            placeholder="Ciudad"
            value={address.city}
            setValue={(text) => setAddress({ ...address, city: text })}
            capitalize="words"
          />
          
          <CustomInput
            placeholder="Estado"
            value={address.state}
            setValue={(text) => setAddress({ ...address, state: text })}
            capitalize="words"
          />
          
          <CustomInput
            placeholder="Código Postal"
            value={address.zipCode}
            setValue={(text) => setAddress({ ...address, zipCode: text })}
          />
          
          <CustomInput
            placeholder="Tipo de vivienda"
            value={address.homeType}
            setValue={(text) => setAddress({ ...address, homeType: text })}
            capitalize="words"
          />
          
          <CustomInput
            placeholder="Información adicional"
            value={address.extraInfo}
            setValue={(text) => setAddress({ ...address, extraInfo: text })}
            multiline
          />
          
          <CustomInput
            placeholder="Nombre de referencia"
            value={address.homeReferralName}
            setValue={(text) => setAddress({ ...address, homeReferralName: text })}
            capitalize="words"
          />

          <View className="mt-6 w-full mb-6 gap-4">
            <CustomButton 
              text="Confirmar Dirección"
              onPress={handleConfirm}
              type="PRIMARY"
            />
            <CustomButton 
              text="Cancelar y cerrar sesión"
              onPress={signOut}
              type="SECONDARY"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddressScreen;
