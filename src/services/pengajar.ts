import { PelajarOnPengajarResponse, PelajarResponse } from '@app/types/rest';
import { makeRequest } from './makeRequest';

const prefix = 'pengajar';

export function getPengajar(programId: string) {
  return makeRequest<PelajarResponse[]>(`${prefix}/${programId}`, {
    method: 'GET',
  });
}

export function registerPelajar(data: {
  pelajarId: string;
  pengajarId: string;
  programId: string;
}) {
  return makeRequest<PelajarOnPengajarResponse>(`${prefix}`, {
    method: 'POST',
    data,
  });
}
