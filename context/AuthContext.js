import React, { createContext, useContext, useReducer, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { cognitoPool } from '../utils/cognito-pool.js';
import { authReducer, initialState } from '../utils/authReducer.js';
import { useLoading } from './LoadingContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { showLoading, hideLoading } = useLoading();

  const authContext = useMemo(
    () => ({
      signIn: async (username, password) => {
        try {
          showLoading('Cargando...');
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
              const token = res?.refreshToken?.token;
              await AsyncStorage.setItem('userToken', token);
              dispatch({ type: 'SIGN_IN', token: token });
              hideLoading();
            },
            onFailure: err => {
              console.log('Error de inicio de sesión:', err);
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
    <AuthContext.Provider value={{ state, dispatch, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}