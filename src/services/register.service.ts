import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  private readonly usersRepository: any

  constructor(usersRepository: any) {
    this.usersRepository = usersRepository
  }

  async execute({ name, email, password }: RegisterServiceRequest) {
    const passwordHash = await hash(password, 8)

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new Error('User with same email already exists')
    }

    this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })
  }
}

// export async function registerService({
//   name,
//   email,
//   password,
// }: RegisterServiceRequest) {
//   const passwordHash = await hash(password, 8)

//   const userWithSameEmail = await prisma.user.findUnique({
//     where: {
//       email,
//     },
//   })

//   if (userWithSameEmail) {
//     throw new Error('User with same email already exists')
//   }

//   const prismaUserRepository = new PrismaUsersRepository()

//   prismaUserRepository.create({
//     name,
//     email,
//     password_hash: passwordHash,
//   })
// }
