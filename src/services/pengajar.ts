import { PelajarOnPengajarResponse, PelajarResponse } from '@app/types/rest';
import { makeRequest } from './makeRequest';

const prefix = 'pengajar';

export function getPengajar(programId: number) {
  return makeRequest<PelajarResponse[]>(`${prefix}/${programId}`, {
    method: 'GET',
  });
}

export function registerPelajar(data: {
  pelajarId: number;
  pengajarId: number;
  programId: number;
}) {
  return makeRequest<PelajarOnPengajarResponse>(`${prefix}`, {
    method: 'POST',
    data,
  });
}
