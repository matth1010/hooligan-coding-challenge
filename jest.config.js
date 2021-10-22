module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  },
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  testMatch: ['**/test/**/*\\.(spec)\\.(ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  transformIgnorePatterns: ['/node_modules/'],
  preset: 'ts-jest'
}
