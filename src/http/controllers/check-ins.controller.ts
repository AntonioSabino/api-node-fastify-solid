import CheckInsService from '@/services/check-ins.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export class CheckInsController {
  constructor(private readonly checkInsService: CheckInsService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      gymId: z.string().uuid(),
    })

    const bodySchema = z.object({
      userLatitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      userLongitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })

    const { gymId } = paramsSchema.parse(request.params)
    const { userLatitude, userLongitude } = bodySchema.parse(request.body)

    await this.checkInsService.create({
      gymId,
      userId: request.user.sub,
      userLatitude: userLatitude.toString(),
      userLongitude: userLongitude.toString(),
    })

    return reply.status(201).send()
  }

  async count(request: FastifyRequest, reply: FastifyReply) {
    const count = await this.checkInsService.countByUserId(request.user.sub)

    return reply.status(200).send({ count })
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    const querySchema = z.object({
      page: z.number().int().positive().default(1),
    })

    const { page } = querySchema.parse(request.query)

    const checkIns = await this.checkInsService.findManyByUserId(
      request.user.sub,
      page,
    )

    return reply.status(200).send({ checkIns })
  }

  async validate(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      checkInId: z.string().uuid(),
    })

    const { checkInId } = paramsSchema.parse(request.params)

    await this.checkInsService.validateCheckIn(checkInId)

    return reply.status(204).send()
  }
}
