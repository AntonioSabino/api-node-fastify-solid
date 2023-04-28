export interface CheckIn {
  id: string
  createdAt: Date
  validated_at: Date | null
  user_id: string
  gym_id: string
}

export interface CheckInInput {
  userId: string
  gymId: string
}

export interface CheckInUncheckedCreateInput {
  user_id: string
  gym_id: string
}
