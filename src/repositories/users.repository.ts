import {
  User,
  UserRepositoryCreateInput,
} from '@/common/interfaces/user.interface'

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: UserRepositoryCreateInput): Promise<User>
}
