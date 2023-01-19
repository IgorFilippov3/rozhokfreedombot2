import { Injectable } from '@nestjs/common';
import { Start, Update, On, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { isPetuh } from './utils/is-petuh';
import { isQuestion } from './utils/is-question';
import { MemeService } from './_core/services/meme.service';
import { OpenaiService } from './_core/services/openai.service';

@Update()
@Injectable()
export class AppService {

  constructor(
    private openaiService: OpenaiService,
    private memeService: MemeService,
  ) { }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Всім привіт Люсьєн знову на зв\'язку.');
  }

  @Command('meme')
  async getMeme(ctx: Context) {
    const meme: string = await this.memeService.getMeme();
    await ctx.replyWithPhoto({ url: meme });
  }

  @On('text')
  async reply(ctx: Context) {
    try {
      const username: string = ctx.message.from.username;

      if (isPetuh(username)) {
        return await ctx.reply('Петухам не отвечаю');
      }

      //@ts-ignore
      const text: string = ctx.message.text.toLowerCase();

      if (text === 'тобі повістка') {
        return await ctx.replyWithPhoto({ url: 'https://i.ibb.co/C8MNhFY/sticker.webp' });
      }

      if (isQuestion(text)) {
        const answer = await this.openaiService.answerQuestion(text);
        await ctx.reply(answer);
      } else {
        const answer = await this.openaiService.reply(text);
        await ctx.reply(answer);
      }

    } catch (e) {
      console.error(e);
      await ctx.reply('Чето пошло не так, попробуй еще раз...');
    }
  }

  @On('new_chat_members')
  async handleNewChatMembers(ctx: Context) {
    try {
      //@ts-ignore
      const newUsers = ctx.message.new_chat_members;
  
      const petuhInChat = newUsers.some(nu => isPetuh(nu.username));
  
      if (petuhInChat) {
        return await ctx.reply('В чате завелся петух.');
      } else {
        return await ctx.reply('Добро пожаловать в лучший из Рожок чатов.');
      }
  
    } catch (e) {
      console.error(e);
    }
  }
}
