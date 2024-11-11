import React, { createContext, useContext, useReducer, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { cognitoPool } from '../utils/cognito-pool.js';
import { authReducer, initialState } from '../utils/authReducer.js';
import { useLoading } from './LoadingContext';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { setUserData } from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { userApi } from '../redux/apis/user';
import { setCurrentAddress, clearAddress } from '../redux/slices/addressSlice';
import { addressApi } from '../redux/apis/address';
import { useNavigation } from '@react-navigation/native';
import { clearUserData } from '../redux/slices/userSlice';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { showLoading, hideLoading } = useLoading();
  const [errorMessage, setErrorMessage] = useState(null);
  const reduxDispatch = useDispatch();
  const navigation = useNavigation();

  const authContext = useMemo(
    () => ({
      signIn: async (username, password) => {
        try {
          showLoading('Iniciando sesión...');
          const user = new CognitoUser({
            Username: username,
            Pool: cognitoPool,
          });
      
          const authDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
          });
      
          user.authenticateUser(authDetails, {
            onSuccess: async res => {
              try {
                console.log('Login successful, getting user data...');
                showLoading('Obteniendo datos del usuario...');
                const token = res?.refreshToken?.token;
                await AsyncStorage.setItem('userToken', token);
                dispatch({ type: 'SIGN_IN', token: token });
                
                const userResult = await reduxDispatch(
                  userApi.endpoints.getUserByEmail.initiate(username)
                ).unwrap();
                if (userResult) {
                  try {
                    console.log('User Result:', userResult);
                    reduxDispatch(setUserData(userResult));
                    
                    showLoading('Verificando dirección...');
                    
                    // Usar endpoints.getAddressByUserId.initiate correctamente
                    const result = await reduxDispatch(
                      addressApi.endpoints.getAddressByUserId.initiate(userResult.id)
                    );
                    
                    console.log('API Response:', result);

                    if (result.data && result.data.length > 0) {
                      console.log('Setting address:', result.data[0]);
                      reduxDispatch(setCurrentAddress(result.data[0]));
                      await AsyncStorage.setItem('userAddress', JSON.stringify(result.data[0]));
                      hideLoading();
                    } else {
                      console.log('No addresses found');
                      reduxDispatch(setCurrentAddress(null));
                      await AsyncStorage.removeItem('userAddress');
                      hideLoading();
                    }
                  } catch (error) {
                    console.error('Error fetching address:', error);
                  }
                  
                  hideLoading();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'App' }],
                  });
                }
                setErrorMessage(null);
              } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage('Error al obtener los datos del usuario.');
                hideLoading();
              }
            },
            onFailure: err => {
              console.error('Error de inicio de sesión:', err);
              setErrorMessage('Usuario o contraseña incorrectos.');
              hideLoading();
            },
          });
        } catch (error) {
          console.error('Error de inicio de sesión:', error);
          setErrorMessage('Ocurrió un error inesperado.');
          hideLoading();
        }
      },
      signOut: async () => {
        try {
          showLoading('Cerrando sesión...');
          // Limpiar AsyncStorage
          await AsyncStorage.multiRemove([
            'userToken',
            'userAddress',
            'userData'
          ]);

          // Limpiar estados de Redux
          reduxDispatch(clearAddress());
          reduxDispatch(clearUserData());

          // Limpiar estado de autenticación
          dispatch({ type: 'SIGN_OUT' });
          
          hideLoading();
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
          hideLoading();
        }
      },
      errorMessage,
      forgotPassword: async (username) => {
        try {
          showLoading('Enviando código...');
          const user = new CognitoUser({
            Username: username,
            Pool: cognitoPool,
          });

          return new Promise((resolve, reject) => {
            user.forgotPassword({
              onSuccess: () => {
                hideLoading();
                setErrorMessage(null);
                resolve();
              },
              onFailure: (err) => {
                console.error('Error al enviar código:', err);
                setErrorMessage('Error al enviar el código de verificación.');
                hideLoading();
                reject(err);
              },
            });
          });
        } catch (error) {
          console.error('Error en recuperación de contraseña:', error);
          setErrorMessage('Ocurrió un error inesperado.');
          hideLoading();
          throw error;
        }
      },

      confirmPassword: async (username, code, newPassword) => {
        try {
          showLoading('Actualizando contraseña...');
          const user = new CognitoUser({
            Username: username,
            Pool: cognitoPool,
          });

          return new Promise((resolve, reject) => {
            user.confirmPassword(code, newPassword, {
              onSuccess: () => {
                hideLoading();
                setErrorMessage(null);
                resolve();
              },
              onFailure: (err) => {
                console.error('Error al confirmar contraseña:', err);
                setErrorMessage('Error al actualizar la contraseña.');
                hideLoading();
                reject(err);
              },
            });
          });
        } catch (error) {
          console.error('Error en confirmación de contraseña:', error);
          setErrorMessage('Ocurrió un error inesperado.');
          hideLoading();
          throw error;
        }
      },
    }),
    [errorMessage, showLoading, hideLoading, navigation, reduxDispatch]
  );

  return (
    <AuthContext.Provider value={{ state, dispatch, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}



export async function updateCognitoUserId (userSub, userId) {
  const cognito = new CognitoIdentityServiceProvider();
  const params = {
    UserAttributes: [
      {
        Name: 'custom:userId', // Asegúrate de que este atributo esté configurado en Cognito
        Value: userId,
      },
    ],
    UserPoolId: process.env.EXPO_PUBLIC_USER_POOL, // Reemplaza con tu User Pool ID
    Username: userSub,
  };

  await cognito.adminUpdateUserAttributes(params).promise();
};