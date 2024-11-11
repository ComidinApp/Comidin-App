import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CustomInput from '../../components/formElements/CustomInput.js';
import CustomButton from '../../components/formElements/CustomButton.js';
import SocialSignInButtons from '../../components/formElements/SocialSignInButtons.js';
import {useNavigation} from '@react-navigation/core';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {cognitoPool} from '../../utils/cognito-pool';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    passwordRepeat: ''
  });

  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El email es requerido';
    if (!emailRegex.test(email)) return 'El email no es válido';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'La contraseña debe tener al menos una mayúscula';
    if (!/[a-z]/.test(password)) return 'La contraseña debe tener al menos una minúscula';
    if (!/[0-9]/.test(password)) return 'La contraseña debe tener al menos un número';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'La contraseña debe tener al menos un carácter especial';
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      passwordRepeat: password !== passwordRepeat ? 'Las contraseñas no coinciden' : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const onRegisterPressed = () => {
    if (!validateForm()) return;

    cognitoPool.signUp(email, password, [], null, (err, data) => {
      if (err) {
        switch (err.code) {
          case 'UsernameExistsException':
            setErrors(prev => ({...prev, email: 'Este email ya está registrado'}));
            break;
          case 'InvalidPasswordException':
            setErrors(prev => ({...prev, password: 'La contraseña no cumple con los requisitos de seguridad'}));
            break;
          case 'InvalidParameterException':
            if (err.message.includes('email')) {
              setErrors(prev => ({...prev, email: 'El formato del email no es válido'}));
            } else {
              setErrors(prev => ({...prev, password: 'La contraseña no cumple con los requisitos'}));
            }
            break;
          default:
            console.log(err);
            setErrors(prev => ({...prev, email: 'Ha ocurrido un error. Por favor, intenta nuevamente'}));
        }
        return;
      }

      navigation.navigate('ConfirmEmail', {
        email,
        password
      });
    });
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');

  };

  const onTermsOfUsePressed = () => {
    console.warn('onTermsOfUsePressed');
  };

  const onPrivacyPressed = () => {
    console.warn('onPrivacyPressed');
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setErrors(prev => ({...prev, email: ''}));
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setErrors(prev => ({...prev, password: ''}));
  };

  const handlePasswordRepeatChange = (text) => {
    setPasswordRepeat(text);
    setErrors(prev => ({...prev, passwordRepeat: ''}));
  };

  return (
    <SafeAreaView
      className='bg-comidin-dark-orange pt-3'
    >
    <ScrollView showsVerticalScrollIndicator={false} className='h-full px-9 bg-comidin-light-orange'>
    <StatusBar style="dark-content" />
      <View className="items-center w-full">
        <Text className="font-bold text-3xl text-comidin-dark-orange py-8">Crear cuenta</Text>

        <CustomInput 
          placeholder="Email" 
          value={email} 
          setValue={handleEmailChange}
          keyboardType="email-address"
          error={errors.email}
        />
        <CustomInput
          placeholder="Contraseña"
          value={password}
          setValue={handlePasswordChange}
          secureTextEntry
          error={errors.password}
        />
        <CustomInput
          placeholder="Repetir contraseña"
          value={passwordRepeat}
          setValue={handlePasswordRepeatChange}
          secureTextEntry
          error={errors.passwordRepeat}
        />

        <View className="w-full py-5">
          <CustomButton text="Registrar" onPress={onRegisterPressed} />
        </View>
        {/* <Text style={styles.text}>
          By registering, you confirm that you accept our{' '}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms of Use
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={onPrivacyPressed}>
            Privacy Policy
          </Text>
        </Text> */}

        <View className="flex items-center mt-12 w-full">

          <CustomButton
            text="Iniciar sesión"
            onPress={onSignInPress}
            type="SECONDARY"
          />
        
        </View> 
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};
