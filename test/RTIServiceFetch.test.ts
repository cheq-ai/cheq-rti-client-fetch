import { RTIServiceFetch } from '../src/RTIServiceFetch';
import { EventType, Mode } from 'cheq-rti-client-core-js';

global.AbortSignal.timeout = jest.fn(time => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(new Error('TimeoutError')), time);
  return controller.signal;
}) as jest.Mock;
global.fetch = jest.fn(() => Promise.reject(new Error('foo'))) as jest.Mock;
describe('RTIServiceFetch', () => {
  it('throws errors when key invalid', async () => {
    const service = new RTIServiceFetch();
    try {
      await service.callRTI(
        {
          eventType: EventType.PAGE_LOAD,
          method: 'GET',
          ip: '127.0.0.1',
          url: 'https://foo.com',
          headers: {},
        },
        {
          mode: Mode.BLOCKING,
          apiKey: 'foo',
          tagHash: 'bar',
          blockRedirectCodes: [],
          timeout: 5000,
        },
      );
      fail('no error thrown');
    } catch (e) {
      const err: Error = e as Error;
      expect(err.message).toMatch('request error: foo');
    }
  });
});
