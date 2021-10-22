import { config } from './infra/config'
import { statsd } from './infra/statsd'
import { log } from './infra/logger'
import { createApp } from './app'
import { AppDependencyParams } from './models'

const dependencies: AppDependencyParams = {
  statsd,
  config
}

const { startApp } = createApp(dependencies)

startApp().catch(err => {
  log.error('Startup error', err)
  exitProcessWithError('Startup error')
})

process.on('uncaughtException', err => {
  log.error('Uncaught exception', err)
  exitProcessWithError('Uncaught exception')
})

process.on('SIGINT', () => {
  exitProcessWithError('SIGINT received, shutting down app')
})

const exitProcessWithError = (errorMsg: string): void => {
  statsd.increment('stopped')
  log.error('Shutting down app: ', errorMsg)
  process.exit(1)
}
