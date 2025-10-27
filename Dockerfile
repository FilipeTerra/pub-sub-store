FROM node:14.16.1-alpine3.10 AS base
WORKDIR /var/www/

FROM base AS contact-service
ADD  services/contact/ .
RUN npm config set strict-ssl false && npm install --only=production
CMD [ "node", "app.js" ]

FROM base AS order-service
ADD  services/order/ .
RUN npm config set strict-ssl false && npm install --only=production
CMD [ "node", "app.js" ]

FROM base AS shipping-service
ADD  services/shipping/ .
RUN npm config set strict-ssl false && npm install --only=production
CMD [ "node", "app.js" ]

FROM base AS report-service
ADD  services/report/ .
RUN npm config set strict-ssl false && npm install --only=production
CMD [ "node", "app.js" ]