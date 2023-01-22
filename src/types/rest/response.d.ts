export interface PelajarResponse {
  id: number;
  username: string;
  name: string;
}

export interface AbsentResponse {
  id: number;
  pengajarId: number | null;
  programId: number;
  date: Date;
  present: boolean;
  reason: string | null;
}

export interface ProgramResponse {
  id: number;
  pengajarId: number | null;
  name: string;
  individual: boolean;
  pengajar: boolean;
  presentStatus: 'alpha' | 'present' | 'absent';
  programStatus: 'available' | 'unavailable' | 'alibi';
  reason: string | null;
}

export interface ScheduleResponse {
  id: number;
  programId: number;
  date: Date;
  available: boolean;
  reason: string | null;
}

export interface PelajarOnPengajarResponse {
  pengajarId: number;
  pelajarId: number;
  programId: number;
  programStatus: 'available' | 'unavailable' | 'alibi';
  reason: string | null;
}
