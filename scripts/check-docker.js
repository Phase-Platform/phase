const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function isDockerRunning() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function showOptions() {
  console.log('\n=== Docker is not running ===');
  console.log('\nPlease choose an option:');
  console.log('1. Start Docker Desktop and continue');
  console.log('2. Run application locally');
  console.log('3. Exit');

  rl.question('\nEnter your choice (1-3): ', (answer) => {
    switch (answer.trim()) {
      case '1':
        console.log('\nPlease start Docker Desktop and run the command again.');
        rl.close();
        process.exit(1);
        break;
      case '2':
        console.log('\nRunning application locally...');
        try {
          execSync('pnpm dev', { stdio: 'inherit' });
        } catch (error) {
          console.error('Error running application locally:', error.message);
        }
        rl.close();
        break;
      case '3':
        console.log('\nExiting...');
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('\nInvalid option. Please try again.');
        showOptions();
    }
  });
}

if (!isDockerRunning()) {
  showOptions();
} else {
  console.log('Docker is running. Proceeding with Docker commands...');
  rl.close();
}
