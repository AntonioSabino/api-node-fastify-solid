import { GymsService } from '@/services/gyms.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  async createGym(request: FastifyRequest, reply: FastifyReply) {
    const createGymBodySchema = z.object({
      name: z.string(),
      description: z.string().nullable(),
      phone: z.string().nullable(),
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })

    const gymInput = createGymBodySchema.parse(request.body)

    const gym = await this.gymsService.create(gymInput)

    reply.status(201).send(gym)
  }
}
