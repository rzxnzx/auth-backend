import { IsEmail, IsString } from "class-validator";

export class UserLogin {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class TwoFactorAuthDto {
    @IsString()
    email: string;
    @IsString()
    twoFactorCode: string;
  }
  