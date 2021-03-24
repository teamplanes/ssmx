import execa from 'execa';
import AWS from 'aws-sdk';
import {get} from './get';
import {initSdkProfile} from './lib/initSdkProfile';

export interface ExecOptions {
  paths: string[];
  region?: string;
  profile?: string;
  execOptions?: execa.Options<string>;
}

export const exec = async (
  command: string,
  options: ExecOptions,
): Promise<execa.ExecaChildProcess<string>> => {
  initSdkProfile(options.profile);
  const params = await get({paths: options.paths, region: options.region});
  return execa.command(command, {
    cwd: process.cwd(),
    ...options.execOptions,
    stdout: 'inherit',
    env: {
      ...process.env,
      ...options.execOptions?.env,
      AWS_ACCESS_KEY_ID: AWS.config.credentials?.accessKeyId,
      AWS_SECRET_ACCESS_KEY: AWS.config.credentials?.secretAccessKey,
      AWS_REGION: options.region || AWS.config.region,
      ...params,
    },
  });
};
