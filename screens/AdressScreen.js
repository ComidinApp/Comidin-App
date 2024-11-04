import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import CustomInput from '../components/formElements/CustomInput';
import CustomButton from '../components/formElements/CustomButton';
import { usePostAdressMutation } from '../redux/apis/adress';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

const AdressScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const [postAddress] = usePostAdressMutation();
//   const userId = useSelector(state => state.auth.user.id); // Asumiendo que tienes el ID del usuario en el estado de auth
  
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
        user_id: 1,
        street_name: address.street,
        number: address.number,
        postal_code: address.zipCode,
        home_type: address.homeType,
        extra_info: address.extraInfo,
        home_referral_name: address.homeReferralName,
        coordinates: address.coordinates,
      };

    //   await postAddress(addressData).unwrap();
      navigation.navigate('App', { 
        screen: 'Home',
        params: { confirmedAddress: address }
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

          <View className="mt-6 w-full mb-6">
            <CustomButton 
              text="Confirmar Dirección"
              onPress={handleConfirm}
              type="PRIMARY"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdressScreen;
