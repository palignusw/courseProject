import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from 'src/users/users.repository';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secreta', //
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.findById(payload.sub);

    if (!user || user.isBlocked) {
      throw new UnauthorizedException('User is blocked or not found');
    }

    return user;
  }
}
