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
  name: string;
  individual: boolean;
  pengajar: boolean;
  status: 'alpha' | 'present' | 'absent';
  reason: string | null;
}
