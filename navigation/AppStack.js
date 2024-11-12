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
import UserProfileScreen from '../screens/profile/UserProfileScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import { TouchableOpacity } from 'react-native';
import * as Icon from "react-native-feather";
import SavedAddressesScreen from '../screens/SavedAddressesScreen';

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
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
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
        swipeEnabled: true,
        swipeEdgeWidth: 100,
        gestureEnabled: true,
        overlayColor: 'rgba(0,0,0,0.5)',
        drawerType: 'front',
      }}
      initialRouteName="Main"
      useLegacyImplementation={false}
    >
      <Drawer.Screen 
        name="Main" 
        component={MainStack}
        options={({ navigation }) => ({
          title: '¿Qué vas a comer hoy?',
          headerLeft: () => (
            <TouchableOpacity 
              className="pl-4"
              onPress={() => navigation.openDrawer()}
            >
              <Icon.Menu stroke="white" width={24} height={24} />
            </TouchableOpacity>
          ),
        })} 
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