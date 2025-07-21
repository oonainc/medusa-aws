import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import fs from 'fs'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_WRITE_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:4200,/sabrefoxx\.com$/",
      adminCors: process.env.ADMIN_CORS || "http://localhost:5173,/sabrefoxx\.com$/",
      authCors: process.env.AUTH_CORS || "http://localhost:5173,http://localhost:4200,/sabrefoxx\.com$/",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    // redisUrl: process.env.REDIS_URL,
    databaseDriverOptions: { // goes straight into kenx
      connection: {
        ssl: {
          rejectUnauthorized: true,
          ca: fs.readFileSync('/usr/local/share/ca-certificates/rds-global-bundle.crt')
        }
      },
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
    },
  }
})
