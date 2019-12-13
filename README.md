# cenote-api

>API server & web client used by [cenote-vital](https://github.com/AuthEceSoftEng/cenote-vital)

[![Travis](https://img.shields.io/travis/com/AuthEceSoftEng/cenote-api.svg?style=flat-square&logo=travis&label=)](https://travis-ci.com/AuthEceSoftEng/cenote) [![license](https://img.shields.io/github/license/AuthEceSoftEng/cenote-api.svg?style=flat-square)](./LICENSE)

## Quick Start

* Install [gcc](https://gcc.gnu.org/)
* Install [librdkafka-dev](https://github.com/edenhill/librdkafka)

* Install dependencies:

```bash
$ npm i
```

* Start mongo deamon:

```bash
$ mongod
```

### Development

```bash
$ npm run dev
```

### Production

```bash
$ npm run build && npm start
```

### Docker

```bash
$ docker-compose build
$ docker-compose up
```

#### Test

```bash
$ npm run lint
$ npm run test
```
