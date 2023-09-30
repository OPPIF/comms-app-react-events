import { CommsProvider, ThemeProvider, LogProvider, NotificationCenter, LogLevel } from '@dolbyio/comms-uikit-react';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import styles from './App.module.scss';
import PhoneLandscapeCurtain from './components/PhoneLandscapeCurtain';
import TranslationProvider from './components/TranslationProvider';
import { SideDrawerProvider } from './context/SideDrawerContext';
import useToken from './hooks/useToken';
import { Navigator } from './routes/Navigator';
import { env } from './utils/env';

const App = () => {
    const theme = {
    colors: {
      purple: {
        25: '#F1B635',
        50: '#F1B635',
        100: '#F1B635',
        200: '#F1B635',
        300: '#F1B635',
        400: '#F1B635',
        500: '#F1B635',
        600: '#F1B635',
        700: '#F1B635',
        800: '#F1B635',
        900: '#F1B635',
      },
    }
  };
  
  const { YOUR_TOKEN, getToken, error } = useToken();
  // Register the component name so that we can estimate the app's usage
  useEffect(() => {
    VoxeetSDK.registerComponentVersion(env('VITE_APP_NAME'), env('VITE_APP_VERSION'));
  }, []);

  if (error) {
    return (
      <ThemeProvider>
        <div className={styles.fallbackContainer}>Error : {error}</div>;
      </ThemeProvider>
    );
  }

  if (!YOUR_TOKEN) {
    return null;
  }

  return (
    <LogProvider minLogLevel={LogLevel.warn}>
      <TranslationProvider>
        <CommsProvider
          token={YOUR_TOKEN}
          refreshToken={getToken}
          packageUrlPrefix={`${window.location.origin}${import.meta.env.BASE_URL}assets/wasm/`}
        >
          <ThemeProvider theme={theme}>
            <SideDrawerProvider>
              <div className={styles.app}>
                <Navigator />
              </div>
              {/* Because of the problem with resize / orientation change events , we need to lock android chrome landscape mode* /}
              {/* for mobile devices */}
              <PhoneLandscapeCurtain />
              <NotificationCenter position="top-center" />
            </SideDrawerProvider>
          </ThemeProvider>
        </CommsProvider>
      </TranslationProvider>
    </LogProvider>
  );
};

const container = document.getElementById('root');
// no-non-null-assertion comes from official react docs
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
