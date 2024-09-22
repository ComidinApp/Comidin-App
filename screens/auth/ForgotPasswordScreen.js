import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CustomInput from '../../components/formElements/CustomInput.js';
import CustomButton from '../../components/formElements/CustomButton.js';
import {useNavigation} from '@react-navigation/core';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function ForgotPasswordScreen() {
  const [username, setUsername] = useState('');

  const navigation = useNavigation();

  const onSendPressed = () => {
    navigation.navigate('NewPassword');
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
          placeholder="Usuario"
          value={username}
          setValue={setUsername}
        />

        <CustomButton text="Enviar" onPress={onSendPressed} />

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
