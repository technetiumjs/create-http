# TechJS | create-http

A utility for setting up [@techjs/http](https://www.npmjs.com/package/@techjs/http) projects.

## Usage

```bash
npm init @techjs/http <dir>
```

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [System Dependencies](#system-dependencies)
- [About](#about)
- [Getting Started (UNIX)](#getting-started-unix)
- [Developing](#developing)
  - [Adding a new service](#adding-a-new-service)
  - [Adding a new controller](#adding-a-new-controller)
  - [Registering the controller with the routes](#registering-the-controller-with-the-routes)
  - [Accessing our new route](#accessing-our-new-route)

## Installation

Run the [@techjs/http](https://www.npmjs.com/package/@techjs/create-http) generator to get started.

```bash
npm init @techjs/http <dir>
```

### System Dependencies

- [NodeJS](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/get-npm)

## About

The TechJS framework aims to provide a structured input event listener pattern by enforcing the principle of separation of concerns. The result is a clearly defined routes, controllers, and services. Through the power of object oriented programming, the [@techjs/core](https://www.npmjs.com/package/@techjs/core) library can be extended to provide a familiar interface between HTTP events and other application-layer input protocols, like event bus messages.

> **Warning**
>
> This example requires a bash environment. Using [Bash on Windows](https://docs.microsoft.com/en-us/windows/wsl/install-win10) or a console emulator like [cmder](http://cmder.net/) should be fine. Alternatively, you can edit the npm scripts in the `package.json` file to work in your environment.

## Developing

You will likely want more then just a ping server. Let's add a hashing service together to familiarize ourselves with creating new controllers, services, and routes. Once we are done, we will have a new route that will accept a url encoded string to hash given an algorithm specified in the URL path.

### Adding a new service

```typescript
// src/services/hash-service.ts

import * as crypto from 'crypto';

export class HashService {
  public async hash(algo: string, data: string | Buffer): Promise<string> {
    return new Promise<string>(
      (resolve, reject) => {
        const hash = crypto.createHash(algo);
        hash.on('readable', () => {
          const data: Buffer = <Buffer>hash.read();
          if (data) {
            resolve(data.toString('hex'));
          }
        });
        hash.on('error', (error) => {
          reject(error);
        });
        hash.write(data);
        hash.end();
      },
    );
  }
}
```

> **Note**
>
> We will want to export this serice from the `src/services/` directory by adding an export statement in the `src/services/index.ts` file.

### Adding a new controller

```typescript
// src/controllers/hash.controller.ts

import { HttpController } from '@techjs/http';
import { Resolve } from 'tsnode-di';
import { HashService } from '../services';

export class HashController extends HttpController {
  @Resolve(HashService)
  private hash_service!: HashService;
  public async hash(): Promise<void> {
    try {
      const algo: string = this.req.params.algo;
      const data: string = this.req.query.data;
      const response: string = await this.hash_service.hash(algo, data);
      this.res.send(response);
    } catch (e) {
      this.res.sendStatus(500);
    }
  }
}
```

> **Note**
>
> We will want to export this controller from the `src/controllers/` directory by adding an export statement in the `src/controllers/index.ts` file.

### Registering the controller with the routes

```typescript
// src/routes.ts

import { HttpRoute } from '@techjs/http';

// controllers

import {
  HashController,
  PingController,
} from './controllers/';

// routes

export const routes: Array<HttpRoute<any>> = [
  new HttpRoute('/ping', 'get', PingController, 'ping'),
  new HttpRoute('/hash/:algo', 'get', HashController, 'hash'),
];
```

### Accessing our new route

We are now ready to run our server. We should have exposed a route at `/hash/:algo`. The HashController will hash any string passed to the `data` query parameter. Let's see what some requests look like

```bash
$ curl -G -X GET http://localhost:3000/hash/md5 --data-urlencod 'data=hello world'
5eb63bbbe01eeed093cb22bb8f5acdc3
$ curl -G -X GET http://localhost:3000/hash/sha256 --data-urlencod 'data=hello world'
b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
$ curl -G -X GET http://localhost:3000/hash/foo --data-urlencod 'data=hello world'
Internal Server Error
```
