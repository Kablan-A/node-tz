interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  FRONTEND_BASE_URL: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  ACCESS_SECRET: string;
  ACCESS_EXPIRATION: string;
  REFRESH_SECRET: string;
  REFRESH_EXPIRATION: string;
}

export function validateEnv() {
  const requiredEnvVars: (keyof EnvConfig)[] = [
    'NODE_ENV',
    'PORT',
    'FRONTEND_BASE_URL',
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'ACCESS_SECRET',
    'ACCESS_EXPIRATION',
    'REFRESH_SECRET',
    'REFRESH_EXPIRATION',
  ];

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
  }

  console.log('All required environment variables are set.');
}
