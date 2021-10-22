import { config } from './infra/config'
import { statsd } from './infra/statsd'
import { logger } from './infra/logger'
import { createApp } from './app'
import { AppDependencyParams } from './models'
import { createStorageService } from './services/storage-service'

const dependencies: AppDependencyParams = {
  config,
  logger,
  statsd,
  storageService: createStorageService(config)
}

const { startApp } = createApp(dependencies)

startApp().catch(err => {
  logger.error('Startup error', err)
  exitProcessWithError('Startup error')
})

process.on('uncaughtException', err => {
  logger.error('Uncaught exception', err)
  exitProcessWithError('Uncaught exception')
})

process.on('SIGINT', () => {
  exitProcessWithError('SIGINT received, shutting down app')
})

const exitProcessWithError = (errorMsg: string): void => {
  statsd.increment('stopped')
  logger.error('Shutting down app: ', errorMsg)
  process.exit(1)
}
