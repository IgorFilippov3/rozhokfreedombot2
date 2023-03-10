import { Injectable } from '@nestjs/common';
import { Start, Update, On, Command, Hears } from 'nestjs-telegraf';
import { text } from 'stream/consumers';
import { Context } from 'telegraf';
import { isPetuh } from './utils/is-petuh';
import { isQuestion } from './utils/is-question';
import { UserEntity } from './_core/entities/user.entity';
import { UserRole } from './_core/models/user-role.enum';
import { MemeService } from './_core/services/meme.service';
import { OpenaiService } from './_core/services/openai.service';
import { UsersService } from './_core/services/users.service';

@Update()
@Injectable()
export class AppService {

  constructor(
    private openaiService: OpenaiService,
    private memeService: MemeService,
    private usersService: UsersService,
  ) { }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Всім привіт Люсьєн знову на зв\'язку.');
  }

  @Command('meme')
  async getMeme(ctx: Context) {
    const meme: string | null = await this.memeService.getMeme();

    meme === null
      ? await ctx.reply('Сервер с мемами из даун')
      : await ctx.replyWithPhoto({ url: meme });
  }

  @Command('petuhi')
  async isPetuhuInChat(ctx: Context) {
    const petuhi: UserEntity[] = await this.usersService.findUsersByRole(UserRole.PETUH);

    if (petuhi.length === 0) {
      await ctx.reply('петухи не обнаружены, продолжаю наблюдение');
      return;
    }

    const petuhiMessage = petuhi.map(p => p.username).join('\n');
    
    petuhi.length === 0
      ? await ctx.reply('петухи не обнаружены, продолжаю наблюдение')
      : await ctx.replyWithHTML(`<b>в чате есть петухи!!</b> \n\n${petuhiMessage}`);
  }

  @On('text')
  async reply(ctx: Context) {
    const chatMember = ctx.message.from;

    const userInDatabase: UserEntity | null = await this.usersService.findUserByUserId(chatMember.id);

    if (userInDatabase === null) {
      await this.usersService.createUser({
        userId: chatMember.id,
        firstName: chatMember.first_name,
        lastName: chatMember.last_name,
        username: chatMember.username
      });
    }

    //@ts-ignore
    const text: string = ctx.message.text.toLowerCase();

    //@ts-ignore
    if (text.startsWith('люсьен') || ctx.message.reply_to_message?.from.username === ctx.me) {
      try {
        const username: string = ctx.message.from.username;

        if (isPetuh(username)) {
          await ctx.reply('Петухам не отвечаю', {
            reply_to_message_id: ctx.message.message_id
          });
          return;
        }

        if (isQuestion(text)) {
          const answer = await this.openaiService.answerQuestion(text);
          await ctx.reply(answer, {
            reply_to_message_id: ctx.message.message_id
          });
        } else {
          const answer = await this.openaiService.reply(text);
          await ctx.reply(answer, {
            reply_to_message_id: ctx.message.message_id
          });
        }

      } catch (e) {
        console.error(e);
        await ctx.reply('Чето пошло не так, попробуй еще раз...');
      }
    }
  }

  @On('new_chat_members')
  async handleJoinChat(ctx: Context) {
    try {
      //@ts-ignore
      const newMember = ctx.message.new_chat_members[0];

      const existingUser: UserEntity | null = await this.usersService.findUserByUserId(newMember.id);

      if (existingUser === null) {
        const user: UserEntity = await this.usersService.createUser({
          userId: newMember.id,
          firstName: newMember.first_name,
          lastName: newMember.last_name,
          username: newMember.username
        });

        isPetuh(user.username)
          ? await ctx.reply('В чате завелся петух.')
          : await ctx.reply('Добро пожаловать в лучший из Рожок чатов.');
        return;
      }

      await ctx.reply('Добро пожаловать в лучший из Рожок чатов.');

    } catch (e) {
      console.error(e);
    }
  }

  @On('left_chat_member')
  async handleLeaveChat(ctx: Context) {
    //@ts-ignore
    const member = ctx.message.left_chat_member;

    const user: UserEntity | null = await this.usersService.findUserByUserId(member.id);

    if (user !== null) {
      await this.usersService.removeUser(Number(user.userId));
      isPetuh(user.role)
        ? await ctx.reply('Чат покинул петух')
        : await ctx.reply('кто-то ливнул');
    }

    await ctx.reply('кто-то ливнул');
  }
}
