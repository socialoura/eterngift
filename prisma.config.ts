import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Prisma ORM v7 removed datasource.url/directUrl from schema.prisma.
    // Use a DIRECT connection URL for CLI commands like db push / migrate.
    url: env('POSTGRES_URL_NO_SSL'),
  },
})
