// src/navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeScreen } from '../screens/HomeScreen';
import UserProfileScreen from '../screens/profile/UserProfileScreen';
import CustomDrawerContent from './customDrawerContent';
import OrdersScreen from '../screens/orders/OrdersScreen';
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="HomeScreen"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{
          title: 'Inicio'
        }}
      />
      <Drawer.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{
          title: 'Perfil'
        }}
      />
      <Drawer.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          title: 'Pedidos'
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;