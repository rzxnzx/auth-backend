import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserLogin } from './auth.dto';
import { UserService } from 'src/modules/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenConfig } from 'src/constants/token.constant';
import { Success } from 'src/constants/success.constants';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    public async login(dto: UserLogin) {
        const user = await this.validateUser(dto);
        const payload = {
            username: user.email,
            sub: {
                name: user.name
            }
        }

        return {
            user, Tokens: {
                Access: await this.jwtService.signAsync(payload, {
                    expiresIn: TokenConfig.TokenExpire,
                    secret: process.env.JwtSecretKey,
                }),
            },
            status: Success.OK
        }
    }


    private async validateUser(dto: UserLogin) {
        const user = await this.userService.findByEmail(dto.email);

        if (user && (await compare(dto.password, user.password))) {
            const { password, confirmPassword,  ...result } = user;
            return result;
        }
        throw new UnauthorizedException();
    }
}