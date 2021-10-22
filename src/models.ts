import { Config } from 'convict'
import { StatsD } from 'node-statsd'

export type AppDependencyParams = {
  config: Config<any>
  statsd: StatsD
}
