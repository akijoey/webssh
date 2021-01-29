import Koa from 'koa'
import http from 'http'
import events from 'events'
import staticMiddleware from 'koa-static'
import { Server as Socket } from 'socket.io'
import { Client, ConnectConfig, PseudoTtyOptions, ClientChannel } from 'ssh2'
import chalk from 'chalk'

const info = (host: string, message: string, status: boolean): string => {
  const color = status ? 32 : 31
  const sign = status ? '√' : '×'
  return `\x1b[36m${host}\x1b[1;${color}m ${message} ${sign}\x1b[0m\r\n`
}

interface Config extends ConnectConfig {
  id: string
  host: string
}

const connect = (socket: events.EventEmitter): void => {
  const streams: Map<string, ClientChannel> = new Map()
  const window: PseudoTtyOptions = {
    term: 'xterm-256color'
  }
  socket
    .on('initsize', (cols, rows) => {
      window.cols = cols
      window.rows = rows
    })
    .on('resize', ({ rows, cols, height, width }) => {
      streams.forEach(stream => {
        stream.setWindow(rows, cols, height, width)
      })
    })
    .on('connected', (config: Config) => {
      const { id, host } = config
      const ssh = new Client()
      ssh
        .on('ready', () => {
          socket.emit(id, info(host, 'Connected', true))
          ssh.shell(window, (err, stream) => {
            if (err !== undefined) {
              socket.emit(id, info(host, err.message, false))
              ssh.end()
              return
            }
            streams.set(id, stream)
            socket.on(id, data => {
              stream.write(data)
            })
            stream
              .on('data', (data: any) => {
                socket.emit(id, data.toString('utf8'))
              })
              .on('close', () => ssh.end())
          })
        })
        .on('close', () => {
          socket.emit(id, info(host, 'Disconnected', true))
          socket.removeAllListeners(id)
          streams.delete(id)
        })
        .on('error', err => {
          socket.emit(id, info(host, err.message, false))
        })
        .connect(config)
    })
    .on('disconnect', () => {
      console.log('disconnected')
    })
}

function serve(): void {
  const app = new Koa()
  app.use(staticMiddleware('dist'))
  const server = http.createServer(app.callback())
  const io = new Socket(server, {
    cors: { origin: '*' }
  })
  io.on('connection', connect)
  // server listen
  const host = process.env.HOST ?? '0.0.0.0'
  const port = Number(process.env.PORT ?? 8022)
  const url = chalk.blueBright.underline(`http://${host}:${port}`)
  server.listen(port, host, () => {
    console.log(`Server is running at ${url}`)
  })
  // signal handle
  const signals = ['SIGINT', 'SIGTERM']
  signals.forEach(signal => {
    process.on(signal, () => {
      server.close()
      console.log(chalk.greenBright.bold('Exit'))
      process.exit()
    })
  })
}

if (require.main === module) {
  serve()
}
