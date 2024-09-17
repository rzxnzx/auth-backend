import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserLogin, TwoFactorAuthDto } from './auth.dto';
import { UserService } from 'src/modules/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenConfig } from 'src/constants/token.constant';
import { Success } from 'src/constants/success.constants';
import { randomInt } from 'crypto';
import * as dayjs from 'dayjs';
import { SmtpService } from 'src/services/smtp.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private smtpService: SmtpService,
  ) {}

  public async login(dto: UserLogin) {
    const user = await this.validateUser(dto);
    const twoFactorCode = randomInt(100000, 999999).toString();
    const twoFactorExpiry = dayjs().add(10, 'minutes').toDate();

    await this.userService.updateTwoFactorCode(user.id, twoFactorCode, twoFactorExpiry);
    await this.sendTwoFactorCodeByEmail(user.email, twoFactorCode);

    return {
      message: 'Código 2FA enviado a tu email. Por favor verifica.',
      status: Success.OK
    };
  }

  private async sendTwoFactorCodeByEmail(email: string, code: string): Promise<void> {
    await this.smtpService.sendTwoFactorCode(email, code);
  }

  public async validateTwoFactorCode(dto: TwoFactorAuthDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || user.twoFactorCode !== dto.twoFactorCode) {
      throw new UnauthorizedException('Código 2FA inválido.');
    }

    if (dayjs().isAfter(user.twoFactorExpiry)) {
      throw new BadRequestException('El código 2FA ha expirado.');
    }

    const payload = {
      username: user.email,
      sub: {
        name: user.name,
      },
    };

    return {
      user,
      Tokens: {
        Access: await this.jwtService.signAsync(payload, {
          expiresIn: TokenConfig.TokenExpire,
          secret: process.env.JwtSecretKey,
        }),
      },
      status: Success.OK,
    };
  }

  private async validateUser(dto: UserLogin) {
    const user = await this.userService.findByEmail(dto.email);

    if (user && (await compare(dto.password, user.password))) {
      const { password, confirmPassword, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }
}
