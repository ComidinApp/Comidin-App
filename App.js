import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navigation from './navigation/navigation';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoadingOverlay from './components/loadingView';
import { registerRootComponent } from 'expo';

function App() {
  return (
    <Provider store={store}>
      <LoadingProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthProvider>
            <Navigation />
          </AuthProvider>
        </GestureHandlerRootView>
        <LoadingOverlay />
      </LoadingProvider>
    </Provider>
  );
}

registerRootComponent(App);

export default App; 