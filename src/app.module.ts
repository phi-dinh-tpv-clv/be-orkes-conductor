import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwtAuth.guard';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './modules/posts/posts.module';
import { KAFKA_PRODUCER } from './common/constants/common.constant';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: KAFKA_PRODUCER,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'om-com-workflow-service-producer',
              connectionTimeout: 4500,
              brokers: [configService.get<string>('KAFKA_BROKER_URI')],
              ssl: true,
              sasl: {
                mechanism: 'plain',
                username: configService.get<string>('KAFKA_USERNAME'),
                password: configService.get<string>('KAFKA_PASSWORD'),
              },
            },
            producerOnlyMode: true,
            postfixId: '',
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [KAFKA_PRODUCER],
})
export class AppModule {}
