import { InvalidCredentialsError } from '@/common/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { AuthenticateService } from '@/services/authenticate.service'

export default class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(3),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
      await this.authenticateService.login({
        email,
        password,
      })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(400).send({
          message: error.message,
        })
      }

      throw error
    }

    return reply.status(200).send()
  }
}
