import * as express from 'express'

import { metricsMiddleware } from './middleware/metrics'
import { AppDependencyParams } from './models'

export function createRouter(options: AppDependencyParams): express.Router {
  const router = express.Router()

  router.use(metricsMiddleware(options.statsd))
  router.get('/', (_, res) => {
    res.send()
  })

  return router
}
