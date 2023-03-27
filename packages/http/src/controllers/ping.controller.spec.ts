import * as chai from 'chai';
import { PingController } from './';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { PingService } from '../services';

const expect = chai.expect;

let ctrl: PingController;

// tslint:disable-next-line
class FakePingController extends PingController {
  private send: Subject<any> = new BehaviorSubject<any>(null);
  private status: Subject<number> = new BehaviorSubject<any>(null);
  constructor() {
    super(
      <any>{},
      <any>{
        send: (response_value: any) => {
          this.send.next(response_value);
          this.send.complete();
        },
        sendStatus: (response_code: number) => {
          this.status.next(response_code);
          this.status.complete();
        },
      },
      () => { },
    );
  }
  public onSend(): Observable<any> {
    return this.send.asObservable().pipe(filter(user => user !== null), first());
  }
  public onStatus(): Observable<number> {
    return this.status.asObservable().pipe(filter(user => user !== null), first());
  }
}

describe('PingHttpController', () => {
  beforeEach(
    () => {
      ctrl = new FakePingController();
    },
  );
  it('should instantiate', () => {
    expect(ctrl).not.to.be.undefined;
  });
  describe('ping', () => {
    it('should pass PingService.ping()\'s response to res.send', (done) => {
      (<FakePingController>ctrl).onSend().subscribe(
        async (response_value: any) => {
          expect(response_value).to.equal(await ctrl['ping_service'].ping());
          done();
        },
      );
      ctrl.ping();
    });
    it('should sendStatus(500) on error', (done) => {
      ctrl['ping_service'] = <PingService>{
        ping: (): any => { throw new Error('error'); },
      };
      (<FakePingController>ctrl).onStatus().subscribe(
        async (response_code: number) => {
          expect(response_code).to.equal(500);
          done();
        },
      );
      ctrl.ping();
    });
  });
});
