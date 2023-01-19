import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemeService } from './_core/services/meme.service';
import { OpenaiService } from './_core/services/openai.service';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    OpenaiService,
    MemeService,
  ],
})
export class AppModule {}
