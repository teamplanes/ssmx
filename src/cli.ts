#!/usr/bin/env node
/* eslint-disable no-console */
import program, {Option} from 'commander';
import * as AWS from 'aws-sdk';
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import {get} from './get';
import {readStdin} from './lib/readStdin';
import {set} from './set';
import {remove} from './remove';
import {exec} from './exec';
import {initSdkProfile} from './lib/initSdkProfile';

const profileOption = new Option(
  '--profile [profile]',
  'AWS credentials profile',
);
const regionOption = new Option('--region [region]', 'AWS region');

const initSdk = (profile?: string, region?: string) => {
  if (typeof profile === 'string') {
    initSdkProfile(profile);
  } else if (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  ) {
    AWS.config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
  }

  if (region || process.env.AWS_REGION) {
    AWS.config.region = region || process.env.AWS_REGION;
  }
};

program
  .command('get')
  .option('-p, --path <paths...>', 'SSM base path')
  .option('-r, --recursive', 'fetch from SSM recursively')
  .addOption(profileOption)
  .addOption(regionOption)
  .action(async (options) => {
    initSdk(options?.profile, options?.region);
    const params = await get({
      paths: options.path || [],
      recursive: options.recursive,
    });

    if (process.stdout.isTTY) {
      console.log(params);
    } else {
      console.log(
        Object.keys(params)
          .map((key) => [key, params[key]].join('='))
          .join('\n'),
      );
    }
  });

program
  .command('set [dotenvOrName] [value]')
  .requiredOption('-p, --path <path>', 'SSM base path')
  .addOption(profileOption)
  .addOption(regionOption)
  .action(async (dotenvOrName, value, options) => {
    initSdk(options?.profile, options?.region);
    let params: Record<string, string>;
    if (!dotenvOrName) {
      const stdin = readStdin();
      if (!stdin) {
        throw new Error('No input found');
      }
      params = Object.fromEntries(
        stdin
          .split('\n')
          .map((str) => str.split('='))
          .filter((arr) => arr.length === 2),
      );
    }
    if (value) {
      params = {[dotenvOrName]: value};
    } else {
      params = dotenv.parse(
        fs.readFileSync(path.relative(process.cwd(), dotenvOrName), {
          encoding: 'utf8',
        }),
      );
    }
    await set(params, {path: options.path, region: options.region});
  });

program
  .command('remove <name>')
  .alias('rm')
  .requiredOption('-p, --path <path>', 'SSM base path')
  .addOption(profileOption)
  .addOption(regionOption)
  .action(async (name, options) => {
    initSdk(options?.profile, options?.region);
    await remove(name, {path: options.path, region: options.region});
  });

program
  .command('exec <command>')
  .option('-p, --path <paths...>', 'SSM base path')
  .option('-r, --recursive', 'fetch from SSM recursively')
  .addOption(profileOption)
  .addOption(regionOption)
  .action(async (command, options) => {
    initSdk(options?.profile, options?.region);
    await exec(command, {paths: options.path || [], region: options.region});
  });

program
  .parseAsync(process.argv)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
