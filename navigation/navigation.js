import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import LocationStack from './LocationStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setCurrentAddress } from '../redux/slices/addressSlice';

const Stack = createNativeStackNavigator();

function Navigation() {
  const { state, dispatch } = useAuth();
  const reduxDispatch = useDispatch();

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const [userToken, userAddress] = await Promise.all([
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('userAddress'),
        ]);

        if (userAddress) {
          reduxDispatch(setCurrentAddress(JSON.parse(userAddress)));
        }

        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      } catch (e) {
        console.error('Error restoring data:', e);
      }
    };

    bootstrapAsync();
  }, [dispatch, reduxDispatch]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {state.userToken == null ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="App" component={AppStack} />
      )}
    </Stack.Navigator>
  );
}

export default Navigation;