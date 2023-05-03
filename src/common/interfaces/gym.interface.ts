export interface Gym {
  id: string
  name: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

export interface GymInput {
  id?: string
  name: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}
