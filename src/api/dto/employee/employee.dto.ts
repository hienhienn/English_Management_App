export interface Employee {
  id?: string;
  role: string;
  officeId: string;
  fullname: string;
  department: string;
  classCategory?: string;
  /**
   * @minLength 10
   * @maxLength 11
   * @pattern (84|0[3|5|7|8|9])+([0-9]{8})\b
   */
  phoneNumber?: string;
  note?: string;
  state?: string;
  createAt?: string;
  updateAt?: string;
}

export interface CreateEmployee {
  role: string;
  officeId: string;
  fullname: string;
  department: string;
  classCategory?: string;
  /**
   * @minLength 10
   * @maxLength 11
   * @pattern (84|0[3|5|7|8|9])+([0-9]{8})\b
   */
  phoneNumber?: string;
  note?: string;
  state?: string;
  createAt?: string;
  updateAt?: string;
}

export interface UpdateEmployee {
  role?: string;
  officeId?: string;
  fullname?: string;
  department?: string;
  classCategory?: string;
  /**
   * @minLength 10
   * @maxLength 11
   * @pattern (84|0[3|5|7|8|9])+([0-9]{8})\b
   */
  phoneNumber?: string;
  note?: string;
  state?: string;
  createAt?: string;
  updateAt?: string;
}
