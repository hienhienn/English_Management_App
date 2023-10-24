export interface LoginTest {
  create: LoginTest.login;
  update: LoginTest.update;
}

export namespace LoginTest {
  export interface login {
    /**
     * @minLength 1
     * @type email
     */
    email: string;

    /**
     * @minLength 8
     * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$
     */
    password: string;
  }
  export interface update {
    /**
     * @minLength 1
     * @type email
     */
    email: string;

    /**
     * @minLength 8
     * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$
     */
    password: string;
  }
}
