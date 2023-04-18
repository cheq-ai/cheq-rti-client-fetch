import { IRTIService, RTIRequest, RTIResponse, getBody, Config } from 'cheq-rti-client-core-js';

const rtiTimeout = 150;

export class RTIServiceFetch implements IRTIService {
  public async callRTI(payload: RTIRequest, config: Config): Promise<RTIResponse> {
    const body = getBody(payload, config);
    const params = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => {
      if (value) {
        params.append(key, String(value));
      }
    });
    const url = 'https://rti-global.cheqzone.com/v1/realtime-interception';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      // @ts-ignore
      signal: AbortSignal.timeout(config.timeout ?? rtiTimeout),
    };
    try {
      const response = await fetch(url, options);
      if (response.status >= 400) {
        const body = await response.text();
        throw new Error(`Invalid RTI request, response code: ${response.status}, body: ${body}`);
      }
      const rtiResponse: RTIResponse = await response.json();
      return rtiResponse;
    } catch (e) {
      const err: Error = e as Error;
      throw new Error(`request error: ${err.message}`);
    }
  }
}
