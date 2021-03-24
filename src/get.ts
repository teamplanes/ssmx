import {getParametersFromPath} from './lib/getParametersFromPath';

export interface GetOptions {
  paths: string[];
  recursive?: boolean;
  region?: string;
}

export const get = async (
  options: GetOptions,
): Promise<Record<string, string>> =>
  Promise.all(
    options.paths.map((path) =>
      getParametersFromPath(path, options.recursive, options.region),
    ),
  ).then((result) => Object.assign({}, ...result));
