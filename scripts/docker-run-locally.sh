#!/bin/bash

OPTS="-p $(basename $PWD)"

if [ "$JOB_NAME" != "" ]; then
   OPTS="-p $JOB_NAME"
fi

docker-compose $OPTS build web
docker-compose $OPTS down
docker-compose $OPTS run --rm wait
docker-compose $OPTS run --rm --service-ports -d --name datadog datadog
docker-compose $OPTS run --rm seed-dynamoDB
docker-compose $OPTS run --rm --service-ports --no-deps web
