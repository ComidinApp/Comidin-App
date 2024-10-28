import Navigation from "./navigation";
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '../redux/store'
import { LoadingProvider } from '../context/LoadingContext.js';
import LoadingOverlay from '../components/loadingView.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {

  return (
    <ReduxProvider store={store}>
      <LoadingProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Navigation />
        </GestureHandlerRootView>
        <LoadingOverlay />
      </LoadingProvider>
    </ReduxProvider>
  );

}
