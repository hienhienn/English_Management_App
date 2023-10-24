export interface Parents {
  id: string;
  fullname?: string;
  email?: string;
  sex?: string;
  phoneNumber?: string;
  birthday?: string;
  addressType?: string;
  country?: string;
  provinceCity?: string;
  district?: string;
  messengerLink?: string;
  zaloLink?: string;
  otherLink?: string;
  studyType?: string;
  tag: string[];
  career?: string;
  studyGoal?: string;
  knownUsBy?: string;
  contactBy?: string;
  note?: string;
  managerId?: string;
  status?: string;
  result?: string;
}

export interface CreateParents {
  fullname?: string;
  email?: string;
  sex?: string;
  phoneNumber?: string;
  birthday?: string;
  addressType?: string;
  country?: string;
  provinceCity?: string;
  district?: string;
  messengerLink?: string;
  zaloLink?: string;
  otherLink?: string;
  studyType?: string;
  tag: string[];
  career?: string;
  studyGoal?: string;
  knownUsBy?: string;
  contactBy?: string;
  note?: string;
  managerId: string;
  status: string;
  result: string;
}

export interface UpdateParents {
  fullname?: string;
  email?: string;
  sex?: string;
  phoneNumber?: string;
  birthday?: string;
  addressType?: string;
  country?: string;
  provinceCity?: string;
  district?: string;
  messengerLink?: string;
  zaloLink?: string;
  otherLink?: string;
  studyType?: string;
  tag?: string[];
  career?: string;
  studyGoal?: string;
  knownUsBy?: string;
  contactBy?: string;
  note?: string;
  managerId?: string;
  status?: string;
  result?: string;
}
