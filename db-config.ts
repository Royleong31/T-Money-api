import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
require('typeorm');

config({
  path: process.env.SECRET_PATH || process.env.ENV_FILE || '.env',
  override: true,
});

let entities = [process.cwd() + '/src/entities/*.entity{.ts,.js}'];
let migrations = [process.cwd() + '/migrations/*{.ts,.js}'];

if (process.env.TYPEORM_COMPILED === 'true') {
  // Compiled version does not use typescript
  entities = [process.cwd() + '/dist/libs/common/**/*.entity.js'];
  migrations = [process.cwd() + '/dist/migrations/*.js'];
}

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  namingStrategy: new SnakeNamingStrategy(),
  entities: entities,
  migrations: migrations,
});
