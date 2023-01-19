import { AbsentResponse } from '@app/types/rest';
import { makeRequest } from './makeRequest';

const prefix = 'absent';

export function getAbsent({
  pelajarId,
  programId,
  date,
}: {
  pelajarId: number;
  programId: number;
  date: string;
}) {
  return makeRequest<AbsentResponse | null>(
    `${prefix}?pelajarId=${pelajarId}&programId=${programId}&date=${date}`,
    {
      method: 'GET',
    },
  );
}

export function addAbsent(data: {
  pelajarId: number;
  pengajarId: number;
  programId: number;
  date: string;
  present: boolean;
  reason?: string;
}) {
  return makeRequest<AbsentResponse>(`${prefix}`, { method: 'POST', data });
}

export function updateAbsent(data: {
  pelajarId: number;
  pengajarId: number;
  programId: number;
  date: string;
  present: boolean;
  reason?: string;
}) {
  return makeRequest<AbsentResponse>(`${prefix}`, { method: 'PATCH', data });
}
