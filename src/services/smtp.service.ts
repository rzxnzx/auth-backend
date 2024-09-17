import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class SmtpService {
    private readonly transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    public async sendTwoFactorCode(email: string, code: string): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_FROM_EMAIL,
            to: email,
            subject: 'Tu código de autenticación 2FA',
            text: `Tu código de autenticación de dos factores es: ${code}`,
            html: `<p>Tu código de autenticación de dos factores es: <b>${code}</b></p>`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Código 2FA enviado a ${email}`);
        } catch (error) {
            console.error(`Error al enviar correo a ${email}:`, error);
            throw new Error('No se pudo enviar el correo de 2FA');
        }
    }
}
