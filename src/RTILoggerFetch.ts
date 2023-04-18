import { IRTILogger } from 'cheq-rti-client-core-js';

export class RTILoggerFetch implements IRTILogger {
  apiKey: string;
  tagHash: string;
  application: string;

  constructor(apiKey: string, tagHash: string, application: string) {
    this.apiKey = apiKey;
    this.tagHash = tagHash;
    this.application = application;
  }

  async log(level: 'audit' | 'error' | 'info' | 'warn', message: string, action?: string): Promise<void> {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          message,
          action,
          application: this.application,
          apiKey: this.apiKey,
          tagHash: this.tagHash,
        }),
      };
      return fetch('https://rtilogger.production.cheq-platform.com', options).then();
    } catch (e) {
      const err: Error = e as Error;
      console.error(`${this.application} request error: ${err.message}`);
    }
  }

  async error(message: string, action?: string): Promise<void> {
    return this.log('error', message, action);
  }

  async info(message: string, action?: string): Promise<void> {
    return this.log('info', message, action);
  }
}
