#!/bin/sh
set -e

# It is possible to overwrite configuration via environment variables.
envsubst < /usr/share/nginx/html/configuration/configuration.template.js > /usr/share/nginx/html/configuration/configuration.js
envsubst '${DATAMODEL_API_URL},${MESSAGING_API_URL}' < /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf

DATAMODEL_BASE_HREF=$ANGULAR_DATAMODEL_BASE_HREF
if [[ $DATAMODEL_BASE_HREF != */ ]] # * is used for pattern matching
then
  DATAMODEL_BASE_HREF="${DATAMODEL_BASE_HREF}/";
fi

sed -i 's#<base href="/">#<base href="'"${DATAMODEL_BASE_HREF}"'">#' /usr/share/nginx/html/index.html

# Start nginx
nginx -g 'daemon off;'
