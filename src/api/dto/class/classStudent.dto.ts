export interface ClassStudent {
  studentId?: string;
  fullname?: string;
  /**
   * @minLength 10
   * @maxLength 10
   * @pattern (84|0[3|5|7|8|9])+([0-9]{8})\b
   */
  phoneNumber?: string;
  payment?: boolean;
  /**
   * @format date-time
   */
  paymentAt?: string | null;
}
