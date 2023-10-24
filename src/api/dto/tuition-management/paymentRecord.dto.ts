export interface PaymentRecord {
  /**
   * @type date-time
   */
  paymentDate: string;

  paidMoney: number;

  isPaid: boolean;
}
