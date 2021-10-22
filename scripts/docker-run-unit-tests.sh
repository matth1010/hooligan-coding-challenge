#!/bin/bash -e
OPTS="-p $(basename $PWD)"

if [ "$JOB_NAME" != "" ]; then
   OPTS="-p $JOB_NAME"
fi

docker-compose $OPTS build web
docker-compose $OPTS run --no-deps --rm web npm test
