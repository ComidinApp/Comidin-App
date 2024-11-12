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
  prefixes: ['comidin://', 'exp://'],
  config: {
    screens: {
      App: {
        screens: {
          DrawerScreens: {
            screens: {
              Main: {
                screens: {
                  Payment: {
                    path: 'payment/:status',
                    parse: {
                      status: (status) => status,
                    },
                  },
                  OrderSuccess: 'order-success',
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