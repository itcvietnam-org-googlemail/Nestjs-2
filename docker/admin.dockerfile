# Base
FROM node:24-alpine AS base
WORKDIR /nestjs

# Development
FROM base AS development
COPY nestjs/src src
COPY nestjs/package.json .
COPY nestjs/package-lock.json .
COPY nestjs/turbo.json .
COPY nestjs/tsconfig.json .
COPY nestjs/nest-cli.json .
ENV NODE_ENV=development
RUN npm install
CMD ["sh", "-c", "npm run admin:dev"]

# START PRODUCTION DOCKER

# Prune
FROM base AS prune
COPY nestjs/src src
COPY nestjs/package.json .
COPY nestjs/package-lock.json .
COPY nestjs/turbo.json .
COPY nestjs/tsconfig.json .
COPY nestjs/nest-cli.json .
RUN npx turbo prune @app/admin --docker

# Install
FROM base AS install
COPY --from=prune /nestjs/out/json/ .
RUN npm ci

# Build
FROM base AS build
COPY nestjs/tsconfig.json .
COPY nestjs/nest-cli.json .
COPY --from=prune /nestjs/out/full/ .
COPY --from=install /nestjs/node_modules node_modules
RUN npx turbo run build --filter=@app/admin

# Production
FROM base AS production
COPY --from=prune /nestjs/out/json/ .
COPY --from=install /nestjs/node_modules node_modules
COPY --from=build /nestjs/dist dist
CMD ["node", "dist/admin/main.js"]

# END PRODUCTION DOCKER

# Build (Backup)
FROM base AS build-backup
COPY nestjs/src src
COPY nestjs/package.json .
COPY nestjs/package-lock.json .
COPY nestjs/turbo.json .
COPY nestjs/tsconfig.json .
COPY nestjs/nest-cli.json .
RUN npm install
RUN npm run admin:build

# Production (Backup)
FROM base AS production-backup
COPY --from=build /nestjs/node_modules node_modules
COPY --from=build /nestjs/dist dist
COPY --from=build /nestjs/package.json .
ENV NODE_ENV=production
CMD ["node", "dist/admin/main.js"]