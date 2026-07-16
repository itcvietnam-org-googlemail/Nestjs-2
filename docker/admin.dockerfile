# Base
FROM node:24-alpine AS base
WORKDIR /nestjs

# Dev
FROM base AS development
COPY nestjs/package.json .
COPY nestjs/package-lock.json .
COPY nestjs/turbo.json .
COPY nestjs/tsconfig.json .
COPY nestjs/nest-cli.json .
ENV NODE_ENV=development
RUN npm install
CMD ["sh", "-c", "npm run admin:dev"]

# Build
FROM base AS build
COPY nestjs/src src
COPY nestjs/package.json .
COPY nestjs/package-lock.json .
COPY nestjs/turbo.json .
COPY nestjs/tsconfig.json .
COPY nestjs/nest-cli.json .
RUN npm install
RUN npm run admin:build

# Production
FROM base AS production
COPY --from=build /nestjs/node_modules node_modules
COPY --from=build /nestjs/src/apps/admin/dist dist
COPY --from=build /nestjs/package.json .
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]