const { execSync } = require('child_process');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const SERVICES = {
  docker: {
    name: 'Docker',
    check: () => {
      try {
        execSync('docker info', { stdio: 'ignore' });
        return { status: 'healthy', message: 'Docker is running' };
      } catch (error) {
        return { status: 'unhealthy', message: 'Docker is not running' };
      }
    },
  },
  postgres: {
    name: 'PostgreSQL',
    check: async () => {
      try {
        execSync('docker exec phase-platform-postgres-dev pg_isready', {
          stdio: 'ignore',
        });
        return { status: 'healthy', message: 'PostgreSQL is running' };
      } catch (error) {
        return { status: 'unhealthy', message: 'PostgreSQL is not running' };
      }
    },
  },
  redis: {
    name: 'Redis',
    check: async () => {
      try {
        execSync('docker exec phase-platform-redis-dev redis-cli ping', {
          stdio: 'ignore',
        });
        return { status: 'healthy', message: 'Redis is running' };
      } catch (error) {
        return { status: 'unhealthy', message: 'Redis is not running' };
      }
    },
  },
  api: {
    name: 'API',
    check: async () => {
      return new Promise((resolve) => {
        const req = http.get('http://localhost:3001/api/health', (res) => {
          if (res.statusCode === 200) {
            resolve({ status: 'healthy', message: 'API is running' });
          } else {
            resolve({
              status: 'unhealthy',
              message: `API returned status ${res.statusCode}`,
            });
          }
        });
        req.on('error', () => {
          resolve({ status: 'unhealthy', message: 'API is not responding' });
        });
        req.setTimeout(5000, () => {
          resolve({
            status: 'unhealthy',
            message: 'API health check timed out',
          });
        });
      });
    },
  },
  web: {
    name: 'Web',
    check: async () => {
      return new Promise((resolve) => {
        const req = http.get('http://localhost:3000', (res) => {
          if (res.statusCode === 200) {
            resolve({ status: 'healthy', message: 'Web server is running' });
          } else {
            resolve({
              status: 'unhealthy',
              message: `Web server returned status ${res.statusCode}`,
            });
          }
        });
        req.on('error', () => {
          resolve({
            status: 'unhealthy',
            message: 'Web server is not responding',
          });
        });
        req.setTimeout(5000, () => {
          resolve({
            status: 'unhealthy',
            message: 'Web server health check timed out',
          });
        });
      });
    },
  },
};

async function checkAllServices() {
  console.log('🔍 Checking system health...\n');

  const results = [];
  for (const [key, service] of Object.entries(SERVICES)) {
    console.log(`Checking ${service.name}...`);
    const result = await service.check();
    results.push({ service: service.name, ...result });
  }

  // Display results
  console.log('\nHealth Check Results:');
  console.log('====================\n');

  let allHealthy = true;
  results.forEach(({ service, status, message }) => {
    const icon = status === 'healthy' ? '✅' : '❌';
    console.log(`${icon} ${service}: ${message}`);
    if (status === 'unhealthy') allHealthy = false;
  });

  // Save results to file
  const timestamp = new Date().toISOString();
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const logFile = path.join(logDir, 'health-check.log');
  const logEntry = {
    timestamp,
    results,
    allHealthy,
  };

  fs.appendFileSync(logFile, JSON.stringify(logEntry, null, 2) + '\n');

  if (!allHealthy) {
    console.log(
      '\n⚠️ Some services are unhealthy. Please check the logs for details.'
    );
    process.exit(1);
  } else {
    console.log('\n✨ All services are healthy!');
  }
}

// Run health check
checkAllServices();
