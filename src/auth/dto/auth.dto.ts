import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserRegister {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UserLogin {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
