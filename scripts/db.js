const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const BACKUP_DIR = path.join(process.cwd(), 'backups');

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function backupDatabase() {
  ensureBackupDir();
  const timestamp = getTimestamp();
  const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.sql`);

  console.log('📦 Creating database backup...');
  try {
    execSync(
      `docker exec phase-platform-postgres pg_dump -U phase_user phase_platform > "${backupFile}"`,
      { stdio: 'inherit' }
    );
    console.log(`✅ Backup created successfully: ${backupFile}`);
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
}

function restoreDatabase() {
  ensureBackupDir();
  const backups = fs
    .readdirSync(BACKUP_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort()
    .reverse();

  if (backups.length === 0) {
    console.error('❌ No backup files found');
    process.exit(1);
  }

  console.log('\nAvailable backups:');
  backups.forEach((backup, index) => {
    console.log(`${index + 1}. ${backup}`);
  });

  rl.question('\nSelect backup to restore (number): ', (answer) => {
    const index = parseInt(answer) - 1;
    if (isNaN(index) || index < 0 || index >= backups.length) {
      console.error('❌ Invalid selection');
      rl.close();
      process.exit(1);
    }

    const backupFile = path.join(BACKUP_DIR, backups[index]);
    console.log(`\n🔄 Restoring from backup: ${backups[index]}`);

    try {
      execSync(
        `docker exec -i phase-platform-postgres psql -U phase_user phase_platform < "${backupFile}"`,
        { stdio: 'inherit' }
      );
      console.log('✅ Database restored successfully');
    } catch (error) {
      console.error('❌ Restore failed:', error.message);
    }
    rl.close();
  });
}

function resetDatabase() {
  console.log('⚠️ This will reset the database to its initial state.');
  rl.question('Are you sure? (yes/no): ', (answer) => {
    if (answer.toLowerCase() !== 'yes') {
      console.log('Operation cancelled');
      rl.close();
      return;
    }

    console.log('\n🔄 Resetting database...');
    try {
      execSync('pnpm db:reset', { stdio: 'inherit' });
      console.log('✅ Database reset successfully');
    } catch (error) {
      console.error('❌ Database reset failed:', error.message);
    }
    rl.close();
  });
}

function listBackups() {
  ensureBackupDir();
  const backups = fs
    .readdirSync(BACKUP_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort()
    .reverse();

  if (backups.length === 0) {
    console.log('No backups found');
    return;
  }

  console.log('\nAvailable backups:');
  backups.forEach((backup, index) => {
    const stats = fs.statSync(path.join(BACKUP_DIR, backup));
    console.log(
      `${index + 1}. ${backup} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`
    );
  });
}

function cleanupOldBackups() {
  ensureBackupDir();
  const backups = fs
    .readdirSync(BACKUP_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort()
    .reverse();

  if (backups.length <= 5) {
    console.log('No old backups to clean up');
    return;
  }

  console.log('🧹 Cleaning up old backups...');
  backups.slice(5).forEach((backup) => {
    const backupPath = path.join(BACKUP_DIR, backup);
    fs.unlinkSync(backupPath);
    console.log(`Deleted: ${backup}`);
  });
}

// Get command from command line arguments
const command = process.argv[2];

switch (command) {
  case 'backup':
    backupDatabase();
    break;
  case 'restore':
    restoreDatabase();
    break;
  case 'reset':
    resetDatabase();
    break;
  case 'list':
    listBackups();
    break;
  case 'cleanup':
    cleanupOldBackups();
    break;
  default:
    console.log('Usage: node db.js <command>');
    console.log('\nCommands:');
    console.log('  backup   - Create a new database backup');
    console.log('  restore  - Restore database from a backup');
    console.log('  reset    - Reset database to initial state');
    console.log('  list     - List available backups');
    console.log('  cleanup  - Remove old backups (keeps last 5)');
    process.exit(1);
}
