export interface LoginPayload {
  email: string,
  password: string,
}

export interface RegisterPayload {
  name: string,
  email: string,
  password: string,
}

export interface UpdateProfilePayload {
  name: string,
  gender: string,
}

export interface UpdateUsernamePayload {
  username: string,
}

export interface LoginResponse {
  accessToken: string,
  expiresIn: number,
  refreshToken: string,
  tokenType: 'Bearer',
}

export type UserGender = 'MALE' | 'FEMALE'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED'

export interface User {
  _id: string,
  name: string,
  username: string,
  email: string,
  status: UserStatus,
  gender?: UserGender,
  signUpFrom: string,
  signUpDate: string,
  createdAt: string,
  updatedAt: string,
}
