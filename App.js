import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { LoadingProvider } from './context/LoadingContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import Navigation from './navigation/navigation';
import * as Linking from 'expo-linking';

const linking = {
  prefixes: ['exp://192.168.1.16:8081', 'comidin://'],
  config: {
    screens: {
      App: {
        screens: {
          DrawerScreens: {
            screens: {
              Main: {
                screens: {
                  Payment: 'payment',
                  OrderSuccess: 'order-success',
                  success: 'success',
                  failure: 'failure',
                  pending: 'pending'
                }
              }
            }
          }
        }
      }
    }
  }
};

export default function App() {
  return (
    <Provider store={store}>
      <LoadingProvider>
        <NotificationProvider>
          <NavigationContainer linking={linking}>
            <AuthProvider>
              <Navigation />
            </AuthProvider>
          </NavigationContainer>
        </NotificationProvider>
      </LoadingProvider>
    </Provider>
  );
} 