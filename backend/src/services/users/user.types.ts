export interface CreateUserParams {
  email?: string;
  token?: string;
  verified?: boolean;
  role?: UserType;
}

export interface UpdateUserParams {
  email?: string;
  token?: string;
  verified?: boolean;
  role?: UserType;
}

export interface UpdateUserQuery {
  _id: string;
}

export interface UserQuery {
  id?: string;
  email?: string;
  token?: string;
}

export enum UserType {
  REGULAR = "REGULAR",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN"
}
