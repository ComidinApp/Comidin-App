import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CustomInput from "../../components/formElements/CustomInput.js";
import CustomButton from "../../components/formElements/CustomButton.js";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from '../../context/AuthContext.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserData } from '../../redux/slices/userSlice';
import { clearAddress, selectCurrentAddress } from '../../redux/slices/addressSlice';

export default function SignInScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const navigation = useNavigation();
  const { signIn, errorMessage } = useAuth();
  const dispatch = useDispatch();
  const currentAddress = useSelector(selectCurrentAddress);

  // Limpiar datos al montar el componente
  useEffect(() => {
    const clearAllData = async () => {
      try {
        console.log('Clearing all data...');
        
        // Limpiar AsyncStorage
        const keysToRemove = [
          'userToken',
          'userAddress',
          'userData',
          '@user_data'
        ];
        
        await AsyncStorage.multiRemove(keysToRemove);
        console.log('AsyncStorage cleared');

        // Limpiar Redux
        dispatch(clearAddress());
        dispatch(clearUserData());
        
        // Verificar que se haya limpiado
        const remainingAddress = await AsyncStorage.getItem('userAddress');
        console.log('Remaining address:', remainingAddress);
        console.log('Current Redux address:', currentAddress);
      } catch (error) {
        console.error('Error clearing data:', error);
      }
    };

    clearAllData();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El email es requerido';
    if (!emailRegex.test(email)) return 'El email no es válido';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es requerida';
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      username: validateEmail(username),
      password: validatePassword(password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate("ForgotPassword");
  };

  const onSignUpPress = () => {
    navigation.navigate("SignUp");
  };

  const onSignInPress = async () => {
    if (!validateForm()) return;
    
    try {
      // Limpiar datos antes de iniciar sesión
      await AsyncStorage.multiRemove([
        'userToken',
        'userAddress',
        'userData',
        '@user_data'
      ]);
      dispatch(clearAddress());
      dispatch(clearUserData());
      
      // Intentar iniciar sesión
      await signIn(username, password);
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  // Funciones para manejar el cambio de texto y limpiar errores
  const handleUsernameChange = (text) => {
    setUsername(text);
    setErrors(prev => ({ ...prev, username: '' })); // Limpiar error de username
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setErrors(prev => ({ ...prev, password: '' })); // Limpiar error de password
  };

  return (
    <SafeAreaView className='bg-comidin-dark-orange pt-3'>
      <ImageBackground 
        source={require("../../assets/images/backgroundComidin.png")} 
        resizeMode="cover" 
        className="h-full bg-transparent"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="h-full bg-comidin-light-orange/70"
        >
          <StatusBar style="dark-content" />
          <View className="items-center">
            <Text className="font-bold text-3xl text-comidin-dark-orange py-8">
              ¡Te damos la bienvenida!
            </Text>
            <View className="px-9 w-full">
              <CustomInput
                placeholder="Usuario (Email)"
                value={username}
                setValue={handleUsernameChange} // Usar la función de manejo
                error={errors.username} // Mostrar error si existe
              />
              <CustomInput
                placeholder="Contraseña"
                value={password}
                setValue={handlePasswordChange} // Usar la función de manejo
                secureTextEntry
                error={errors.password} // Mostrar error si existe
              />
              {errorMessage && (
                <Text className="text-red-500 text-center">{errorMessage}</Text>
              )}
              <View className="w-full py-5">
                <CustomButton text="Ingresar" onPress={onSignInPress} />
                <CustomButton
                  text="Recuperar contraseña"
                  onPress={onForgotPasswordPressed}
                  type="TERTIARY"
                />
              </View>
              <View className="flex items-center mt-12">
                <TouchableOpacity
                  onPress={onSignUpPress}
                  className="py-2 flex flex-row"
                >
                  <Text className="text-black text-lg font-semibold">
                    ¿No tienes cuenta? Regístrate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
