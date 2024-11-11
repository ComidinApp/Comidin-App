import React, { createContext, useContext, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const showLoading = (message = 'Cargando...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingMessage('');
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {isLoading && (
        <View style={styles.container}>
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#D67030" />
            <Text style={styles.text}>
              {loadingMessage}
            </Text>
          </View>
        </View>
      )}
    </LoadingContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEFAE0',
    zIndex: 1000,
  },
  overlay: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  text: {
    color: '#D67030',
    marginTop: 10,
    fontSize: 16,
  },
});

export function useLoading() {
  return useContext(LoadingContext);
}

