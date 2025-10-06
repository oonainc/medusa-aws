import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import fs from 'fs'

loadEnv(process.env.NODE_ENV || 'development', process.cwd());
const knexSslConnection = process.env.NODE_ENV == 'production' ? {
  connection: {
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync('/usr/local/share/ca-certificates/rds-global-bundle.crt')
    }
  }
} : {};

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_WRITE_URL || '',
    http: {
      storeCors: process.env.STORE_CORS || "https://cdn.sabrefoxx.com",
      adminCors: process.env.ADMIN_CORS || "http://localhost:5173,https://store-api.sabrefoxx.com",
      authCors: process.env.AUTH_CORS || "http://localhost:5173,http://localhost:4200,https://store-api.sabrefoxx.com,https://cdn.sabrefoxx.com",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    redisUrl: process.env.REDIS_URL,
    databaseDriverOptions: { // goes straight into kenx
      ...knexSslConnection,
      replication: {
        write: { connection: process.env.DATABASE_WRITE_URL },
        read: [{ connection: process.env.DATABASE_READ_URL }],
      },
      pool: {
        min: 0, // so it doesn't prevent aurora cluster from scaling to zero
        max: 500, // let it correspond to 60% of aurora cluster's max_connections
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000
      },
    }
  },
  modules: [{
    resolve: "@medusajs/medusa/cache-redis",
    options: {
      redisUrl: process.env.REDIS_URL || '',
    },
  }, {
    resolve: "@medusajs/medusa/event-bus-redis",
    options: {
      redisUrl: process.env.REDIS_URL || '',
    },
  }, {
    resolve: "@medusajs/medusa/workflow-engine-redis",
    options: {
      redis: {
        url: process.env.REDIS_URL || '',
      },
    },
  }, {
    resolve: "@medusajs/medusa/file",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/file-s3",
          id: "s3",
          options: {
            file_url: 'https://cdn.sabrefoxx.com/uploads',
            region: 'eu-west-3',
            bucket: 'oonainc-luxury-store',
            endpoint: 'https://s3.eu-west-3.amazonaws.com/uploads',
            // @TODO we would stop using iam user for this and prefer iam roles instead
            access_key_id: process.env.S3_USER_ACCESS_KEY || '',
            secret_access_key: process.env.S3_USER_SECRET_ACCESS_KEY || ''
          },
        },
      ],
    }
  }],
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || ''
  }
})
