import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { LoadingProvider } from './context/LoadingContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navigation from './navigation/navigation';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <Provider store={store}>
      <LoadingProvider>
        <NotificationProvider>
          <NavigationContainer>
            <AuthProvider>
              <Navigation />
            </AuthProvider>
          </NavigationContainer>
        </NotificationProvider>
      </LoadingProvider>
    </Provider>
  );
} 