const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function checkEnvironment() {
  console.log('🔍 Checking environment...');
  const requiredFiles = ['.env', '.env.production'];
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

function cleanBuild() {
  console.log('🧹 Cleaning build artifacts...');
  try {
    execSync('pnpm clean', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Clean failed:', error.message);
    process.exit(1);
  }
}

function buildApplication() {
  console.log('🏗️ Building application...');
  try {
    execSync('turbo build', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

function buildDocker() {
  console.log('🐳 Building Docker images...');
  try {
    execSync('node scripts/docker.js build prod', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Docker build failed:', error.message);
    process.exit(1);
  }
}

function runTests() {
  console.log('🧪 Running tests...');
  try {
    execSync('pnpm test', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Tests failed:', error.message);
    process.exit(1);
  }
}

function createBackup() {
  console.log('📦 Creating database backup...');
  try {
    execSync('node scripts/db.js backup', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Starting build process...\n');

  // Check if Docker is running
  try {
    execSync('docker info', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Docker is not running!');
    console.error('Please start Docker Desktop and try again.');
    process.exit(1);
  }

  // Check environment
  checkEnvironment();

  // Ask for confirmation
  rl.question(
    'Do you want to run tests before building? (yes/no): ',
    async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        runTests();
      }

      rl.question(
        'Do you want to create a database backup? (yes/no): ',
        async (answer) => {
          if (answer.toLowerCase() === 'yes') {
            createBackup();
          }

          // Build steps
          cleanBuild();
          buildApplication();
          buildDocker();

          console.log('\n✨ Build completed successfully!');
          rl.close();
        }
      );
    }
  );
}

main();
