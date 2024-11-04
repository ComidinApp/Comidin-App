// src/navigation/AppStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/MapScreen';
import AdressScreen from '../screens/AdressScreen';


const Stack = createNativeStackNavigator();

function LocationStack() {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Address" component={AdressScreen} />
    </Stack.Navigator>
  );
}

export default LocationStack;
