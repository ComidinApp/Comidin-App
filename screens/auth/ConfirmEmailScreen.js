import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CustomInput from '../../components/formElements/CustomInput.js';
import CustomButton from '../../components/formElements/CustomButton.js';
import {useNavigation} from '@react-navigation/core';
import {cognitoPool} from '../../utils/cognito-pool';
import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import { useRoute } from '@react-navigation/native';

export default function ConfirmEmailScreen() {
  const { params } = useRoute();
  let email = params;
  const [code, setCode] = useState('');

  const navigation = useNavigation();

  const onConfirmPressed = () => {
    console.log(email, cognitoPool);
    const user = new CognitoUser({
      Username: email,
      Pool: cognitoPool,
    });

    user.confirmRegistration(code, true, (err, data) => {
      if(data){
        navigation.navigate('SignIn');
      }
      if(err){
        console.log(err);
      }
    })
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const onResendPress = () => {
    console.warn('onResendPress');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className='pt-10 bg-orange-200'>
      <View style={styles.root}>
        <Text style={styles.title}>Confirm your email</Text>

        <CustomInput
          placeholder="Enter your confirmation code"
          value={code}
          setValue={setCode}
        />

        <CustomButton text="Confirm" onPress={onConfirmPressed} />

        <CustomButton
          text="Resend code"
          onPress={onResendPress}
          type="SECONDARY"
        />

        <CustomButton
          text="Back to Sign in"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
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
