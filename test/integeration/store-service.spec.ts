import { config } from '../../src/infra/config'
import { createStorageService } from '../../src/services/storage-service'
import { StorageService } from '../../src/models'

describe('store service', () => {
  let storageService: StorageService
  beforeAll(() => {
    storageService = createStorageService(config)
  })
  it('should handle correctly when user is found', async () => {
      const result = await storageService.getUserStreams("1")
      expect( result).toEqual(2)
  })
  it('should handle correctly when user is not found', async () => {
    const result = await storageService.getUserStreams("fake")
    expect( result).toEqual(0)
})
})
