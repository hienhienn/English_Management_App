export interface User {
  id?: string;

  /**
   * @minLength 1
   * @format email
   */
  email: string;

  /**
   * @minLength 1
   */
  username: string;

  /**
   * @minLength 8
   * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$
   */
  password: string;

  role: string;

  isActive: boolean;

  /**
   * @format date-time
   */
  createAt?: string;

  /**
   * @format date-time
   */
  updateAt?: string;
}

export interface CreateUser {
  /**
   * @minLength 1
   * @format email
   */
  email: string;

  /**
   * @minLength 1
   */
  username: string;

  /**
   * @minLength 8
   * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$
   */
  password: string;

  role: string;

  isActive: boolean;
}

export interface UpdateUser {
  /**
   * @minLength 1
   * @format email
   */
  email?: string;

  /**
   * @minLength 1
   */
  username?: string;

  /**
   * @minLength 8
   * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$
   */
  password?: string;

  role?: string;

  isActive?: boolean;
}
