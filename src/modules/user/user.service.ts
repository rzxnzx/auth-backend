import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateUserDto } from './user.dto';
import { hash } from 'bcrypt';
import { Errors } from 'src/constants/errors.constants';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    public async create(dto: CreateUserDto): Promise<Omit<User, 'password' | 'confirmPassword'>> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
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
                },
            });

            const { password, confirmPassword, ...result } = newUser;
            return result;
        }
    }

    public async findByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({ where: { email: email } });
    }

    public async findById(id: number): Promise<User | null> {
        return await this.prisma.user.findUnique({ where: { id: id } });
    }

    // Método para actualizar el código 2FA y su expiración
    public async updateTwoFactorCode(userId: number, code: string, expiry: Date): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorCode: code,
                twoFactorExpiry: expiry,
            },
        });
    }

    // Método para limpiar el código 2FA después de validarlo
    public async clearTwoFactorCode(userId: number): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorCode: null,
                twoFactorExpiry: null,
            },
        });
    }
}
