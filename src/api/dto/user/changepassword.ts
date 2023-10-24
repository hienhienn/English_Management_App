export interface ChangePassword {
  /**
   * @minLength 8
   * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$
   */
  newPassword: string;
}
