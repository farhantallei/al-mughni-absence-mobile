import { ScheduleResponse } from '@app/types/rest';
import { makeRequest } from './makeRequest';

const prefix = 'schedule';

export function getSchedule({
  pengajarId,
  programId,
  date,
}: {
  pengajarId: number;
  programId: number;
  date: string;
}) {
  return makeRequest<ScheduleResponse | null>(
    `${prefix}?pengajarId=${pengajarId}&programId=${programId}&date=${date}`,
    {
      method: 'GET',
    },
  );
}

export function addSchedule(data: {
  pengajarId: number;
  programId: number;
  date: string;
  available: boolean;
  reason?: string;
}) {
  return makeRequest<ScheduleResponse>(`${prefix}`, { method: 'POST', data });
}

export function updateSchedule(data: {
  pengajarId: number;
  programId: number;
  date: string;
  available: boolean;
  reason?: string;
}) {
  return makeRequest<ScheduleResponse>(`${prefix}`, { method: 'PATCH', data });
}
