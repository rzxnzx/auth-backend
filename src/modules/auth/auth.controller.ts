import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/user.dto';
import { UserService } from 'src/modules/user/user.service';
import { UserLogin } from './auth.dto';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private authService: AuthService) { }

    @Post('register')
    public async registerUser(@Body() user: CreateUserDto) {
        return this.userService.create(user);
    }

    @Post('login')
    public async login(@Body() user: UserLogin) {
        return await this.authService.login(user)
    }
}
