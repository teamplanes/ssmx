import * as path from 'path';
import * as AWS from 'aws-sdk';
import {initSdkProfile} from './lib/initSdkProfile';

export interface SetOptions {
  path: string;
  region?: string;
  profile?: string;
}

export const set = async (
  params: Record<string, string>,
  options: SetOptions,
): Promise<void> => {
  initSdkProfile(options.profile);
  const ssm = new AWS.SSM({region: options?.region, maxRetries: 5});
  await Promise.all(
    Object.keys(params).map(async (key) => {
      await ssm
        .putParameter({
          Type: 'SecureString',
          Name: path.join(options.path, key),
          Value: params[key],
          Overwrite: true,
        })
        .promise();
    }),
  );
};
