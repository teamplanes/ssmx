import * as path from 'path';
import * as AWS from 'aws-sdk';

export interface SetOptions {
  path: string;
  region?: string;
}

export const set = async (
  params: Record<string, string>,
  options: SetOptions,
): Promise<void> => {
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
