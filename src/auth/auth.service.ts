import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDTO } from './auth.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    public async login(dto: AuthDTO) {
        const user = await this.validateUser(dto);
        const payload = {
            username: user.email,
            sub: {
                name: user.name
            }
        }

        return {
            user, token: {
                accessToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '1h',
                    secret: process.env.JwtSecretKey,
                }),
            }
        }
    }

    private async validateUser(dto: AuthDTO) {
        const user = await this.userService.findByEmail(dto.email);

        if (user && (await compare(dto.password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException();
    }
}
