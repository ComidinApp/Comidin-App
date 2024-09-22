import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import RestaurantScreen from './screens/RestaurantScreen';
import CartScreen from './screens/CartScreen';

import SignInScreen from './screens/auth/SignInScreen.js';
import SignUpScreen from './screens/auth/SignUpScreen.js';
import ConfirmEmailScreen from './screens/auth/ConfirmEmailScreen.js';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen.js';
import NewPasswordScreen from './screens/auth/NewPasswordScreen.js';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator  screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Restaurant" component={RestaurantScreen} />
        <Stack.Screen name="Cart" options={{presentation: 'modal'}} component={CartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}