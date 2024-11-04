import { Stack } from 'expo-router';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../redux/store';
import { AuthProvider } from '../context/AuthContext';
import { LoadingProvider } from '../context/LoadingContext';
import LoadingOverlay from '../components/loadingView';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <LoadingProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </AuthProvider>
        </GestureHandlerRootView>
        <LoadingOverlay />
      </LoadingProvider>
    </ReduxProvider>
  );
}
