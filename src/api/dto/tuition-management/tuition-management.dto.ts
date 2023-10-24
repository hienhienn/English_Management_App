import { PaymentRecord } from './paymentRecord.dto';

export interface TuitionManagement {
  id: string;
  studentId: string;
  creatorId: string;
  classId: string;
  totalTuition: number;
  paymentType: string; // all or monthly
  promotionalCodeId?: string;
  paidMoney: number;
  debtMoney: number;
  paymentRecords: PaymentRecord[];
}

export interface CreateTuitionManagement {
  studentId: string;
  creatorId: string;
  classId: string;
  totalTuition: number;
  paymentType: string; // all or monthly
  promotionalCodeId?: string;
  paidMoney: number;
  debtMoney: number;
  paymentRecords: PaymentRecord[];
}

export interface UpdateTuitionManagement {
  studentId?: string;
  creatorId?: string;
  classId?: string;
  totalTuition?: number;
  paymentType?: string; // all or monthly
  promotionalCodeId?: string;
  paidMoney?: number;
  debtMoney?: number;
  paymentRecords?: PaymentRecord[];
}
