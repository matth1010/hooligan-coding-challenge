import * as express from 'express'

import { metricsMiddleware } from './middleware/metrics'
import { AppDependencyParams } from './models'
import { logger } from './infra/logger'

export function createRouter({
  statsd,
  storageService
}: AppDependencyParams): express.Router {
  const router = express.Router()

  router.use(metricsMiddleware(statsd))
  router.get('/user/:userID', async (req, res) => {
    try {
      const { userID } = req.params
      const streams = await storageService.getUserStreams(userID)
      const maxNumberOfStreams = 3
      if (streams > maxNumberOfStreams) {
        statsd.increment(`max_quota_reached`)
        statsd.increment(`max_quota_reached:${userID}`)
        res.status(429).send({
          error: `Sorry, the maximum number of streams to watch at the same time are ${maxNumberOfStreams}`
        })
      } else {
        res.send()
      }
    } catch (err) {
      statsd.increment(`storage_service_error`)
      logger.error(`Error in storage service: `, err)
      res.status(502)
    }
  })

  return router
}
