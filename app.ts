import Koa from 'koa'
import http from 'http'
import staticMiddleware from 'koa-static'
import { Server, Socket } from 'socket.io'
import { Client, ConnectConfig, PseudoTtyOptions, ClientChannel } from 'ssh2'
import chalk from 'chalk'

const info = (host: string, message: string, status: boolean): string => {
  const color = status ? 32 : 31
  const sign = status ? '√' : '×'
  return `\x1b[36m${host}\x1b[1;${color}m ${message} ${sign}\x1b[0m\r\n`
}

const logger = (message: string) => {
  const time = new Date().toISOString()
  console.log(`[${chalk.green(time)}] ${message}`)
}

interface Config extends ConnectConfig {
  id: string
  host: string
}

const connection = (socket: Socket): void => {
  const streams: Map<string, ClientChannel> = new Map()
  const window: PseudoTtyOptions = {
    term: 'xterm-256color'
  }

  const { address } = socket.handshake
  logger(`Connect to client ${address}: ${chalk.green('successfully')}`)

  socket
    .on('resize', ({ rows, cols, height, width }) => {
      streams.forEach(stream => {
        stream.setWindow(rows, cols, height, width)
      })
    })
    .on('shell', (config: Config) => {
      const { id, host } = config
      const ssh = new Client()
      ssh
        .on('ready', () => {
          ssh.shell(window, (err, stream) => {
            if (err !== undefined) {
              socket.emit(id, info(host, err.message, false))
              ssh.end()
              return
            }
            stream
              .on('data', (data: any) => {
                socket.emit(id, data.toString('utf8'))
              })
              .on('close', () => ssh.end())
            streams.set(id, stream)
            socket
              .on(id, data => {
                stream.write(data)
              })
              .emit('connected')
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
    .on('disconnect', reason => {
      reason = chalk.yellow(reason)
      logger(`Disconnected from ${address}: ${reason}`)
    })
}

function serve(): void {
  const app = new Koa()
  app.use(staticMiddleware('dist'))
  const server = http.createServer(app.callback())
  const io = new Server(server, {
    cors: { origin: '*' }
  })
  io.on('connection', connection)
  // server listen
  const host = process.env.HOST ?? '127.0.0.1'
  const port = Number(process.env.PORT ?? 8022)
  server.listen(port, host, () => {
    logger(
      `Server is running at ${chalk.blueBright.underline(
        `http://${host}:${port}`
      )}`
    )
  })
  // signal handle
  const signals = ['SIGINT', 'SIGTERM']
  signals.forEach(signal => {
    process.on(signal, () => {
      server.close()
      logger('Server has been closed')
      process.exit()
    })
  })
}

if (require.main === module) {
  serve()
}
