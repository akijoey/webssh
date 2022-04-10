import http from 'http'
import { Server, Socket } from 'socket.io'
import { Client, ConnectConfig, PseudoTtyOptions, ClientChannel } from 'ssh2'

import { logger, note, newline } from './logger'

interface Config extends ConnectConfig {
  id: string
  host: string
}

const window: PseudoTtyOptions = {
  term: 'xterm-256color'
}

const connection = (socket: Socket): void => {
  const streams: Map<string, ClientChannel> = new Map()

  const { address } = socket.handshake
  logger.info(`Connect to ${address}`)

  socket
    .on('disconnect', reason => {
      logger.warn(`Disconnected from ${address}: ${reason}`)
    })
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
              socket.emit(id, note.error(newline + err.message))
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
          const message = `Disconnected from ${host}`
          socket.emit(id, note.info(newline + message))
          socket.removeAllListeners(id)
          streams.delete(id)
        })
        .on('error', err => {
          socket.emit(id, note.error(newline + err.message))
        })
        .connect(config)
    })
}

const createSocket = (server: http.Server): void => {
  new Server(server, {
    cors: { origin: '*' }
  }).on('connection', connection)
}

export { createSocket }
