import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/user.dto';
import { AuthDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private authService: AuthService){}

    @Post('register')
    public async registerUser(@Body() dto:CreateUserDto){
        return this.userService.create(dto);
    }

    @Post('login')
    public async login(@Body() dto: AuthDTO){
        return await this.authService.login(dto)
    }
}
