import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UtilService } from 'src/util/util.service';
import { EmailService } from './email.service';
import { User as UserDecorator } from 'src/common/decorator/user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('email')
export class EmailController {
  constructor(
    private util: UtilService,
    private emailService: EmailService,
  ) {}

  @Get()
  getUserEmails(@UserDecorator() user: User) {
    return this.util.tryCatchWrapper(() =>
      this.emailService.getUserEmails(user),
    )();
  }
}
