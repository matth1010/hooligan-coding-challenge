import { Config } from 'convict'
import { StatsD } from 'node-statsd'
export interface StorageService {
  getUserStreams: (userID: string) => Promise<number>
}

export type AppDependencyParams = {
  config: Config<any>
  logger: AppLogger
  statsd: StatsD
  storageService: StorageService
}

export interface AppLogger {
  debug(message: string, ...meta: any[]): void
  info(message: string, ...meta: any[]): void
  warn(message: string, ...meta: any[]): void
  error(message: string, ...meta: any[]): void
}
