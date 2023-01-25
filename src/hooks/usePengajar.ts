import { getPengajar } from '@app/services/pengajar';
import { useQuery } from '@tanstack/react-query';

export function usePengajar(programId: string) {
  return useQuery({
    queryKey: ['pengajar', { id: programId }],
    queryFn: () => getPengajar(programId),
  });
}
