# SSMX 🦾

SSMX is a CLI & NodeJS abstraction on AWS SSM that allows you to:
- Get all params saved under a given path
- Set a new param under a given path
- Delete a param from a path
- Print all params under a given path to a .env file
- Load a .env file into SSM under a given path
- Execute a command with all params in it's env under a given path
- Do all of the above synchronously (handy for scripting or in a Lambda env) or asynchronously

Examples are below, a list of all options can either be found in `--help` or
TypeScript definitions. Any questions, just submit an issue!

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

---

✈️ / [planes.studio](https://planes.studio)
