import * as express from 'express'

import { metricsMiddleware } from './middleware/metrics'
import { AppDependencyParams } from './models'

export function createRouter({
  statsd,
  storageService,
  logger
}: AppDependencyParams): express.Router {
  const router = express.Router()

  router.use(metricsMiddleware(statsd))
  router.get('/user/:userID', async (req, res) => {
    try {
      const { userID } = req.params
      const streams = await storageService.getUserStreams(userID)
      const maxNumberOfStreams = 3
      if (streams >= maxNumberOfStreams) {
        statsd.increment(`max_quota_reached`)
        statsd.increment(`max_quota_reached:${userID}`)
        res.status(429).send({
          error: `Sorry, the maximum number of streams to watch at the same time are ${maxNumberOfStreams}`
        })
      }
      else {
        res.status(200).send()
      }
    } catch (err) {
      statsd.increment(`storage_service_error`)
      logger.error(`Error in storage service: `, err)
      res.status(502).send()
    }
  })

  return router
}
