export interface Gym {
  id: string
  name: string
  description: string | null
  phone: string | null
  latitude: string
  longitude: string
}

export interface GymInput {
  id?: string
  name: string
  description: string | null
  phone: string | null
  latitude: string
  longitude: string
}
