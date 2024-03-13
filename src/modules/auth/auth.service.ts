import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtPayload } from './types/jwtPayload.type';
import { ConfigService } from '@nestjs/config';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    // private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getByEmail(email);
    if (user && user.password === password) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async updateRefreshTokenHash(id: number, refresh_token: string): Promise<void> {
    const hash = await this.hashData(refresh_token);
    await this.usersService.update(id, { refresh_token: hash });
  }

  async getTokens(id: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: id,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),

      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async signupLocal(data: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(data.password);

    const dataUser = {
      email: data.email,
      password: hash,
      name: data.name,
    };

    const newUser = await this.usersService.create(dataUser);

    const token = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshTokenHash(newUser.id, token.refresh_token);

    return token;
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.usersService.getByEmail(dto.email);

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(id: number): Promise<boolean> {
    await this.usersService.update(id, { refresh_token: null });
    return true;
  }

  async refreshTokens(id: number, rt: string): Promise<Tokens> {
    const user = await this.usersService.getById(id);

    if (!user || !user.refresh_token) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.refresh_token);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }
}
