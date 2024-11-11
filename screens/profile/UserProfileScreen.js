import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from 'react-redux';
import CustomInput from '../../components/formElements/CustomInput';
import CustomButton from '../../components/formElements/CustomButton';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useUpdateUserDataMutation, useGetUserDataQuery } from '../../redux/apis/user';
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';

// Función para formatear la fecha
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const datePart = dateString.split('T')[0];
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`;
};

// Definimos el componente InfoField aquí, antes de usarlo
const InfoField = ({ label, value, isDate = false }) => (
  <View className="mb-4">
    <Text className="text-xl font-bold text-comidin-dark-orange mb-1">
      {label}
    </Text>
    <View className="bg-white p-3 rounded-2xl border border-gray-300">
      <Text className="text-black">
        {isDate ? formatDate(value) : (value || '-')}
      </Text>
    </View>
  </View>
);

export default function UserProfileScreen() {
  const navigation = useNavigation();
  const userData = useSelector(state => state.user.userData);
  const [updateUserData] = useUpdateUserDataMutation();
  const { data: userDetails, refetch } = useGetUserDataQuery(userData?.id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    national_id: '',
    birthday: '',
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userDetails) {
      setFormData({
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        phone_number: userDetails.phone_number,
        national_id: userDetails.national_id,
        birthday: userDetails.birthday,
      });
    }
  }, [userDetails]);

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

  const validateForm = () => {
    const newErrors = {
      first_name: !formData.first_name ? 'El nombre es requerido' : '',
      last_name: !formData.last_name ? 'El apellido es requerido' : '',
      phone_number: !formData.phone_number ? 'El teléfono es requerido' : 
                   formData.phone_number.length < 8 ? 'El teléfono debe tener al menos 8 dígitos' : '',
      national_id: !formData.national_id ? 'El documento es requerido' : '',
      birthday: !formData.birthday ? 'La fecha de nacimiento es requerida' : 
                !validateAge(formData.birthday) ? 'Debes ser mayor de 18 años' : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // Creamos el objeto con el formato requerido
      const dataToUpdate = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: userDetails.email, // Mantenemos el email original
        phone_number: formData.phone_number,
        national_id: formData.national_id,
        is_active: true,
        password: userDetails.password, // Mantenemos la contraseña original
        birthday: formData.birthday.split('T')[0] // Aseguramos formato YYYY-MM-DD
      };

      await updateUserData({
        userId: userData.id,
        userData: dataToUpdate
      }).unwrap();
      
      setIsEditing(false);
      refetch(); // Actualizar los datos
      Alert.alert('Éxito', 'Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      Alert.alert('Error', 'No se pudieron actualizar los datos');
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'phone_number') {
      value = value.replace(/[^0-9]/g, '');
    }
    setFormData(prev => ({...prev, [field]: value}));
    setErrors(prev => ({...prev, [field]: ''}));
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setFormData({...formData, birthday: formattedDate});
    
    if (!validateAge(formattedDate)) {
      setErrors({...errors, birthday: 'Debes ser mayor de 18 años'});
    } else {
      setErrors({...errors, birthday: ''});
    }
    
    hideDatePicker();
  };

  return (
    <SafeAreaView className="bg-comidin-dark-orange pt-3 flex-1">
      <View className="flex-row items-center px-4 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon.ArrowLeft stroke="white" width={24} height={24} />
        </TouchableOpacity>
        <Text className="flex-1 text-white text-xl font-bold text-center mr-6">
          Mi Perfil
        </Text>
      </View>

      <ScrollView className="flex-1 bg-comidin-light-orange px-4">
        <View className="py-6">
          {!isEditing ? (
            // Modo visualización
            <>
              <InfoField label="Nombre" value={formData.first_name} />
              <InfoField label="Apellido" value={formData.last_name} />
              <InfoField label="Teléfono" value={formData.phone_number} />
              <InfoField label="Documento" value={formData.national_id} />
              <InfoField 
                label="Fecha de nacimiento" 
                value={formData.birthday}
                isDate={true}
              />
              
              <CustomButton
                text="Editar datos"
                onPress={() => setIsEditing(true)}
                type="PRIMARY"
                className="mt-4"
              />
            </>
          ) : (
            // Modo edición
            <>
              <CustomInput
                placeholder="Nombre"
                value={formData.first_name}
                setValue={(text) => handleInputChange('first_name', text)}
                capitalize="words"
                error={errors.first_name}
              />

              <CustomInput
                placeholder="Apellido"
                value={formData.last_name}
                setValue={(text) => handleInputChange('last_name', text)}
                capitalize="words"
                error={errors.last_name}
              />

              <CustomInput
                placeholder="Número de teléfono"
                value={formData.phone_number}
                setValue={(text) => handleInputChange('phone_number', text)}
                keyboardType="phone-pad"
                error={errors.phone_number}
              />

              <CustomInput
                placeholder="Documento de identidad"
                value={formData.national_id}
                setValue={(text) => handleInputChange('national_id', text)}
                keyboardType="numeric"
                error={errors.national_id}
              />

              <View className="w-full max-w-md mb-4">
                <Text className="block text-xl font-bold mb-1 text-comidin-dark-orange">
                  Fecha de nacimiento
                </Text>
                <TouchableOpacity
                  onPress={showDatePicker}
                  className={`w-full h-12 mb-1 px-3 border rounded-2xl bg-white justify-center
                    ${errors.birthday ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <Text className="text-black">
                    {formData.birthday ? formatDate(formData.birthday) : ""}
                  </Text>
                </TouchableOpacity>
                {errors.birthday && (
                  <Text className="text-red-500 text-sm">{errors.birthday}</Text>
                )}
              </View>

              <View className="flex-row justify-between space-x-4 mt-4 mb-6">
                <View className="flex-1">
                  <CustomButton
                    text="Cancelar"
                    onPress={() => {
                      setIsEditing(false);
                      setFormData(userDetails);
                    }}
                    type="SECONDARY"
                  />
                </View>
                <View className="flex-1">
                  <CustomButton
                    text="Guardar"
                    onPress={handleSave}
                    type="PRIMARY"
                  />
                </View>
              </View>
            </>
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
      </ScrollView>
    </SafeAreaView>
  );
} 