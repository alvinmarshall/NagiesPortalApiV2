export interface DatabaseConfig {
  name: string
  type: string
  database: string
  username: string
  password: string
  host: string
  port: number
  synchronize: boolean
  entities: string[]
  logging: boolean
  dropSchema: boolean
  migrations:  string[]
  migrationsRun: boolean
  migrationsTableName: string
  subscribers:  string[]
  cli: any
}

export interface JWTConfig {
  secret: string
  expiresIn: number
  refresh: number
  issuer: string
  audience: string
}