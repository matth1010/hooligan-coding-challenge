#!/bin/bash -e
OPTS="-p $(basename $PWD)"

if [ "$JOB_NAME" != "" ]; then
   OPTS="-p $JOB_NAME"
fi

docker-compose $OPTS build web
docker-compose $OPTS down
docker-compose $OPTS run --rm wait
docker-compose $OPTS run --rm --service-ports -d --name datadog datadog
docker-compose $OPTS run --rm create-storage
docker-compose $OPTS run --rm --service-ports --no-deps web npm run seed-storage
docker-compose $OPTS run --no-deps --rm web npm test
