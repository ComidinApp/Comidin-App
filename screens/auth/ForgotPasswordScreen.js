import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CustomInput from '../../components/formElements/CustomInput.js';
import CustomButton from '../../components/formElements/CustomButton.js';
import {useNavigation} from '@react-navigation/core';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordScreen() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: ''
  });
  const { forgotPassword, errorMessage } = useAuth();

  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El email es requerido';
    if (!emailRegex.test(email)) return 'El email no es válido';
    return '';
  };

  const validateForm = () => {
    const emailError = validateEmail(username);
    setErrors({ email: emailError });
    return !emailError;
  };

  const onSendPressed = async () => {
    if (loading) return;
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await forgotPassword(username);
      navigation.navigate('NewPassword', { username });
    } catch (error) {
      if (error.code === 'UserNotFoundException') {
        setErrors({ email: 'Ha ocurrido un error. Por favor, intenta nuevamente' });
      } else if (error.code === 'LimitExceededException') {
        setErrors({ email: 'Demasiados intentos. Por favor, intenta más tarde' });
      } else {
        setErrors({ email: 'Ha ocurrido un error. Por favor, intenta nuevamente' });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (text) => {
    setUsername(text);
    setErrors({ email: '' });
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView
      className='bg-comidin-dark-orange pt-3'
    >
    <ScrollView showsVerticalScrollIndicator={false} className='h-full px-9 bg-comidin-light-orange'>
    <StatusBar style="dark-content" />
      <View className="items-center w-full" >
        <Text className="font-bold text-3xl text-comidin-dark-orange py-8"> Recuperar contraseña</Text>

        <CustomInput
          placeholder="Correo electrónico"
          value={username}
          setValue={handleEmailChange}
          keyboardType="email-address"
          error={errors.email}
        />

        {errorMessage && (
          <Text className="text-red-500 mt-2">{errorMessage}</Text>
        )}

        <View className='mt-5 w-full'>
          <CustomButton 
            text={loading ? "Enviando..." : "Enviar"} 
            onPress={onSendPressed}
            disabled={loading}
          />
        </View>

        <CustomButton
          text="Volver al inicio de sesión"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

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
