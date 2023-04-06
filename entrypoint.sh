#!/bin/sh
set -e

# It is possible to overwrite configuration via environment variables.
envsubst < /usr/share/nginx/html/configuration/configuration.template.js > /usr/share/nginx/html/configuration/configuration.js

# Starg nginx
nginx -g 'daemon off;'
