// import React from 'react'
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from './screens/HomeScreen';
// import RestaurantScreen from './screens/RestaurantScreen';
// import CartScreen from './screens/CartScreen';
// import PresentationScreen from './screens/PresentationScreen.js';

// import SignInScreen from './screens/auth/SignInScreen.js';
// import SignUpScreen from './screens/auth/SignUpScreen.js';
// import ConfirmEmailScreen from './screens/auth/ConfirmEmailScreen.js';
// import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen.js';
// import NewPasswordScreen from './screens/auth/NewPasswordScreen.js';

// const Stack = createNativeStackNavigator();

// export default function Navigation() {
//   return (
//     <NavigationContainer independent={true}>
//       <Stack.Navigator  screenOptions={{
//           headerShown: false
//         }}>
//         <Stack.Screen name="Restaurant" component={RestaurantScreen} />
//         <Stack.Screen name="Cart" options={{presentation: 'modal'}} component={CartScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   )
// }


import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { signIn, getCurrentSession } from './auth.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/HomeScreen.js';
import RestaurantScreen from '../screens/RestaurantScreen.js';
import CartScreen from '../screens/CartScreen.js';
import PresentationScreen from '../screens/PresentationScreen.js';
import SignInScreen from '../screens/auth/SignInScreen.js';
import SignUpScreen from '../screens/auth/SignUpScreen.js';
import ConfirmEmailScreen from '../screens/auth/ConfirmEmailScreen.js';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen.js';
import NewPasswordScreen from '../screens/auth/NewPasswordScreen.js';

import { Amplify } from 'aws-amplify'; 
import { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';

import outputs from "./amplifyconfiguration.json";

Amplify.configure(outputs);

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
          console.log(username, password);
          
          const user = await Auth.signIn(username, password);
          const token = await getCurrentSession();
          await AsyncStorage.setItem('userToken', token);
          dispatch({ type: 'SIGN_IN', token: token });
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
            <Stack.Screen name="SignIn" component={SignInScreen} />
          ) : (
            <>       
              <Stack.Screen name="Presentation" component={PresentationScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Restaurant" component={RestaurantScreen} />
              <Stack.Screen name="Cart" options={{presentation: 'modal'}} component={CartScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}


// import { useState, useMemo, useEffect } from 'react';
// import * as WebBrowser from 'expo-web-browser';
// import { useAuthRequest, exchangeCodeAsync, revokeAsync, ResponseType } from 'expo-auth-session';
// import { Button, Alert } from 'react-native';

// WebBrowser.maybeCompleteAuthSession();

// const clientId = '<your-client-id-here>';
// const userPoolUrl =
//   'https://<your-user-pool-domain>.auth.<your-region>.amazoncognito.com';
// const redirectUri = 'your-redirect-uri';

// export default function App() {
//   const [authTokens, setAuthTokens] = useState(null);
//   const discoveryDocument = useMemo(() => ({
//     authorizationEndpoint: userPoolUrl + '/oauth2/authorize',
//     tokenEndpoint: userPoolUrl + '/oauth2/token',
//     revocationEndpoint: userPoolUrl + '/oauth2/revoke',
//   }), []);

//   const [request, response, promptAsync] = useAuthRequest(
//     {
//       clientId,
//       responseType: ResponseType.Code,
//       redirectUri,
//       usePKCE: true,
//     },
//     discoveryDocument
//   );

//   useEffect(() => {
//     const exchangeFn = async (exchangeTokenReq) => {
//       try {
//         const exchangeTokenResponse = await exchangeCodeAsync(
//           exchangeTokenReq,
//           discoveryDocument
//         );
//         setAuthTokens(exchangeTokenResponse);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     if (response) {
//       if (response.error) {
//         Alert.alert(
//           'Authentication error',
//           response.params.error_description || 'something went wrong'
//         );
//         return;
//       }
//       if (response.type === 'success') {
//         exchangeFn({
//           clientId,
//           code: response.params.code,
//           redirectUri,
//           extraParams: {
//             code_verifier: request.codeVerifier,
//           },
//         });
//       }
//     }
//   }, [discoveryDocument, request, response]);

//   const logout = async () => {
//     const revokeResponse = await revokeAsync(
//       {
//         clientId: clientId,
//         token: authTokens.refreshToken,
//       },
//       discoveryDocument
//     );
//     if (revokeResponse) {
//       setAuthTokens(null);
//     }
//   };
//   console.log('authTokens: ' + JSON.stringify(authTokens));
//   return authTokens ? (
//     <Button title="Logout" onPress={() => logout()} />
//   ) : (
//     <Button disabled={!request} title="Login" onPress={() => promptAsync()} />
//   );
// }
