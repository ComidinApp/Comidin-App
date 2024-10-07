import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useLoading } from '../context/LoadingContext.js';

const LoadingOverlay = () => {
  const { isLoading, loadingText } = useLoading();

  if (!isLoading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.text}>{loadingText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoadingOverlay;