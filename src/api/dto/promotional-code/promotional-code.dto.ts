export interface PromotionalCode {
  id: string;
  code: string;
  title: string;
  description: string;
  value: string;
  type: string;
  isActive: boolean;
}

export interface CreatePromotionalCode {
  code: string;
  title: string;
  description: string;
  value: string;
  type: string;
  isActive: boolean;
}

export interface UpdatePromotionalCode {
  code?: string;
  title?: string;
  description?: string;
  value?: string;
  type?: string;
  isActive?: boolean;
}
