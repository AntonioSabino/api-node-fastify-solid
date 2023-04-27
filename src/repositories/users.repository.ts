import {
  User,
  UserRepositoryCreateInput,
} from '@/common/interfaces/user.interface'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: UserRepositoryCreateInput): Promise<User>
}
