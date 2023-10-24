export interface DayOption {
  id: string;
  title: string;
  days: number[];
  isActive: boolean;
}

export interface CreateDayOption {
  title: string;
  days: number[];
  isActive: boolean;
}

export interface UpdateDayOption {
  title?: string;
  days?: number[];
  isActive?: boolean;
}
