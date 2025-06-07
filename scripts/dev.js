const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function checkDependencies() {
  console.log('🔍 Checking dependencies...');
  try {
    execSync('pnpm install', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

function checkEnvironment() {
  console.log('🔍 Checking environment...');
  const requiredFiles = ['.env', '.env.development'];
  const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));

  if (missingFiles.length > 0) {
    console.log('⚠️ Missing environment files:', missingFiles.join(', '));
    console.log('Running setup...');
    try {
      execSync('node scripts/setup.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }
}

function startServices() {
  console.log('🚀 Starting development services...');
  try {
    execSync('node scripts/docker.js up dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to start services:', error.message);
    process.exit(1);
  }
}

function startDevelopment() {
  console.log('🚀 Starting development environment...');
  try {
    execSync('turbo dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to start development:', error.message);
    process.exit(1);
  }
}

function cleanup() {
  console.log('🧹 Cleaning up...');
  try {
    execSync('pnpm clean', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Setting up development environment...\n');

  // Check if Docker is running
  try {
    execSync('docker info', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Docker is not running!');
    console.error('Please start Docker Desktop and try again.');
    process.exit(1);
  }

  // Check if we should clean up first
  rl.question(
    'Do you want to clean up before starting? (yes/no): ',
    async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        cleanup();
      }

      // Setup steps
      checkDependencies();
      checkEnvironment();
      startServices();

      // Start development
      startDevelopment();

      // Health check
      console.log('\n🔍 Running health check...');
      try {
        execSync('node scripts/health.js', { stdio: 'inherit' });
      } catch (error) {
        console.error('❌ Health check failed:', error.message);
        process.exit(1);
      }
    }
  );
}

main();
