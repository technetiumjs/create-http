export class PingService {
  protected ping_response = 'PONG';
  public async ping(): Promise<string> {
    return this.ping_response;
  }
}
