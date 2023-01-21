export interface PelajarResponse {
  id: number;
  username: string;
  name: string;
}

export interface AbsentResponse {
  id: number;
  pengajarId: number;
  programId: number;
  date: Date;
  present: boolean;
  reason: string | null;
}

export interface ProgramResponse {
  id: number;
  name: string;
  status: 'alpha' | 'present' | 'absent';
  reason: string | null;
}
