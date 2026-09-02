export type Role = 'MEMBER' | 'TRAINER';

export interface Member {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export interface FitnessClass {
  id: number;
  title: string;
  trainerName: string;
  classDateTime: string;
  capacity: number;
  currentCount: number;
}

export type ReservationStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';

export interface Reservation {
  id: number;
  classId: number;
  classTitle: string;
  status: ReservationStatus;
  reservedAt: string;
}

export interface SessionTicket {
  totalCount: number;
  remainingCount: number;
}

export interface LoginResponse {
  token: string;
  memberId: number;
  name: string;
  role: Role;
}
