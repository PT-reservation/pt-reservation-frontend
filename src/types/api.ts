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
  description?: string;
  imageUrl?: string;
}

export type ReservationStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';

export const RESERVATION_STATUS_LABEL: Record<ReservationStatus, string> = {
  CONFIRMED: '확정',
  WAITLISTED: '대기중',
  CANCELLED: '취소됨',
};

export const RESERVATION_STATUS_COLOR: Record<ReservationStatus, string> = {
  CONFIRMED: 'text-brand',
  WAITLISTED: 'text-brand/60',
  CANCELLED: 'text-zinc-500',
};

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
