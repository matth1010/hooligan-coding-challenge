import * as winston from 'winston'
import { config } from './config'

const createLogger = (): winston.Logger =>
  winston.createLogger({
    level: config.get('logLevel'),
    format: winston.format.json(),
    defaultMeta: { service: config.get('componentName') },
    transports: [new winston.transports.Console()]
  })

export let log = createLogger()

export const setLogger = (newLogger: winston.Logger) => {
  log = newLogger
}
