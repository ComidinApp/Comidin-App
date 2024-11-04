import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import LocationStack from './LocationStack';
import { useGetUserDataQuery } from '../redux/apis/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function Navigation() {
  const { data: userData } = useGetUserDataQuery();

  const { state, dispatch } = useAuth();

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Error al restaurar el token
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.userToken == null ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            {console.log(userData)}
            <Stack.Screen name="Location" component={LocationStack} />
            <Stack.Screen name="App" component={AppStack} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;