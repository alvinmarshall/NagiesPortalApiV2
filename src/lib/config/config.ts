export const config = () => ({
  db: {
    name: 'default',
    type: process.env.DIALECT || 'mysql',
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    synchronize: JSON.parse(process.env.DATABASE_SYNC) || false,
    entities: ['dist/**/*.entity{.ts,.js}'],
    logging: JSON.parse(process.env.DATABASE_LOG) || false,
    dropSchema: JSON.parse(process.env.DATABASE_DROP) || false,
    migrations: ['dist/migration/*{.ts,.js}'],
    migrationsRun: JSON.parse(process.env.DATABASE_MIGRATE) || false,
    migrationsTableName: 'custom_migration_table',
    subscribers: ['dist/subscriber/*{.ts,.js}'],
    cli: {
      entitiesDir: 'dist/entities',
      migrationsDir: 'dist/migration',
      subscribersDir: 'dist/subscriber',
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE,
    refresh: process.env.JWT_EXPIRE_REFRESH,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  },

  env: process.env.NODE_ENV || 'development',


  port: parseInt(process.env.PORT, 10) || 8888,
});
