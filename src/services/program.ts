import { ProgramResponse } from '@app/types/rest';
import { makeRequest } from './makeRequest';

const prefix = 'program';

export function getProgramList(pelajarId: string) {
  return makeRequest<ProgramResponse[]>(`${prefix}/${pelajarId}`, {
    method: 'GET',
  });
}
