import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserLogin, UserRegister } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser({ email, name, password }: UserRegister) {
    return this.prisma.user.create({
      data: {
        email,
        name,
        password: bcrypt.hashSync(password, 10),
      },
      select: {
        email: true,
        name: true,
      },
    });
  }

  async userLogin({ email, password }: UserLogin) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new BadRequestException({
        message: 'Email or Password is incorrect',
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException({
        message: 'Email or Password is incorrect',
      });
    }

    const { password: p, ...userInfo } = user;
    return {
      access_token: this.jwtService.sign(userInfo),
    };
  }
}
