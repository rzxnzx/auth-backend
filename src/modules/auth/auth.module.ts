import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/modules/user/user.service';
import { PrismaService } from 'src/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SmtpService } from 'src/services/smtp.service';


@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService, JwtService, SmtpService]
})
export class AuthModule {}
