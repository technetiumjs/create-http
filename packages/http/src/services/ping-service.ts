export class PingService {
  protected ping_response: string = 'PONG';
  public async ping(): Promise<string> {
    return this.ping_response;
  }
}
