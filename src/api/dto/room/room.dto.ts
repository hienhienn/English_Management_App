export interface Room {
  id?: string;
  office?: string;
  code?: string;
  title?: string;
  category?: string;
  max?: number;
  min?: number;
  area?: number;
  state?: string;
}

export interface CreateRoom {
  office?: string;
  code?: string;
  title: string;
  category?: string;
  max?: number;
  min?: number;
  area?: number;
  state?: string;
}

export interface UpdateRoom {
  office?: string;
  code?: string;
  title?: string;
  category?: string;
  max?: number;
  min?: number;
  area?: number;
  state?: string;
}
