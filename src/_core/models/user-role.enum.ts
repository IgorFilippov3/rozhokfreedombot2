import { isPetuh } from "src/utils/is-petuh";

export enum UserRole {
  USER = 'USER',
  PETUH = 'PETUH'
}

export namespace UserRole {
  export function defineRole(username: string): UserRole {
    return isPetuh(username) ? UserRole.PETUH : UserRole.USER;
  }
}