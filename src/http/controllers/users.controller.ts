import { UserAlreadyExistsError } from '@/common/errors/user-already-exists-error'
import { UsersService } from '@/services/users.service'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(3),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
      await this.usersService.createUser({
        name,
        email,
        password,
      })
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        return reply.status(409).send({
          message: error.message,
        })
      }

      throw error
    }

    return reply.status(201).send()
  }
}
