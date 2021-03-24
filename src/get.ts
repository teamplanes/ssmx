import {getParametersFromPath} from './lib/getParametersFromPath';
import {initSdkProfile} from './lib/initSdkProfile';

export interface GetOptions {
  paths: string[];
  recursive?: boolean;
  profile?: string;
  region?: string;
}

export const get = async (
  options: GetOptions,
): Promise<Record<string, string>> => {
  initSdkProfile(options.profile);
  return Promise.all(
    options.paths.map((path) =>
      getParametersFromPath(path, options.recursive, options.region),
    ),
  ).then((result) => Object.assign({}, ...result));
};
