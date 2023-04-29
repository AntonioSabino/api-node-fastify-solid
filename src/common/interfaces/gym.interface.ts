import { Prisma } from '@prisma/client'

export interface Gym {
  id: string
  name: string
  description: string | null
  phone: string | null
  latitude: Prisma.Decimal
  longitude: Prisma.Decimal
}
