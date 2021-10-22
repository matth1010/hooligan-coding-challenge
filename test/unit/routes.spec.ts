import * as request from 'supertest'
import { config } from '../../src/infra/config'
import { statsd } from '../../src/infra/statsd'
import { createApp } from '../../src/app'
import { AppDependencyParams } from '../../src/models'

const dependencies: AppDependencyParams = {
  statsd,
  config
}

const createRequest = () => {
  const { app } = createApp(dependencies)
  return request(app)
}

describe('routes', () => {
  it('should return 200 for GET to the homepage', () => {
    const request = createRequest()
    return request
      .get('/')
      .expect(200)
      .then((response: request.Response) => {
        expect(response.error).toBe(false)
        expect(response.body).toEqual({})
      })
  })

  it('should return 404 for any other route', () => {
    const request = createRequest()
    return request
      .get('/fake')
      .expect(404)
  })

  it.todo('should return 429 when the when user consuming more than 3 contents')
})
