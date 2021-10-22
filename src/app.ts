import * as express from 'express'
import * as morgan from 'morgan'
import * as http from 'http'
import { log } from './infra/logger'
import { createRouter } from './routes'
import { AppDependencyParams } from './models'
import { AddressInfo } from 'net'

type AppServer = {
  app: express.Application
  server: http.Server
}

export const createApp = (appDependencies: AppDependencyParams) => {
  const app: express.Application = express()
  const router = createRouter(appDependencies)

  const format =
    '{' +
    '"httpMethod":":method",' +
    '"httpPath":":url",' +
    '"httpStatus"::status,' +
    '"user-agent":":user-agent"' +
    '}'

  app.use(morgan(format))
  app.use('/', router)
  app.all('*', (_, res) => {
    res.sendStatus(404)
  })

  app.use((err, req, res, _) => {
    const loggerMessage = {
      status: 'Express error caught',
      error: err,
      intelEvent: req.body
    }
    log.error(JSON.stringify(loggerMessage))
    appDependencies.statsd.increment('error')
    res.sendStatus(500)
  })

  const startApp = async (): Promise<AppServer> => {
    return new Promise<AppServer>(resolve => {
      const server = app.listen(appDependencies.config.get('port'), () => {
        log.info(`Started on port ${(server.address() as AddressInfo).port}`)
        return resolve()
      })
    })
  }

  return { app, startApp }
}
