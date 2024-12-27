import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UtilService } from 'src/util/util.service';
import { UserLogin, UserRegister } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private util: UtilService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  registerUser(@Body() body: UserRegister) {
    return this.util.tryCatchWrapper(() =>
      this.authService.registerUser(body),
    )();
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  userLogin(@Body() body: UserLogin) {
    return this.util.tryCatchWrapper(() => this.authService.userLogin(body))();
  }
}
