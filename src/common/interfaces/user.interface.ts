export interface User {
  id: string
  name: string
  email: string
  password_hash: string
  created_at: Date
}

export interface UserCreateInput {
  name: string
  email: string
  password: string
}

export interface UserRepositoryCreateInput
  extends Omit<UserCreateInput, 'password'> {
  password_hash: string
}
