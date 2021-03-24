# SSMX

## example: CLI
```sh
# Get
$ ssmx get --path=/path/1 --path=/path/2 --recursive
$ ssmx get --path=/path/1 --path=/path/2 --recursive > .env

# Set
$ ssmx set NAME value --path=/path/1
$ ssmx set .env --path=/path/1
$ .env > ssmx set --path=/path/1

# Remove
$ ssmx remove NAME --path=/path/1
$ ssmx rm NAME --path=/path/1

# Env
$ ssmx exec "yarn build" --path=/path/1
```

## example: Node
```ts
import * as ssmx from 'ssmx';

await ssmx.get({paths: ['/path'], recursive: true})
ssmx.sync.get(...)

await ssmx.set('NAME', 'value', {path: '/path'})
ssmx.sync.set(...)

await ssmx.remove('NAME', {path: '/path'})
ssmx.sync.remove(...)

await ssmx.exec('yarn build', {path: '/path'})
ssmx.sync.exec(...)
```
