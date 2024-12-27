import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(search: string) {
    if (!search) {
      return this.prisma.user.findMany();
    }
    return this.prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: search || '',
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: search || '',
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
}
