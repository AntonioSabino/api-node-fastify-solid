import {
  CheckIn,
  CheckInUncheckedCreateInput,
} from '@/common/interfaces/check-ins.interface'

export interface CheckInsRepository {
  countByUserId: (userId: string) => Promise<number>
  create: (checkIn: CheckInUncheckedCreateInput) => Promise<CheckIn>
  findById: (id: string) => Promise<CheckIn | null>
  findByUserIdAndDate: (userId: string, date: Date) => Promise<CheckIn | null>
  findManyByUserId: (userId: string, page: number) => Promise<CheckIn[]>
  save: (checkIn: CheckIn) => Promise<CheckIn>
}
