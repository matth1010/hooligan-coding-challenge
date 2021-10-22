# Hooligan Coding Challenge

Build a service in Node.js that exposes an API which can be consumed from any client. This service must check how many video streams a given user is watching and prevent a user watching more than 3 video streams concurrently.


## Running the app locally

Checkout the project in GitHub, then run the following commands in the root directory:

```
./scripts/docker-run-locally.sh
```

## Running tests

```
nvm use
npm run test
```
or in a CI environment

```
./scripts/docker-run-unit-tests.sh
```

## Architecture

- NodeJS stateless service
- DynamoDB database
- Logging and metrics: Datadog

## Endpoints

- The only available endpoint is `/user/:userID` which returns:
    - `200` if the has streams
    - `200` if there are not streams for the user provided
    - `404` if no user is provided
    - `429` if user is watching 3 or more streams
    - `502` if connection with the `storage service` fails

- Valid user: http://localhost:8000/user/1
- Quota exceeded user: http://localhost:8000/user/2
- Non existing user: http://localhost:8000/user/3

## Deployment

- A `Dockerfile` is provided which could be deployed using `ECS` or any other service
- A `dist` folder is provided by running `npm run build` containing a full node + express app.

For the application to work the following env variables MUST be provided (see more in `./src/infra/config.ts`):

```
      - ENV: Enviroment for the app (local, prod, ...)
      - LOG_LEVEL: The desired log level
      - PORT: The port where the app will run
      - STATSD_HOST: The host for the metrics service
      - STATSD_PORT: The port for the metrics service
      - AWS_ACCESS_KEY_ID: Access key for AWS
      - AWS_SECRET_ACCESS_KEY: Secrete key for AWS
      - AWS_REGION: Region for AWS
```

In addition for local development to mock `DynamoDB` the env variable `AWS_DYNAMODB_ENDPOINT` could be provided.

## Scalability

- DynamoDB

Capacity can be adjusted accordingly. DynamoDB is also designed for scalability of resources to meet storage and throughput requirements.

- ECS

It has automatic scaling which is the ability to increase or decrease the desired count of tasks in your Amazon ECS service automaticallyvely.