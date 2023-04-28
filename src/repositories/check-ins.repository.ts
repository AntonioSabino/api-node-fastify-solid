import {
  CheckIn,
  CheckInUncheckedCreateInput,
} from '@/common/interfaces/check-ins.interface'

export interface CheckInsRepository {
  create: (checkIn: CheckInUncheckedCreateInput) => Promise<CheckIn>
  findByUserIdAndDate: (userId: string, date: Date) => Promise<CheckIn | null>
}
