FROM node:12-alpine
LABEL maintainer "christiangelone@gmail.com"

ENV PORT 3333
ENV API_NAME "CVLinked"
ENV NODE_ENV "development"

WORKDIR /app

COPY . /app
RUN npm install

EXPOSE ${PORT}
CMD [ "npm", "run dev" ]
