import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { MailerModule } from 'src/common/mailer.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MailerModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secreta',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, UsersRepository,JwtStrategy],
})
export class AuthModule {}
