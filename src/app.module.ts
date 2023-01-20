import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './_core/entities/user.entity';
import { MemeService } from './_core/services/meme.service';
import { OpenaiService } from './_core/services/openai.service';
import { UsersService } from './_core/services/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get('TELEGRAM_BOT_TOKEN')
      })
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url: configService.get("DATABASE_URL"),
        type: "postgres",
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: true,
        ssl: false,
      }),
    }),
    TypeOrmModule.forFeature([
      UserEntity,
    ])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    OpenaiService,
    MemeService,
    UsersService,
  ],
})
export class AppModule {}
