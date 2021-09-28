import * as execa from 'execa';
import * as AWS from 'aws-sdk';
import {exec} from './exec';
import {get} from './get';
import {remove} from './remove';
import {set} from './set';

interface SyncParams {
  processEnv?: Record<string, any>;
}

const runSync = (method: string, params: any[]) => {
  const options: SyncParams =
    params.length > 0 ? params[params.length - 1] : {};
  const out = execa.sync(`${__dirname}/run-sync.js`, {
    ...(options.processEnv ? {env: options.processEnv} : {}),
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

type GetParams = Parameters<typeof get>;
type SetParams = Parameters<typeof set>;
type RemoveParams = Parameters<typeof remove>;
type ExecParams = Parameters<typeof exec>;

export const sync = {
  get: (opts: GetParams[0] & SyncParams): Record<string, string> =>
    runSync('get', [opts]),
  set: (params: SetParams[0], opts: SyncParams & SetParams[1]): void =>
    runSync('set', [params, opts]),
  remove: (name: RemoveParams[0], opts: SyncParams & RemoveParams[1]): void =>
    runSync('remove', [name, opts]),
  exec: (command: ExecParams[0], opts: SyncParams & ExecParams[1]): void =>
    runSync('exec', [command, opts]),
};
