export interface TimeOption {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface CreateTimeOption {
  title: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface UpdateTimeOption {
  title?: string;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}
