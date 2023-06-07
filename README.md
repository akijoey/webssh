# WebSSH

[![license][license-image]][license-url]

A web based ssh client.

## Principle

```
+---------+     http     +--------+    ssh    +------------+
| browser | <==========> | webssh | <=======> | ssh server |
+---------+   websocket  +--------+    ssh    +------------+
```

## Deploy

Install dependencies.

`$ yarn install --production`

Start service.

`$ yarn serve`

## Docker

Build image.

`$ docker build -t webssh .`

Run container.

`$ docker run -d -p 8022:8022 --name webssh webssh`

## Features

- Password authentication supported.
- Private key authentication supported.
- Preference settings supported.
- Fullscreen terminal supported.
- $TERM `xterm-256color` supported.
- Search bar supported.
- Modern browsers supported.

## License

[MIT][license-url] © AkiJoey

[license-image]: https://img.shields.io/github/license/akijoey/webssh
[license-url]: https://github.com/akijoey/webssh/blob/main/LICENSE
