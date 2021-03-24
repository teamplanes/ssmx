import {readFileSync} from 'fs';

export const readStdin = (): string => readFileSync(process.stdin.fd, 'utf-8');
