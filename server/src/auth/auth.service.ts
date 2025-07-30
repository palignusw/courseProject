import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from 'src/common/mailer.service';
import { UsersRepository } from 'src/users/users.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailerService: MailerService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: CreateAuthDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch || user.isBlocked) {
      throw new UnauthorizedException('Invalid credentials or user is blocked');
    }

    await this.usersService.updateLastLogin(user.id);

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersRepository.findByResetToken(token);

    if (
      !user ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.usersRepository.save(user);

    return { message: 'Password has been reset successfully' };
  }

  async sendResetLink(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await this.usersRepository.save(user);

    const resetUrl = `https://course-project-three.vercel.app/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password reset link',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    return { message: 'Reset link sent to your email' };
  }
}
