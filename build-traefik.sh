#!/bin/bash
#
#
docker build -f Dockerfile.traefik -t yti-datamodel-ui . --build-arg NPMRC
