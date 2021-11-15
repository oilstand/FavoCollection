FROM node:14.18-alpine
WORKDIR /usr/src/app
COPY . .

ENV HOST 0.0.0.0

CMD ["npm", "start"]
