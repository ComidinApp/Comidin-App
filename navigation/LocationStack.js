// src/navigation/AppStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/MapScreen';
import AddressScreen from '../screens/AddressScreen';


const Stack = createNativeStackNavigator();

function LocationStack() {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="Map" 
          component={MapScreen}
          options={{
            gestureEnabled: false,
          }} 
        />
        <Stack.Screen 
          name="Address" 
          component={AddressScreen}
          options={{
            gestureEnabled: false,
          }} 
        />
    </Stack.Navigator>
  );
}

export default LocationStack;
