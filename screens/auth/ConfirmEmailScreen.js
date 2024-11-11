import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CustomInput from '../../components/formElements/CustomInput.js';
import CustomButton from '../../components/formElements/CustomButton.js';
import {useNavigation} from '@react-navigation/core';
import {cognitoPool} from '../../utils/cognito-pool';
import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetUserDataQuery } from '../../redux/apis/user';

export default function ConfirmEmailScreen() {
  const { params } = useRoute();
  const { email, password } = params;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const { data: userData, error: userError } = useGetUserDataQuery();
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(0);
  const resendDelay = 30; // Tiempo en segundos para esperar entre reenvíos

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResending(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleCodeChange = (text) => {
    setCode(text);
    setError('');
  };

  const onConfirmPressed = () => {
    if (!code) {
      setError('El código es requerido');
      return;
    }

    const user = new CognitoUser({
      Username: email,
      Pool: cognitoPool,
    });

    user.confirmRegistration(code, true, async (err, data) => {
      if(data){
        navigation.navigate('PersonalData', {
          email,
          password
        });
      }
      if(err){
        setError('El código ingresado no es válido');
        console.log(err);
      }
    })
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const onResendPress = () => {
    if (timer > 0) return; // No permitir reenvío si el temporizador está activo

    setIsResending(true);
    setTimer(resendDelay); // Iniciar el temporizador

    // Lógica para reenviar el código de confirmación
    cognitoPool.getCurrentUser().getAttributeVerificationCode('email', {
      onSuccess: () => {
        console.log('Código de verificación enviado nuevamente.');
      },
      onFailure: (err) => {
        console.error('Error al enviar el código de verificación:', err);
      },
    });
  };

  return (
    <SafeAreaView
      className='bg-comidin-dark-orange pt-3 w-full'
    >

      <ScrollView showsVerticalScrollIndicator={false} className='h-full px-9 bg-comidin-light-orange'>
        <View className='items-center w-full'>
          <Text className='font-bold text-3xl text-comidin-dark-orange py-8'>Confirmar email</Text>

          <CustomInput
            placeholder="Ingresa tu código de confirmación"
            value={code}
            setValue={handleCodeChange}
            error={error}
          />

          <View className='mt-5 w-full'>
            <CustomButton text="Confirmar" onPress={onConfirmPressed} />
          </View>

          <CustomButton
            text={timer > 0 ? `Reenviar código (${timer}s)` : "Reenviar código"}
            onPress={onResendPress}
            type="SECONDARY"
            disabled={timer > 0} // Deshabilitar el botón si el temporizador está activo
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
