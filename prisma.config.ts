import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun run prisma/seed.ts"
  },
  engine: "classic",
  datasource: {
    url: `postgresql://${env('POSTGRES_USER')}:${env('POSTGRES_PASSWORD')}@${env('DATABASE_LOCATION')}/${env('DATABASE_NAME')}`,
  },

});
