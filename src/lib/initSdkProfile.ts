import AWS from 'aws-sdk';

export const initSdkProfile = (profile?: string): void => {
  if (profile) {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({profile});
  }
};
