import * as chai from 'chai';
import { PingService } from './';

const expect = chai.expect;

let service: PingService;

describe('PingService', () => {
  beforeEach(
    () => {
      service = new PingService();
    },
  );
  it('should instantiate', () => {
    expect(service).not.to.be.undefined;
  });
  describe('ping', () => {
    it('should return ping_response', async () => {
      const random_str: string = `${Math.floor(Math.random() * 1000000)}`;
      service['ping_response'] = random_str;
      const output: string = await service.ping();
      expect(output).to.equal(random_str);
    });
  });
});
