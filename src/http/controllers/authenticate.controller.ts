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
      const user = await this.authenticateService.login({
        email,
        password,
      })

      const token = await reply.jwtSign(
        {},
        {
          sign: {
            sub: user.id,
          },
        },
      )

      const refreshToken = await reply.jwtSign(
        {},
        {
          sign: {
            sub: user.id,
            expiresIn: '7d',
          },
        },
      )

      return reply
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          // secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .send({ token })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(400).send({
          message: error.message,
        })
      }

      throw error
    }
  }

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify({ onlyCookie: true })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: request.user.sub,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: request.user.sub,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        // secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  }
}
