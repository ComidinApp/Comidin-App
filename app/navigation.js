import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { signIn, getCurrentSession } from './auth.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/HomeScreen.js';
import RestaurantScreen from '../screens/RestaurantScreen.js';
import CartScreen from '../screens/CartScreen.js';
import CommercesCategory from '../screens/CommercesCategory.js';
import PresentationScreen from '../screens/PresentationScreen.js';
import SignInScreen from '../screens/auth/SignInScreen.js';
import SignUpScreen from '../screens/auth/SignUpScreen.js';
import ConfirmEmailScreen from '../screens/auth/ConfirmEmailScreen.js';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen.js';
import NewPasswordScreen from '../screens/auth/NewPasswordScreen.js';

import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import {cognitoPool} from '../utils/cognito-pool.js';

const Stack = createNativeStackNavigator();

// Contexto de autenticación
export const AuthContext = React.createContext();

export default function Navigation() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    // Verificar si hay un token guardado
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Error al restaurar el token
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (username, password) => {
        try {
          const user = new CognitoUser({
            Username: username,
            Pool: cognitoPool,
          });
          // setUser(user);
      
          const authDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
          });
      
          user.authenticateUser(authDetails, {
            onSuccess: async res => {
              const token = res?.refreshToken?.token;
              await AsyncStorage.setItem('userToken', token);
              dispatch({ type: 'SIGN_IN', token: token });
            },

            onFailure: err => {
              console.log('Error de inicio de sesión:', err);
              // switch (err.name) {
              //   case 'UserNotConfirmedException':
              //     return Alert.alert(General.Error, Auth.UserNotConfirmed);
              //   case 'NotAuthorizedException':
              //     return Alert.alert(General.Error, Auth.IncorrectCredentials);
              //   default:
              //     return Alert.alert(General.Error, General.SomethingWentWrong);
              // }
            },
          });

        } catch (error) {
          console.error('Error de inicio de sesión:', error);
        }
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          dispatch({ type: 'SIGN_OUT' });
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer independent={true}>
        <Stack.Navigator screenOptions={{
           headerShown: false
         }}>
          {state.userToken == null ? (
            <>
              <Stack.Screen name="Presentation" component={PresentationScreen} />
              <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
            </>
          ) : (
            <>       
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Restaurant" component={RestaurantScreen} />
              <Stack.Screen name="Cart" options={{presentation: 'modal'}} component={CartScreen} />
              <Stack.Screen name="CommercesCategory" component={CommercesCategory} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}