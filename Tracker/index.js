/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { ToastProvider } from 'react-native-toast-notifications'

const MainApp = () => {
    return (
        <ToastProvider>
            <App />
        </ToastProvider>
    )
}

AppRegistry.registerComponent(appName, () => MainApp);
