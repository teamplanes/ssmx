import {SSM} from 'aws-sdk';
import {basename} from 'path';

type Params = Record<string, string>;

export const getParametersFromPath = async (
  ssmPath: string,
  recursive = false,
  region?: string,
): Promise<Params> => {
  const parameterFromPath = async (
    nextToken: string | undefined = undefined,
    params: Params = {},
  ): Promise<Params> => {
    const ssm = new SSM(region ? {region} : undefined);
    const result = await ssm
      .getParametersByPath({
        Path: ssmPath,
        NextToken: nextToken,
        WithDecryption: true,
        Recursive: recursive,
      })
      .promise();
    const newParams = {
      ...params,
      ...Object.fromEntries(
        result.Parameters?.map((param) =>
          param.Name ? [basename(param.Name), param.Value] : [],
        ) || [],
      ),
    };
    if (result.NextToken && result.Parameters?.length)
      return parameterFromPath(result.NextToken, newParams);
    return newParams;
  };
  return parameterFromPath(undefined);
};
