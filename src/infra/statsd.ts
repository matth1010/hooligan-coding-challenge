import { StatsD, StatsDConfig } from 'node-statsd'
import { config } from './config'

export let statsd: StatsD

const statsdConfig = buildStatsdConfig()
statsd = new StatsD(statsdConfig)

function buildStatsdConfig(): StatsDConfig {
  return {
    host: config.get('statsd.host'),
    port: config.get('statsd.port'),
    prefix: 'app.',
    global_tags: ['env:' + config.get('env')]
  }
}
