const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const TEST_MODES = {
  unit: {
    name: 'Unit Tests',
    command: 'pnpm test:unit',
  },
  integration: {
    name: 'Integration Tests',
    command: 'pnpm test:integration',
  },
  e2e: {
    name: 'End-to-End Tests',
    command: 'pnpm test:e2e',
  },
  all: {
    name: 'All Tests',
    command: 'pnpm test',
  },
};

function checkEnvironment() {
  console.log('🔍 Checking environment...');
  const requiredFiles = ['.env', '.env.test'];
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

function runTests(mode) {
  console.log(`\n🧪 Running ${TEST_MODES[mode].name}...`);
  try {
    execSync(TEST_MODES[mode].command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ ${TEST_MODES[mode].name} failed:`, error.message);
    return false;
  }
}

function generateReport(results) {
  const timestamp = new Date().toISOString();
  const reportDir = path.join(process.cwd(), 'test-reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportFile = path.join(reportDir, `test-report-${timestamp}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));
  console.log(`\n📊 Test report saved to: ${reportFile}`);
}

async function selectTestMode() {
  console.log('\nAvailable test modes:');
  Object.entries(TEST_MODES).forEach(([key, { name }], index) => {
    console.log(`${index + 1}. ${name}`);
  });

  return new Promise((resolve) => {
    rl.question('\nSelect test mode (number): ', (answer) => {
      const index = parseInt(answer) - 1;
      const modes = Object.keys(TEST_MODES);
      if (isNaN(index) || index < 0 || index >= modes.length) {
        console.error('❌ Invalid selection');
        process.exit(1);
      }
      resolve(modes[index]);
    });
  });
}

async function main() {
  console.log('🧪 Starting test suite...\n');

  // Check environment
  checkEnvironment();

  // Select test mode
  const mode = await selectTestMode();

  // Run tests
  const startTime = Date.now();
  const success = runTests(mode);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Generate report
  const results = {
    timestamp: new Date().toISOString(),
    mode: TEST_MODES[mode].name,
    success,
    duration: `${duration}s`,
  };
  generateReport(results);

  // Show summary
  console.log('\nTest Summary:');
  console.log('=============');
  console.log(`Mode: ${TEST_MODES[mode].name}`);
  console.log(`Status: ${success ? '✅ Passed' : '❌ Failed'}`);
  console.log(`Duration: ${duration}s`);

  rl.close();
  process.exit(success ? 0 : 1);
}

main();
