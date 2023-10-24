export interface QueryDashboard {
  /**
   * @format date-time
   */
  startDate: string;

  /**
   * @format date-time
   */
  endDate: string;

  type: string; // ['DATE','MONTH']
}
