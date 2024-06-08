import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateUserDto } from './user.dto';
import { hash } from 'bcrypt';
import { Errors } from 'src/constants/errors.constants';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    public async create(dto: CreateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if (user) {
            throw new ConflictException(Errors.UsedEmail);
        } else {
            const hashedPassword = await hash(dto.password, 10);

            const newUser = await this.prisma.user.create({
                data: {
                    ...dto,
                    password: hashedPassword,
                    confirmPassword: hashedPassword,
                }
            });

            const { password, confirmPassword, ...result } = newUser;
            return result;
        }
    }

    public async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email: email } });
    }

    public async findById(id: number) {
        return await this.prisma.user.findUnique({ where: { id: id } });
    }
}
