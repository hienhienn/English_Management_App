export interface Student {
  create: Student.create;
  update: Student.update;
}

export interface Parents {
  fullName: string;
  phoneNumber: string;
  relation: string;
  /**
   * @type email
   */
  email: string;
}

export namespace Student {
  export interface create {
    fullname: string;

    type?: string;

    program?: string;

    learningState?: string;

    classCategory?: string;

    paymentState?: string;

    learningType?: string;

    studyGoal?: string;

    /**
     * @minLength 10
     * @maxLength 12
     * @pattern (84|0[3|5|7|8|9])+([0-9]{8})\b
     */
    phoneNumber: string;

    note?: string;

    state?: string;

    result?: string;

    /**
     * @format date-time
     */
    reCallTime?: string;

    classId?: string;

    parents?: Parents[];
  }
  export interface update {
    fullname?: string;

    type?: string;

    program?: string;

    learningState?: string;

    classCategory?: string;

    paymentState?: string;

    learningType?: string;

    studyGoal?: string;

    courseId?: string;

    /**
     * @minLength 10
     * @maxLength 10
     * @pattern (84|0[3|5|7|8|9])+([0-9]{8})\b
     */
    phoneNumber?: string;

    note?: string;

    state?: string;

    result?: string;

    /**
     * @format date-time
     */
    reCallTime?: string;

    classId?: string;

    parents?: Parents[];
  }
}
