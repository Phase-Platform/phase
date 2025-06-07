const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Cleaning additional files...');

// Function to safely remove directory
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`Removed: ${dirPath}`);
    } catch (err) {
      console.error(`Error removing ${dirPath}:`, err);
    }
  }
}

// Function to find and remove directories recursively
function removeDirsRecursively(rootDir, dirName) {
  const dirs = [];

  function findDirs(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === dirName) {
          dirs.push(fullPath);
        } else {
          findDirs(fullPath);
        }
      }
    }
  }

  findDirs(rootDir);

  for (const dir of dirs) {
    removeDir(dir);
  }
}

// Remove root node_modules
removeDir(path.join(process.cwd(), 'node_modules'));

// Remove .turbo directory
removeDir(path.join(process.cwd(), '.turbo'));

// Remove all .next directories
removeDirsRecursively(process.cwd(), '.next');

// Remove all dist directories
removeDirsRecursively(process.cwd(), 'dist');

// Remove all .cache directories
removeDirsRecursively(process.cwd(), '.cache');

console.log('Clean completed successfully!');
