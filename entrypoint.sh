#!/bin/sh
set -e

# It is possible to overwrite configuration via environment variables.
envsubst < /usr/share/nginx/html/configuration/configuration.template.js > /usr/share/nginx/html/configuration/configuration.js
envsubst '${DATAMODEL_API_URL},${MESSAGING_API_URL}' < /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf

# Start nginx
nginx -g 'daemon off;'
