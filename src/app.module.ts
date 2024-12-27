import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilModule } from './util/util.module';
import { EventModule } from './event/event.module';
import { userModule } from './user/user.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [PrismaModule, UtilModule, AuthModule, userModule, EventModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
