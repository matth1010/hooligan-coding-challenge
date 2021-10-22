import * as request from 'supertest'
import { config } from '../../src/infra/config'
import { logger } from '../../src/infra/logger'
import { statsd } from '../../src/infra/statsd'
import { createApp } from '../../src/app'
import { AppDependencyParams } from '../../src/models'
import { StatsD } from 'node-statsd'

const createRequest = (dependencies: AppDependencyParams) => {
  const { app } = createApp(dependencies)
  return request(app)
}

const createDependencies = (getUserStreams, overrides = {}) => {
  return {
    statsd,
    config,
    logger,
    ...overrides,
    storageService: {
      getUserStreams
    }
  }
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

describe('routes', () => {
  it.each([1, 2, 3])(
    'should return 200 for %s streams for an user',
    (streams: number) => {
      const getUserStreams = jest.fn(() => streams)
      const dependencies = createDependencies(getUserStreams)
      const request = createRequest(dependencies)
      return request
        .get('/')
        .expect(200)
        .then((response: request.Response) => {
          expect(response.error).toBe(false)
          expect(response.body).toEqual({})
        })
    }
  )

  it('should return 404 for any other route', () => {
    const getUserStreams = jest.fn()
    const dependencies = createDependencies(getUserStreams)
    const request = createRequest(dependencies)
    return request.get('/fake').expect(404)
  })

  it('should return 429 when the when user consuming more than 3 contents', () => {
    const getUserStreams = jest.fn(() => 4)
    const dependencies = createDependencies(getUserStreams, {
      statsd: getFakeStatsd()
    })
    const request = createRequest(dependencies)
    return request
      .get('/')
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
      })
  })

  it.todo('should increment the metric count and log when receiving AWS errors')
})
