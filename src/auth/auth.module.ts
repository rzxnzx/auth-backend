import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
    controllers: [AuthController],
    providers: [AuthService, UserService, PrismaService, JwtService]
})
export class AuthModule {}
