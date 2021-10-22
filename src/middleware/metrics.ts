import * as connectDatadog from 'connect-datadog'
import * as statsd from 'node-statsd'

export function metricsMiddleware(statsd: statsd.StatsD): () => void {
  const datadogOptions = {
    dogstatsd: statsd,
    response_code: true,
    stat: 'web'
  }
  return connectDatadog(datadogOptions)
}
