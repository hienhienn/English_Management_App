export interface ResetPasswordDTO {
  token: string;
  /**
   * @minLength 8
   * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$
   */
  newPassword: string;
}
