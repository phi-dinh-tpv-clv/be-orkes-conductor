import { GetCurrrentUser } from '../../common/decorators/get-current-user.decorator';
import { GetCurrrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import { Controller, Req, Post, Body, UseGuards, Get, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { AuthDto } from './dto/auth.dto';
import { Tokens, TokensSchema } from './types/tokens.type';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtRefreshAuthGuard } from './guards/jwtAuthRefresh.guard';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { KAFKA_PRODUCER, KAFKA_TOPICS } from 'src/common/constants/common.constant';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(KAFKA_PRODUCER)
    private readonly clientKafka: ClientKafka,
  ) {}

  onModuleInit() {
    this.clientKafka.subscribeToResponseOf(KAFKA_TOPICS.KAFKA_SPECIFIC_TOPIC);
  }

  onModuleDestroy() {
    this.clientKafka.close();
  }

  @MessagePattern(KAFKA_TOPICS.KAFKA_UPDATED_PRIVATE)
  async handleAcceptApproval() {
    console.log('Approval accepted');
  }

  @MessagePattern(KAFKA_TOPICS.KAFKA_REJECTED_PRIVATE)
  async handleRejectApproval() {
    console.log('Approval rejected');
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'Return to token',
    type: TokensSchema,
  })
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @Public()
  @Post('signup')
  @ApiResponse({
    description: 'Return to token',
    type: TokensSchema,
  })
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() data: AuthDto): Promise<Tokens> {
    const token = this.authService.signupLocal(data);
    this.clientKafka.emit('created_user', JSON.stringify('createUserDto'));

    // this.clientKafka.send(KAFKA_TOPICS.KAFKA_SPECIFIC_TOPIC, JSON.stringify('{ userId }')).subscribe((user) => {
    //   console.log(`create user - ${user}`);
    // });

    return token;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async profile(@Req() req: Request) {
    console.log('req', req.user);
    return {
      data: req.user,
    };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetCurrrentUserId() id: number, @GetCurrrentUser('refreshToken') token: string) {
    // const user = req.user;
    console.log('id', id);
    console.log('token', token);
    return this.authService.refreshTokens(id, token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        ok: {
          type: 'boolean',
        },
      },
    },
  })
  logout(@GetCurrrentUserId() id: number) {
    // const user = req.user;
    return this.authService.logout(id);
  }
}
