import * as convict from 'convict'

export const config = getConfig()
config.validate({ allowed: 'strict' })

function getConfig(): convict.Config<any> {
  return convict({
    env: {
      doc: 'The deployment environment',
      format: ['live', 'local'],
      env: 'ENV',
      default: 'local'
    },
    componentName: {
      doc: 'Component name to use in metrics and logging',
      format: String,
      env: 'COMPONENT_NAME',
      default: 'hooligan-coding-challenge'
    },
    port: {
      doc: 'Port for starting the app on.',
      format: 'port',
      env: 'PORT',
      default: 8000
    },
    logLevel: {
      doc: 'Log level to start logging at.',
      format: ['debug', 'info', 'warn', 'error'],
      env: 'LOG_LEVEL',
      default: 'debug'
    },
    statsd: {
      host: {
        doc: 'StatsD server host',
        format: String,
        env: 'STATSD_HOST',
        default: 'localhost'
      },
      port: {
        doc: 'StatsD server port',
        format: 'port',
        env: 'STATSD_PORT',
        default: 8125
      }
    },
    dynamoDb: {
      endpoint: {
        default: '',
        env: 'AWS_DYNAMODB_ENDPOINT',
        format: String
      },
      tableName: {
        default: 'streamsPerUser',
        env: 'AWS_DYNAMODB_TABLE',
        format: String
      }
    }
  })
}
