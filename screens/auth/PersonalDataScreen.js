import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import CustomInput from '../../components/formElements/CustomInput.js';
import CustomButton from '../../components/formElements/CustomButton.js';
import {useNavigation, useRoute} from '@react-navigation/core';
import { SafeAreaView } from "react-native-safe-area-context";
import { usePostUserDataMutation } from '../../redux/apis/user';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';

export default function PersonalDataScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, password } = route.params || {};
  const [postUserData] = usePostUserDataMutation();
  const dispatch = useDispatch();
  const { signIn } = useAuth();

  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    national_id: '',
    birthday: '',
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    national_id: '',
    birthday: ''
  });

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const validateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setUserData({...userData, birthday: formattedDate});
    
    if (!validateAge(formattedDate)) {
      setErrors({...errors, birthday: 'Debes ser mayor de 18 años'});
    } else {
      setErrors({...errors, birthday: ''});
    }
    
    hideDatePicker();
  };

  const validateForm = () => {
    const newErrors = {
      first_name: !userData.first_name ? 'El nombre es requerido' : '',
      last_name: !userData.last_name ? 'El apellido es requerido' : '',
      phone_number: !userData.phone_number ? 'El teléfono es requerido' : 
                   userData.phone_number.length < 8 ? 'El teléfono debe tener al menos 8 dígitos' : '',
      national_id: !userData.national_id ? 'El documento es requerido' : '',
      birthday: !userData.birthday ? 'La fecha de nacimiento es requerida' : 
                !validateAge(userData.birthday) ? 'Debes ser mayor de 18 años' : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const onConfirmPressed = async () => {
    if (!validateForm()) return;

    try {
      const userDataToSend = {
        ...userData,
        is_active: true, 
        email,
        password
      };

      console.log(userDataToSend);
      const userResponse = await postUserData(userDataToSend).unwrap();
      console.log(userResponse);
      
      if(userResponse){
        await signIn(email, password);
      }

    } catch (error) {
      console.error('Error al guardar los datos:', JSON.stringify(error));
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'phone_number') {
      value = value.replace(/[^0-9]/g, '');
    }
    
    setUserData(prev => ({...prev, [field]: value}));
    
    if (field === 'phone_number') {
      setErrors(prev => ({...prev, phone_number: ''}));
    } else {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  return (
    <SafeAreaView
      className='bg-comidin-dark-orange pt-3 w-full'
    >
      <ScrollView showsVerticalScrollIndicator={false} className='h-full px-9 bg-comidin-light-orange'>
        <View className='items-center w-full'>
          <Text className='font-bold text-3xl text-comidin-dark-orange py-8'>
            Datos Personales
          </Text>

          <CustomInput
            placeholder="Nombre"
            value={userData.first_name}
            setValue={(text) => handleInputChange('first_name', text)}
            capitalize="words"
            error={errors.first_name}
          />

          <CustomInput
            placeholder="Apellido"
            value={userData.last_name}
            setValue={(text) => handleInputChange('last_name', text)}
            capitalize="words"
            error={errors.last_name}
          />

          <CustomInput
            placeholder="Número de teléfono"
            value={userData.phone_number}
            setValue={(text) => handleInputChange('phone_number', text)}
            keyboardType="phone-pad"
            error={errors.phone_number}
          />

          <CustomInput
            placeholder="Documento de identidad"
            value={userData.national_id}
            setValue={(text) => handleInputChange('national_id', text)}
            keyboardType="numeric"
            error={errors.national_id}
          />

          <View className="w-full max-w-md">
            <Text className="block text-xl font-bold mb-1 text-comidin-dark-orange">
              Fecha de nacimiento
            </Text>
            <TouchableOpacity
              onPress={showDatePicker}
              className={`w-full h-12 mb-1 px-3 border rounded-2xl bg-white justify-center
                ${errors.birthday ? 'border-red-500' : 'border-gray-300'}`}
            >
              <Text className="text-black">
                {userData.birthday || ""}
              </Text>
            </TouchableOpacity>
            {errors.birthday && (
              <Text className="text-red-500 text-sm mb-2">
                {errors.birthday}
              </Text>
            )}
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            locale="es-ES"
          />

          <View className='mt-5 w-full'>
            <CustomButton 
              text="Confirmar" 
              onPress={onConfirmPressed}
              type="PRIMARY"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};