import { IsBoolean, IsEmail, IsString } from "class-validator";

export class CreateUserDto {

    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    confirmpassword: string
    
    @IsBoolean()
    acceptTerms: boolean
}