# Hooligan Coding Challenge

## Running the app locally (live-reloads on file changes)

Checkout the project in GitHub, then run the following commands in the root directory:

```
$ nvm use
$ npm ci
$ npm run dev
```

## Architecture

- NodeJS stateless service
- DynamoDB database
- Logging and metrics: Datadog