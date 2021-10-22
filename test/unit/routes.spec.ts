import * as request from 'supertest'
import { config } from '../../src/infra/config'
import { logger } from '../../src/infra/logger'
import { createApp } from '../../src/app'
import { AppDependencyParams } from '../../src/models'
import { StatsD } from 'node-statsd'

const createRequest = (dependencies: AppDependencyParams) => {
  const { app } = createApp(dependencies)
  return request(app)
}

function getFakeLogger() {
  return {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
  }
}

function getFakeStatsd(): StatsD {
  return ({
    histogram: jest.fn(),
    increment: jest.fn(),
    gauge: jest.fn()
  } as any) as StatsD
}

const createDependencies = (getUserStreams, overrides = {}) => {
  return {
    statsd: getFakeStatsd(),
    config,
    logger,
    ...overrides,
    storageService: {
      getUserStreams
    }
  }
}

describe('routes', () => {
  it.each<any>([1, 2])(
    'should return 200 for %s streams for an user',
    async (streams: number, done: jest.DoneCallback) => {
      const getUserStreams = jest.fn(() => streams)
      const dependencies = createDependencies(getUserStreams)
      return await createRequest(dependencies)
        .get('/user/1')
        .expect(200)
        .then((response: request.Response) => {
          expect(response.error).toBe(false)
          expect(response.body).toEqual({})
          done()
        })
    }
  )

  it('should return 200 when no userID is found', () => {
    const getUserStreams = jest.fn(() => undefined)
    const dependencies = createDependencies(getUserStreams)
    const request = createRequest(dependencies)
    return request.get('/user/fakeID').expect(200)
  })

  it('should return 404 for any other route', () => {
    const getUserStreams = jest.fn()
    const dependencies = createDependencies(getUserStreams)
    const request = createRequest(dependencies)
    return request.get('/fake').expect(404)
  })

  it.each<any>([3, 4])(
    'should return 429 when the when user consuming %s contents',
    async (streams: number, done: jest.DoneCallback) => {
      const getUserStreams = jest.fn(() => streams)
      const dependencies = createDependencies(getUserStreams)
      await createRequest(dependencies)
        .get('/user/1')
        .expect(429)
        .then((response: request.Response) => {
          expect(response.error).not.toBe(false)
          expect(response.body).toEqual({
            error:
              'Sorry, the maximum number of streams to watch at the same time are 3'
          })
          expect(dependencies.statsd.increment).toHaveBeenCalledWith(
            'max_quota_reached'
          )
          expect(dependencies.statsd.increment).toHaveBeenCalledWith(
            'max_quota_reached:1'
          )
          done()
        })
    }
  )

  it('should return 404 when no userID is provided', async (done: jest.DoneCallback) => {
    const getUserStreams = jest.fn()
    const dependencies = createDependencies(getUserStreams)
    await createRequest(dependencies)
      .get('/user/')
      .expect(404)
    done()
  })

  it('should return 502 and increment the metric count and log when receiving AWS errors', async (done: jest.DoneCallback) => {
    const error = new Error('fake error')
    const getUserStreams = jest.fn().mockRejectedValueOnce(error)
    const logger = getFakeLogger()
    const dependencies = createDependencies(getUserStreams, { logger })
    await createRequest(dependencies)
      .get('/user/1')
      .expect(502)
      .then((response: request.Response) => {
        expect(response.error).not.toBe(false)
        expect(response.body).toEqual({})
        expect(dependencies.statsd.increment).toHaveBeenCalledWith(
          'storage_service_error'
        )
        expect(dependencies.logger.error).toHaveBeenCalledWith(
          `Error in storage service: `, error
        )
        done()
      })
  })

})
