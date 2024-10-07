import Navigation from "./navigation";
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '../redux/store'
import {
  useFonts,
  Baloo2_400Regular,
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import {LoadingProvider} from './../hooks/loading';

export default function RootLayout() {

  let [fontsLoaded] = useFonts({
    Baloo2_400Regular,
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
  });

  if (!fontsLoaded) {
      return null;
  } else {
      return (
        <ReduxProvider store={store}>
          <LoadingProvider>
            <Navigation />
          </LoadingProvider>
        </ReduxProvider>
      );
    
  }

}
