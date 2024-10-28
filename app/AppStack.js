// src/navigation/AppStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Importar screens
import HomeScreen from '../screens/HomeScreen.js';
import RestaurantScreen from '../screens/RestaurantScreen.js';
import CartScreen from '../screens/CartScreen.js';
import CommercesCategory from '../screens/CommercesCategory.js';
import MapScreen from '../screens/MapScreen.js';
import CustomDrawerContent from '../components/customDrawerContent.js';
import AdressScreen from '../screens/AdressScreen.js';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Separamos las pantallas de ubicación en su propio stack
function LocationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="AdressScreen" component={AdressScreen} />
    </Stack.Navigator>
  );
}

// Este stack contendrá las pantallas que sí mostrarán el drawer
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Restaurant" component={RestaurantScreen} />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{presentation: 'modal'}} 
      />
      <Stack.Screen name="CommercesCategory" component={CommercesCategory} />
    </Stack.Navigator>
  );
}

// Modificamos el AppStack para incluir ambos stacks
export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Location" component={LocationStack} />
      <Stack.Screen name="DrawerScreens" component={DrawerScreens} />
    </Stack.Navigator>
  );
}

// Nuevo componente para las pantallas con drawer
function DrawerScreens() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#D67030',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          width: '75%',
        },
        gestureEnabled: true,
        gestureHandlerConfig: {
          minPointers: 1,
          minDistance: 20,
          hitSlop: {
            right: 50,
            left: 0,
            top: 0,
            bottom: 0,
          }
        },
        swipeEdgeWidth: 50,
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen 
        name="Main" 
        component={MainStack}
        options={{
          title: '¿Qué vas a comer hoy?',
        }} 
      />
    </Drawer.Navigator>
  );
}
