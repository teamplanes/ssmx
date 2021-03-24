#!/usr/bin/env node
/* eslint-disable no-console */
import * as AWS from 'aws-sdk';
import {get} from './get';
import {set} from './set';
import {remove} from './remove';
import {exec} from './exec';
import {readStdin} from './lib/readStdin';

const methods: Record<string, (...args: any[]) => Promise<any>> = {
  get,
  set,
  remove,
  exec,
};

const args = JSON.parse(readStdin());
AWS.config.region = args.region;
AWS.config.credentials = {
  accessKeyId: args.credentials.accessKeyId,
  secretAccessKey: args.credentials.secretAccessKey,
};
const method = methods[args.method];
method(...args.params)
  .then((result) => {
    if (result) console.log(JSON.stringify(result));
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
