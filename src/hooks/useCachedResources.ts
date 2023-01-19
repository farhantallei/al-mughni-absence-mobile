import { validation } from '@app/services/pelajar';
import { getProgramList } from '@app/services/program';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { useGlobalState } from './useGlobalState';

export function useCachedResources() {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useGlobalState(['userId']);
  const [username, setUsername] = useGlobalState(['username']);
  const [name, setName] = useGlobalState(['name']);
  const queryClient = useQueryClient();

  useQuery(
    ['auth'],
    async () => {
      const username = await AsyncStorage.getItem('username');
      if (username == null) throw 'not authenticated';
      return await validation(username);
    },
    {
      onError: async err => {
        await AsyncStorage.multiRemove(['username', 'name']);
        console.warn(err);
        SplashScreen.hide();
        setIsLoading(false);
      },
      onSuccess: async data => {
        // loading nya sudah selesai disini
        await queryClient.prefetchQuery({
          queryKey: ['program'],
          queryFn: () => getProgramList(data.id),
          retry: 1,
        });

        setUserId(data.id);
        setUsername(data.username);
        setName(data.name);
        SplashScreen.hide();
        setIsLoading(false);
      },
      retry: 1,
    },
  );

  return isLoading;
}
