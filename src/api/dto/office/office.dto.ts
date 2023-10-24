export interface Office {
  id: string;
  title: string;
  address: string;
  isActive: boolean;
}

export interface CreateOffice {
  title: string;
  address: string;
  isActive: boolean;
}

export interface UpdateOffice {
  title?: string;
  address?: string;
  isActive?: boolean;
}
