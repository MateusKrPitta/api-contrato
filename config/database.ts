import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'pg',
  connections: {
    pg: {
      client: 'pg',
      connection: {
        // DADOS FIXOS DO RAILWAY - substitua com seus valores reais
        host: 'containers-us-212-1.railway.app', // seu RAILWAY_PRIVATE_DOMAIN
        port: 5432,
        user: 'postgres',
        password: 'ZWlrXliDmpcOSxOMCpTapfhnnQqePtqH',
        database: 'railway',
        ssl: {
          rejectUnauthorized: false,
        },
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
