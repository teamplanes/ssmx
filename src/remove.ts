import AWS from 'aws-sdk';
import * as path from 'path';

export interface RemoveOptions {
  path: string;
  region?: string;
}

export const remove = async (
  name: string,
  options: RemoveOptions,
): Promise<void> => {
  const ssm = new AWS.SSM({region: options?.region, maxRetries: 5});
  await ssm
    .deleteParameter({
      Name: path.join(options.path, name),
    })
    .promise();
};
