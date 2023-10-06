export interface UserKey {
  id: number;
}

export interface User extends UserKey {
  name: string;
  email?: string;
}
