export interface NormalSelection {
  id: string;
  title: string;
  isActive: boolean;
}

export interface CreateNormalSelection {
  title: string;
  isActive: boolean;
}

export interface UpdateNormalSelection {
  title?: string;
  isActive?: boolean;
}
