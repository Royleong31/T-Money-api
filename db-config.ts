import { config } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';

config({
  path: process.env.SECRET_PATH || process.env.ENV_FILE || '.env',
  override: true,
});

let entities = [process.cwd() + '/src/**/*.entity{.ts,.js}'];
let migrations = [process.cwd() + '/migrations/*{.ts,.js}'];

if (process.env.TYPEORM_COMPILED === 'true') {
  // Compiled version does not use typescript
  entities = [process.cwd() + '/dist/libs/common/**/*.entity.js'];
  migrations = [process.cwd() + '/dist/migrations/*.js'];
}

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  namingStrategy: new SnakeNamingStrategy(),
  entities: entities,
  migrations: migrations,
});

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];
