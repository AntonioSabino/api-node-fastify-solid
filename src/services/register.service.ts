import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/users.repository'
import { hash } from 'bcryptjs'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export async function registerService({
  name,
  email,
  password,
}: RegisterServiceRequest) {
  const passwordHash = await hash(password, 8)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('User with same email already exists')
  }

  const prismaUserRepository = new PrismaUsersRepository()

  prismaUserRepository.create({
    name,
    email,
    password_hash: passwordHash,
  })
}
