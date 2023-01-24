#!/bin/bash
#
#
docker build -f Dockerfile.local -t yti-datamodel-ui . --build-arg NPMRC
