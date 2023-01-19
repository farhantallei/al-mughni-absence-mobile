import { PelajarResponse } from '@app/types/rest';
import { makeRequest } from './makeRequest';

const prefix = 'pengajar';

export function getPengajar(program: string) {
  return makeRequest<PelajarResponse[]>(`${prefix}?program=${program}`, {
    method: 'GET',
  });
}
