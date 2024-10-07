import Navigation from "./navigation";
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '../redux/store'
import { LoadingProvider } from '../context/LoadingContext.js';
import LoadingOverlay from '../components/loadingView.js';

export default function RootLayout() {

  return (
    <ReduxProvider store={store}>
      <LoadingProvider>
        <Navigation />
        <LoadingOverlay />
      </LoadingProvider>
    </ReduxProvider>
  );

}
