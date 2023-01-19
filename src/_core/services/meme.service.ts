import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class MemeService {
  private ROOT_URL: string = 'https://meme-api.com/gimme';

  async getMeme(): Promise<string> {
    const response = await axios.get(this.ROOT_URL);
    const [_1, _2, _3, _4] = response.data.preview;

    if (_4) return _4;
    if (_3) return _3;
    if (_2) return _2;
    if (_1) return _1;
  }
}