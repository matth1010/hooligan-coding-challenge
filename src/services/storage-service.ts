import * as DynamoDB from 'aws-sdk/clients/dynamodb'
import { Config } from 'convict'
import { StorageService } from '../models'

export const createStorageService = (config: Config<any>): StorageService => {
  const endpoint = config.get('dynamoDb.endpoint')
  const table = config.get('dynamoDb.endpoint')
  const dynamoConfig = {
    apiVersion: '2012-08-10',
    ...(endpoint && { endpoint })
  }
  const docClient = new DynamoDB.DocumentClient(dynamoConfig)

  const getUserStreams = async (userID: string): Promise<number> => {
    const params = { TableName: table, Key: { userID } }
    const result = await docClient.get(params).promise()
    return result.Item.userID
  }

  return { getUserStreams }
}
