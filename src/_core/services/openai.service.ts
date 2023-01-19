import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenaiService {
  configuration: Configuration = new Configuration({
    apiKey: this.configService.get('OPENAI_TOKEN'),
  });

  openai = new OpenAIApi(this.configuration);

  constructor(private configService: ConfigService) {}

  async answerQuestion(value: string) {
    const response = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${value}, add some sarcasm`,
      temperature: 0.9,
      max_tokens: 300,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
  
    return response.data.choices[0].text;
  }

  async reply(value: string) {
    const response = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${value}, be polite`,
      temperature: 0.2,
      max_tokens: 300,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
  
    return response.data.choices[0].text;
  }
}