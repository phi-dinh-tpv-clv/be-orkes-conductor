export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  EMPLOYEE = 'employee',
}

interface DynamicObject<T = any> {
  [key: string]: T;
}
