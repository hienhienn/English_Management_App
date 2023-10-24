export interface VATManagement {
  id: string;
  officeId: string;
  type: string;
  name: string;
  address: string;
  exportType: string;
  /**
   * @minLength 10
   * @maxLength 12
   * @pattern (84|0[3|5|7|8|9])+([0-9]{8})\b
   */
  phoneNumber: string;
  description: string;
  note: string;
  money: number;
  isValidated: boolean;
  isRelease: boolean;
  financialManagementId: string;
  userId: string;
}

export interface CreateVATManagement {
  officeId: string;
  type: string;
  name: string;
  address?: string;
  exportType: string;
  /**
   * @minLength 10
   * @maxLength 12
   * @pattern (84|0[3|5|7|8|9])+([0-9]{8})\b
   */
  phoneNumber?: string;
  description?: string;
  note?: string;
  money: number;
  isValidated: boolean;
  isRelease: boolean;
  financialManagementId?: string;
  userId: string;
}

export interface UpdateVATManagement {
  officeId?: string;
  type?: string;
  name?: string;
  address?: string;
  exportType?: string;
  /**
   * @minLength 10
   * @maxLength 12
   * @pattern (84|0[3|5|7|8|9])+([0-9]{8})\b
   */
  phoneNumber?: string;
  description?: string;
  note?: string;
  money?: number;
  isValidated?: boolean;
  isRelease?: boolean;
  financialManagementId?: string;
  userId?: string;
}
