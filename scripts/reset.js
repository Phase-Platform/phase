const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function confirmReset() {
  return new Promise((resolve) => {
    console.log('⚠️  WARNING: This will reset your development environment!');
    console.log('The following actions will be performed:');
    console.log('1. Stop all running containers');
    console.log('2. Remove all containers and volumes');
    console.log('3. Clean build artifacts and dependencies');
    console.log('4. Reset database to initial state');
    console.log('5. Rebuild and restart the environment\n');

    rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

function stopContainers() {
  console.log('🛑 Stopping containers...');
  try {
    execSync('node scripts/docker.js down', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to stop containers:', error.message);
    process.exit(1);
  }
}

function removeVolumes() {
  console.log('🗑️  Removing volumes...');
  try {
    execSync(
      'docker volume rm phase-platform_postgres_data phase-platform_redis_data',
      { stdio: 'ignore' }
    );
  } catch (error) {
    // Ignore errors if volumes don't exist
  }
}

function cleanEnvironment() {
  console.log('🧹 Cleaning environment...');
  try {
    // Remove build artifacts
    execSync('pnpm clean', { stdio: 'inherit' });

    // Remove node_modules
    const nodeModules = path.join(process.cwd(), 'node_modules');
    if (fs.existsSync(nodeModules)) {
      fs.rmSync(nodeModules, { recursive: true, force: true });
    }

    // Remove .turbo
    const turbo = path.join(process.cwd(), '.turbo');
    if (fs.existsSync(turbo)) {
      fs.rmSync(turbo, { recursive: true, force: true });
    }

    // Remove .next directories
    const appsDir = path.join(process.cwd(), 'apps');
    if (fs.existsSync(appsDir)) {
      fs.readdirSync(appsDir).forEach((app) => {
        const nextDir = path.join(appsDir, app, '.next');
        if (fs.existsSync(nextDir)) {
          fs.rmSync(nextDir, { recursive: true, force: true });
        }
      });
    }
  } catch (error) {
    console.error('❌ Failed to clean environment:', error.message);
    process.exit(1);
  }
}

function reinstallDependencies() {
  console.log('📦 Reinstalling dependencies...');
  try {
    execSync('pnpm install', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to reinstall dependencies:', error.message);
    process.exit(1);
  }
}

function resetDatabase() {
  console.log('🔄 Resetting database...');
  try {
    execSync('node scripts/db.js reset', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to reset database:', error.message);
    process.exit(1);
  }
}

function rebuildEnvironment() {
  console.log('🏗️  Rebuilding environment...');
  try {
    // Start Docker containers
    execSync('node scripts/docker.js up dev', { stdio: 'inherit' });

    // Run database migrations
    execSync('pnpm db:migrate', { stdio: 'inherit' });

    // Seed database
    execSync('pnpm db:seed', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to rebuild environment:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🔄 Starting development environment reset...\n');

  // Check if Docker is running
  try {
    execSync('docker info', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Docker is not running!');
    console.error('Please start Docker Desktop and try again.');
    process.exit(1);
  }

  const confirmed = await confirmReset();
  if (!confirmed) {
    console.log('Reset cancelled');
    rl.close();
    return;
  }

  // Reset steps
  stopContainers();
  removeVolumes();
  cleanEnvironment();
  reinstallDependencies();
  resetDatabase();
  rebuildEnvironment();

  console.log('\n✨ Development environment has been reset successfully!');
  console.log('You can now start the development server with: pnpm dev');
  rl.close();
}

main();
