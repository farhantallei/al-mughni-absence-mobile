import { ReactQueryProvider } from '@app/libs/react-query';
import Navigation from '@app/navigation';
import { SplashScreen } from '@app/screens';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <ReactQueryProvider>
      <SplashScreen>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
      </SplashScreen>
    </ReactQueryProvider>
  );
}

export default App;
