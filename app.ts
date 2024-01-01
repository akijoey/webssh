import Koa from 'koa'
import http from 'http'
import assets from 'koa-static'
import Router from 'koa-router'

import { createSocket } from './lib/socket'
import { logger, note } from './lib/logger'
import banner, { motd } from './lib/banner'

const app = new Koa()
const router = new Router()

router.get('/motd', ctx => {
  ctx.body = banner + motd
})

// logger
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  logger.info(note.reset(`${ctx.method} ${ctx.url} - ${ms}ms`))
})

// cors
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
  )
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  if (ctx.method === 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
})

app.use(assets('dist'))
app.use(router.routes())

function serve(): void {
  const server = http.createServer(app.callback())
  createSocket(server)
  // server listen
  const host = process.env.HOST ?? '0.0.0.0'
  const port = Number(process.env.PORT ?? 8022)
  const url = note.blueBright.underline(`http://${host}:${port}`)
  server.listen(port, host, () => {
    logger.log(banner)
    logger.info(`Server is running at ${url}`)
  })
  // signal handle
  const signals = ['SIGINT', 'SIGTERM']
  signals.forEach(signal => {
    process.on(signal, () => {
      server.close()
      logger.warn('Server has been closed')
      process.exit()
    })
  })
}

if (require.main === module) {
  serve()
}
