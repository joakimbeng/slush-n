# slush-n

[![Build status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url] [![XO code style][codestyle-image]][codestyle-url]

> A Slush generator for creating Node modules

## Installation

Install `slush-n` globally and it's peers: `slush` using [npm](https://www.npmjs.com/):

```bash
npm install -g slush slush-n
```

## Usage

Create a project folder:

```bash
mkdir my-module
```

Then run `slush-n` in it:

```bash
cd my-module && slush n
```

## What you'll get

* A configured `.travis.yml` file for [Travis](https://travis-ci.org/) builds
* An [`.editorconfig`](http://editorconfig.org/) and [XO](https://github.com/sindresorhus/xo) for consistent code style
* [AVA](https://ava.li) for awesome testing

You'll also get a simple folder structure:

```
├── src/    # Put module code here
└── test/   # Put test code here
```

### No gulp?

Yes, that's right! I favor using npm scripts instead. It has saved me many hours in comparison to gulp and grunt. See [How to Use npm as a Build Tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) for a good intro to npm scripts.

## License

MIT © [Joakim Carlstein](http://joakim.beng.se/)

[npm-url]: https://npmjs.org/package/slush-n
[npm-image]: https://badge.fury.io/js/slush-n.svg
[travis-url]: https://travis-ci.org/joakimbeng/slush-n
[travis-image]: https://travis-ci.org/joakimbeng/slush-n.svg?branch=master
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-XO-5ed9c7.svg?style=flat
