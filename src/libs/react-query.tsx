import {
  QueryClient,
  QueryClientProvider as Provider,
} from '@tanstack/react-query';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return <Provider client={queryClient}>{children}</Provider>;
}
