import { useCachedResources } from '@app/hooks';

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const loading = useCachedResources();

  if (loading) return null;

  return <>{children}</>;
}
