import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CustomInput from '../../components/formElements/CustomInput.js';
import CustomButton from '../../components/formElements/CustomButton.js';
import {useNavigation, useRoute} from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function NewPasswordScreen() {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    code: '',
    password: ''
  });
  
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;
  const { confirmPassword, errorMessage } = useAuth();

  const validateCode = (code) => {
    if (!code) return 'El código es requerido';
    if (!/^\d+$/.test(code)) return 'El código debe contener solo números';
    if (code.length !== 6) return 'El código debe tener 6 dígitos';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'La contraseña debe tener al menos una mayúscula';
    if (!/[a-z]/.test(password)) return 'La contraseña debe tener al menos una minúscula';
    if (!/[0-9]/.test(password)) return 'La contraseña debe tener al menos un número';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) 
      return 'La contraseña debe tener al menos un carácter especial';
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      code: validateCode(code),
      password: validatePassword(newPassword)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const onSubmitPressed = async () => {
    if (loading) return;
    if (!validateForm()) return;

    try {
      setLoading(true);
      await confirmPassword(username, code, newPassword);
      navigation.navigate('SignIn');
    } catch (error) {
      if (error.code === 'CodeMismatchException') {
        setErrors(prev => ({...prev, code: 'Código de verificación incorrecto'}));
      } else if (error.code === 'ExpiredCodeException') {
        setErrors(prev => ({...prev, code: 'El código ha expirado. Solicita uno nuevo'}));
      } else if (error.code === 'InvalidPasswordException') {
        setErrors(prev => ({...prev, password: 'La contraseña no cumple con los requisitos'}));
      } else {
        setErrors(prev => ({
          ...prev, 
          code: 'Ha ocurrido un error. Por favor, intenta nuevamente'
        }));
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (text) => {
    setCode(text);
    setErrors(prev => ({...prev, code: ''}));
  };

  const handlePasswordChange = (text) => {
    setNewPassword(text);
    setErrors(prev => ({...prev, password: ''}));
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView className='bg-comidin-dark-orange pt-3'>
      <ScrollView showsVerticalScrollIndicator={false} className='h-full px-7 bg-comidin-light-orange'>
        <StatusBar style="dark-content" />
        <View className="items-center w-full">
          <Text className="font-bold text-3xl text-comidin-dark-orange py-8">
            Restablecer contraseña
          </Text>

          <CustomInput 
            placeholder="Código de verificación" 
            value={code} 
            setValue={handleCodeChange}
            keyboardType="numeric"
            error={errors.code}
          />

          <CustomInput
            placeholder="Nueva contraseña"
            value={newPassword}
            setValue={handlePasswordChange}
            secureTextEntry
            error={errors.password}
          />

          <View className='mt-5 w-full'>
            <CustomButton 
              text={loading ? "Actualizando..." : "Actualizar contraseña"} 
              onPress={onSubmitPressed}
              disabled={loading}
            />
          </View>

          <CustomButton
            text="Volver a iniciar sesión"
            onPress={onSignInPress}
            type="TERTIARY"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});
