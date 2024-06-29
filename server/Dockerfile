FROM node:20-alpine
ENV NODE_OPTIONS="--max-old-space-size=2048"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]