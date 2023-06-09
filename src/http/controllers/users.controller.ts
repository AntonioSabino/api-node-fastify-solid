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
      role: z.enum(['USER', 'ADMIN']).default('USER'),
      password: z.string().min(3),
    })

    const { name, email, password, role } = registerBodySchema.parse(
      request.body,
    )

    try {
      await this.usersService.create({
        name,
        email,
        role,
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

  async getUser(request: FastifyRequest, reply: FastifyReply) {
    const user = await this.usersService.findById(request.user.sub)

    return reply.status(200).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    })
  }
}
