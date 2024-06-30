FROM node:20-alpine
ENV NODE_OPTIONS="--max-old-space-size=2048"
WORKDIR /usr/src/app
COPY server/package*.json ./
RUN npm install
COPY server .
COPY certs ./etc/ssl/certs/
CMD ["npm", "start"]