const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const DOCKER_COMPOSE_FILES = {
  dev: 'docker-compose.dev.yml',
  prod: 'docker-compose.prod.yml',
};

function isDockerRunning() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function createEnvLocal() {
  const envLocalPath = '.env.local';
  if (!fs.existsSync(envLocalPath)) {
    const content = `# Database Configuration
POSTGRES_DB=phase_platform
POSTGRES_USER=phase_user
POSTGRES_PASSWORD=phase_password

# Redis Configuration
REDIS_PASSWORD=phase_redis_password

# MinIO/S3 Configuration
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin`;

    fs.writeFileSync(envLocalPath, content);
    console.log('Created .env.local with default values');
  }
}

function showServiceInfo() {
  console.log('\nServices available at:\n');
  console.log('[Database Services]');
  console.log('- PostgreSQL: localhost:5432');
  console.log('  Database: phase_platform');
  console.log('  Username: phase_user');
  console.log('  Password: phase_password\n');
  console.log('- Redis: localhost:6379');
  console.log('  Password: phase_redis_password\n');
  console.log('[Web Interfaces - Click to open in browser]\n');
  console.log('- Mailhog:');
  console.log('  - SMTP: http://localhost:1025');
  console.log('  - Web UI: http://localhost:8025');
  console.log('- MinIO:');
  console.log('  - API: http://localhost:9000');
  console.log('  - Console: http://localhost:9001');
  console.log('- Adminer: http://localhost:8080');
  console.log('- Redis Commander: http://localhost:8081');
}

function dockerCommand(command, env = 'dev') {
  if (!isDockerRunning()) {
    console.error('Error: Docker is not running!');
    console.error('Please start Docker Desktop and try again.');
    process.exit(1);
  }

  createEnvLocal();

  const composeFile = DOCKER_COMPOSE_FILES[env];
  if (!composeFile) {
    console.error(`Invalid environment: ${env}`);
    process.exit(1);
  }

  try {
    switch (command) {
      case 'up':
        console.log('🚀 Starting Phase Platform Docker containers...');
        execSync(
          `docker compose --env-file .env.local -f ${composeFile} up -d`,
          { stdio: 'inherit' }
        );
        showServiceInfo();
        break;
      case 'down':
        console.log('Stopping containers...');
        execSync(
          `docker compose --env-file .env.local -f ${composeFile} down`,
          { stdio: 'inherit' }
        );
        break;
      case 'build':
        console.log('Building containers...');
        // Build each service separately to show progress
        const services = [
          'postgres',
          'redis',
          'minio',
          'mailhog',
          'adminer',
          'redis-commander',
        ];
        for (const service of services) {
          console.log(`\nBuilding ${service}...`);
          execSync(
            `docker compose --progress=plain --env-file .env.local -f ${composeFile} build ${service}`,
            { stdio: 'inherit' }
          );
        }
        console.log('\nAll containers built successfully!');
        break;
      case 'restart':
        console.log('Restarting containers...');
        execSync(
          `docker compose --env-file .env.local -f ${composeFile} restart`,
          { stdio: 'inherit' }
        );
        break;
      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`Error executing Docker command: ${error.message}`);
    process.exit(1);
  }
}

// Get command from command line arguments
const command = process.argv[2];
const env = process.argv[3] || 'dev';

if (!command) {
  console.error('Please specify a command: up, down, build, or restart');
  process.exit(1);
}

dockerCommand(command, env);
