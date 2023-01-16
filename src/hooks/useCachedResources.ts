import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import SplashScreen from 'react-native-splash-screen';

export function useCachedResources() {
  return useQuery(
    ['user'],
    async () => {
      const user = await AsyncStorage.getItem('user');
      if (user == null) throw 'no user';
      return user;
    },
    {
      onError(err) {
        console.warn(err);
        SplashScreen.hide();
      },
      onSuccess() {
        SplashScreen.hide();
      },
    },
  ).isLoading;
}
