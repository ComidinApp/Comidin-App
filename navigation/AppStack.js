// src/navigation/AppStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import LocationStack from './LocationStack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/customDrawerContent';
import HomeScreen from '../screens/HomeScreen';
import RestaurantScreen from '../screens/RestaurantScreen';
import CartScreen from '../screens/CartScreen';
import CommercesCategory from '../screens/CommercesCategoryScreen';
import PaymentScreen from '../screens/PaymentScreen';
import DirectionsScreen from '../screens/DirectionsScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

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
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen 
        name="Directions" 
        component={DirectionsScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

function DrawerScreens() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
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

export default function AppStack() {
  const currentAddress = useSelector((state) => state.address?.currentAddress);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!currentAddress ? (
        <Stack.Screen 
          name="Location" 
          component={LocationStack}
          options={{ gestureEnabled: false }}
        />
      ) : (
        <Stack.Screen 
          name="DrawerScreens" 
          component={DrawerScreens}
        />
      )}
    </Stack.Navigator>
  );
}