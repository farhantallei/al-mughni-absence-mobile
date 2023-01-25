import { ScheduleResponse } from '@app/types/rest';
import { makeRequest } from './makeRequest';

const prefix = 'schedule';

export function getSchedule({
  pengajarId,
  programId,
  date,
}: {
  pengajarId: string;
  programId: string;
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
  pengajarId: string;
  programId: string;
  date: string;
  available: boolean;
  reason?: string;
}) {
  return makeRequest<ScheduleResponse>(`${prefix}`, { method: 'POST', data });
}

export function updateSchedule(data: {
  pengajarId: string;
  programId: string;
  date: string;
  available: boolean;
  reason?: string;
}) {
  return makeRequest<ScheduleResponse>(`${prefix}`, { method: 'PATCH', data });
}

export function deleteSchedule(data: {
  pengajarId: string;
  programId: string;
  date: string;
}) {
  return makeRequest<ScheduleResponse>(`${prefix}`, { method: 'DELETE', data });
}
