export interface PelajarResponse {
  id: string;
  username: string;
  name: string;
}

export interface AbsentResponse {
  id: string;
  pengajarId: string | null;
  programId: string;
  date: Date;
  present: boolean;
  reason: string | null;
}

export interface ProgramResponse {
  id: string;
  pengajarId: string | null;
  pengajarName: string;
  name: string;
  individual: boolean;
  pengajar: boolean;
  presentStatus: 'alpha' | 'present' | 'absent';
  programStatus: 'available' | 'unavailable' | 'alibi';
  reason: string | null;
}

export interface ScheduleResponse {
  id: string;
  programId: string;
  date: Date;
  available: boolean;
  reason: string | null;
}

export interface PelajarOnPengajarResponse {
  pengajarId: string;
  pelajarId: string;
  programId: string;
  pengajarName: string;
  programStatus: 'available' | 'unavailable' | 'alibi';
  reason: string | null;
}
