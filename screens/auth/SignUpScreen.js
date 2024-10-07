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
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  const navigation = useNavigation();

  const onRegisterPressed = () => {
    navigation.navigate('ConfirmEmail', email);
    cognitoPool.signUp(email, password, [], null, (err, data) => {
      // setLoading(false);

      if (err) {
        console.log(err);
        // switch (err.name) {
        //   case 'InvalidParameterException':
        //     return Alert.alert(General.Error, Auth.InvalidEmail);
        //   case 'InvalidPasswordException':
        //     return Alert.alert(General.Error, Auth.InvalidPassword);
        //   case 'UsernameExistsException':
        //     return Alert.alert(General.Error, Auth.EmailAlreadyExists);
        //   default:
        //     return Alert.alert(General.Error, General.SomethingWentWrong);
        // }
      }

      // Alert.alert(General.Success, Auth.ConfirmEmail, [
      //   {text: 'OK', onPress: () => navigation.navigate('login')},
      // ]);
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

  return (
    <SafeAreaView
      className='bg-comidin-dark-orange pt-3'
    >
    <ScrollView showsVerticalScrollIndicator={false} className='h-full px-9 bg-comidin-light-orange'>
    <StatusBar style="dark-content" />
      <View className="items-center w-full">
        <Text className="font-bold text-3xl text-comidin-dark-orange py-8">Crear cuenta</Text>

        <CustomInput
          placeholder="Usuario"
          value={username}
          setValue={setUsername}
        />
        <CustomInput placeholder="Email" value={email} setValue={setEmail} />
        <CustomInput
          placeholder="Contraseña"
          value={password}
          setValue={setPassword}
          secureTextEntry
        />
        <CustomInput
          placeholder="Repetir contraseña"
          value={passwordRepeat}
          setValue={setPasswordRepeat}
          secureTextEntry
        />

        <CustomButton text="Registrar" onPress={onRegisterPressed} />

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
          <SocialSignInButtons />

          <CustomButton
            text="Have an account? Sign in"
            onPress={onSignInPress}
            type="TERTIARY"
          />
        
        </View> 
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};
