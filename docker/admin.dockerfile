FROM node:24-alpine
WORKDIR /nestjs
COPY nestjs/package.json .
COPY nestjs/package-lock.json .
COPY nestjs/turbo.json .
COPY nestjs/tsconfig.json .
COPY nestjs/nest-cli.json .
RUN npm install
CMD ["sh", "-c", "npm run $APP:dev"]