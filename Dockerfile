FROM node:20-alpine
ENV NODE_OPTIONS="--max-old-space-size=2048"
WORKDIR /usr/src/app
COPY server .
RUN npm install
COPY certs /etc/ssl/certs/
CMD ["npm", "start"]