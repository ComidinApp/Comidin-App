import Navigation from "./../navigation";
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '../redux/store'

export default function RootLayout() {

  return (
    <ReduxProvider store={store}>
      <Navigation />
    </ReduxProvider>
  );
}
