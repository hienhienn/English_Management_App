export interface FinancialManagement {
  id: string;
  code: string;
  type: string;
  paymentType: string;
  studentId: string;
  description: string;
  isPaid: boolean;
  userId: string;
  isValidate: boolean;
  amountOfMoney: number;
  createAt?: string;
  updateAt?: string;
}

export interface CreateFinancialManagement {
  type: string;
  paymentType: string;
  studentId: string;
  description?: string;
  isPaid: boolean;
  userId: string;
  amountOfMoney: number;
}
export interface UpdateFinancialManagement {
  type?: string;
  paymentType?: string;
  studentId?: string;
  description?: string;
  isPaid?: boolean;
  userId?: string;
  isValidate?: boolean;
  amountOfMoney?: number;
}
