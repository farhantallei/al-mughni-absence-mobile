import { PelajarResponse } from '@app/types/rest';
import { makeRequest } from './makeRequest';

const prefix = 'pelajar';

export function validation(username: string) {
  return makeRequest<PelajarResponse>(`${prefix}/${username}`, {
    method: 'GET',
  });
}

export function register(data: { username: string; name: string }) {
  return makeRequest<PelajarResponse>(`${prefix}/register`, {
    method: 'POST',
    data,
  });
}

export function login(data: { username: string }) {
  return makeRequest<PelajarResponse>(`${prefix}/login`, {
    method: 'POST',
    data,
  });
}
