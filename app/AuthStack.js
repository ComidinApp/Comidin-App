import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PresentationScreen from '../screens/PresentationScreen.js';
import SignInScreen from '../screens/auth/SignInScreen.js';
import SignUpScreen from '../screens/auth/SignUpScreen.js';
import ConfirmEmailScreen from '../screens/auth/ConfirmEmailScreen.js';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen.js';
import NewPasswordScreen from '../screens/auth/NewPasswordScreen.js';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Presentation" component={PresentationScreen} />
      <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
    </Stack.Navigator>
  );
}