import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useGlobalState<S>(key: string[], initialState?: S | (() => S)) {
  const client = useQueryClient();
  return [
    useQuery(key, () => initialState, {
      enabled: false,
      initialData: initialState,
    }).data,
    (value: S) => client.setQueryData(key, value),
  ] as [S, (value: S) => S];
}
