import * as DynamoDB from 'aws-sdk/clients/dynamodb'
import { Config } from 'convict'
import { config } from '../src/infra/config'
import { logger } from '../src/infra/logger'

export const createSeedService = (config: Config<any>) => {
  const endpoint = config.get('dynamoDb.endpoint')
  const tableName = config.get('dynamoDb.tableName')
  const dynamoConfig = {
    apiVersion: '2012-08-10',
    ...(endpoint && { endpoint })
  }
  const docClient = new DynamoDB.DocumentClient(dynamoConfig)

  const addUser = async (userID: string, streams: number): Promise<void> => {
    const params = { TableName: tableName, Item: { userID, streams } }
    await docClient.put(params).promise()
  }

  return { addUser }
}

const users = [
  {
    userID: '1',
    streams: 2
  },
  {
    userID: '2',
    streams: 4
  }
]
const seeder = createSeedService(config)

Promise.all(users.map(user => seeder.addUser(user.userID, user.streams)))
  .then(() => logger.info('Success'))
  .catch(logger.error)
