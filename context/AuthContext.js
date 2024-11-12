import React, { createContext, useContext, useReducer, useMemo, useState, useEffect } from 'react';
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para cargar los datos del usuario desde el almacenamiento
  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const savedUserData = await AsyncStorage.getItem('@user_data');
      
      if (!token) {
        setLoading(false);
        return;
      }

      dispatch({ type: 'SIGN_IN', token });
      
      if (savedUserData) {
        // Primero establecemos los datos guardados para tener algo que mostrar inmediatamente
        const parsedUserData = JSON.parse(savedUserData);
        reduxDispatch(setUserData(parsedUserData));
      }

      // Luego actualizamos desde la API
      if (savedUserData) {
        const parsedUserData = JSON.parse(savedUserData);
        showLoading('Actualizando datos...');
        
        try {
          // Recargar datos del usuario
          const userResult = await reduxDispatch(
            userApi.endpoints.getUserByEmail.initiate(parsedUserData.email)
          ).unwrap();

          if (userResult) {
            reduxDispatch(setUserData(userResult));
            await AsyncStorage.setItem('@user_data', JSON.stringify(userResult));

            // Recargar dirección
            const addressResponse = await reduxDispatch(
              addressApi.endpoints.getAddressByUserId.initiate(userResult.id, {
                forceRefetch: true
              })
            ).unwrap();

            if (addressResponse && Array.isArray(addressResponse) && addressResponse.length > 0) {
              reduxDispatch(setCurrentAddress(addressResponse[0]));
              await AsyncStorage.setItem('userAddress', JSON.stringify(addressResponse[0]));
            }
          }
        } catch (error) {
          console.error('Error loading address:', error);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  // Función para guardar los datos del usuario
  const saveUserData = async (userData) => {
    try {
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      await saveUserData(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@user_data');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Cargar datos del usuario al iniciar la app
  useEffect(() => {
    loadUserData();
  }, []);

  // Función para limpiar todos los datos
  const clearAllData = async () => {
    try {
      console.log('Clearing all data...');
      
      // Limpiar AsyncStorage
      await AsyncStorage.multiRemove([
        'userToken',
        'userAddress',
        'userData',
        '@user_data'
      ]);

      // Limpiar Redux y caché
      reduxDispatch(clearUserData());
      reduxDispatch(clearAddress());
      reduxDispatch(addressApi.util.resetApiState());
      
      // Verificar limpieza
      const remainingAddress = await AsyncStorage.getItem('userAddress');
      console.log('Remaining address after clear:', remainingAddress);
      
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const authContext = useMemo(
    () => ({
      signIn: async (username, password) => {
        try {
          // Asegurarse de que los datos se limpien antes de iniciar sesión
          await clearAllData();
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
            onSuccess: async (session) => {
              try {
                console.log('Login successful, getting user data...');
                showLoading('Obteniendo datos del usuario...');

                const accessToken = session.getAccessToken().getJwtToken();
                await AsyncStorage.setItem('userToken', accessToken);
                dispatch({ type: 'SIGN_IN', token: accessToken });

                const userResult = await reduxDispatch(
                  userApi.endpoints.getUserByEmail.initiate(username)
                ).unwrap();

                if (userResult) {
                  console.log('User data received:', userResult);
                  reduxDispatch(setUserData(userResult));
                  
                  showLoading('Verificando dirección...');
                  
                  try {
                    // Limpiar caché antes de hacer la petición
                    reduxDispatch(addressApi.util.resetApiState());
                    
                    // Hacer la petición con skip de caché
                    const addressResponse = await reduxDispatch(
                      addressApi.endpoints.getAddressByUserId.initiate(userResult.id, {
                        forceRefetch: true,
                        subscribe: false
                      })
                    ).unwrap();
                    
                    console.log('Fresh Address API Response:', addressResponse);

                    if (addressResponse && 
                        Array.isArray(addressResponse) && 
                        addressResponse.length > 0 && 
                        addressResponse[0].id) {
                      
                      console.log('Valid address found:', addressResponse[0]);
                      reduxDispatch(setCurrentAddress(addressResponse[0]));
                      await AsyncStorage.setItem('userAddress', JSON.stringify(addressResponse[0]));
                    } else {
                      console.log('No valid address found, ensuring address is cleared');
                      reduxDispatch(clearAddress());
                      await AsyncStorage.removeItem('userAddress');
                      reduxDispatch(addressApi.util.resetApiState());
                    }
                    hideLoading();
                    
                  } catch (error) {
                    console.error('Error fetching address:', error);
                    reduxDispatch(clearAddress());
                    await AsyncStorage.removeItem('userAddress');
                    reduxDispatch(addressApi.util.resetApiState());
                    hideLoading();
                    setErrorMessage('Error al obtener la dirección del usuario.');
                  }
                }
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
          await clearAllData();
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