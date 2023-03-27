import { HttpController } from '@techjs/http';
import { Resolve } from 'tsnode-di';
import {
  PingService,
} from '../services/';

export class PingController extends HttpController {
  @Resolve(PingService)
  private ping_service!: PingService;
  public async ping(): Promise<void> {
    try {
      const response: string = await this.ping_service.ping();
      this.res.send(response);
    } catch (e) {
      this.res.sendStatus(500);
    }
  }
}
