import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen.js';
import RestaurantScreen from '../screens/RestaurantScreen.js';
import CartScreen from '../screens/CartScreen.js';
import CommercesCategory from '../screens/CommercesCategory.js';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Restaurant" component={RestaurantScreen} />
      <Stack.Screen name="Cart" options={{presentation: 'modal'}} component={CartScreen} />
      <Stack.Screen name="CommercesCategory" component={CommercesCategory} />
    </Stack.Navigator>
  );
}