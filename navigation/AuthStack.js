import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ConfirmEmailScreen from '../screens/auth/ConfirmEmailScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/auth/NewPasswordScreen';
import PresentationScreen from '../screens/PresentationScreen';
import PersonalDataScreen from '../screens/auth/PersonalDataScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Presentation" component={PresentationScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
    </Stack.Navigator>
  );
}

export default AuthStack;