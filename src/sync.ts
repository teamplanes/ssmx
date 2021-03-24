import * as execa from 'execa';
import * as AWS from 'aws-sdk';
import {exec} from './exec';
import {get} from './get';
import {remove} from './remove';
import {set} from './set';

const runSync = (method: string, params: any[]) => {
  const out = execa.sync(`${__dirname}/run-sync.js`, {
    input: JSON.stringify({
      method,
      params,
      region: AWS.config.region,
      credentials: {
        accessKeyId: AWS.config.credentials?.accessKeyId,
        secretAccessKey: AWS.config.credentials?.secretAccessKey,
      },
    }),
  }).stdout;

  try {
    return out ? JSON.parse(out) : undefined;
  } catch (error) {
    return undefined;
  }
};

export const sync = {
  get: (...params: Parameters<typeof get>): Record<string, string> =>
    runSync('get', params),
  set: (...params: Parameters<typeof set>): void => runSync('set', params),
  remove: (...params: Parameters<typeof remove>): void =>
    runSync('remove', params),
  exec: (...params: Parameters<typeof exec>): void => runSync('exec', params),
};
