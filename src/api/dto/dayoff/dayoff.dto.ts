export interface Dayoff {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
}

export interface CreateDayoff {
  title: string;
  startDate: string;
  endDate: string;
}

export interface UpdateDayoff {
  title?: string;
  startDate?: string;
  endDate?: string;
}
