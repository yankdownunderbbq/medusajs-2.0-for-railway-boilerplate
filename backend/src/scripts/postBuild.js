const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const MEDUSA_SERVER_PATH = path.join(process.cwd(), '.medusa', 'server');

// Helper function to detect package manager and get appropriate commands
function detectPackageManager() {
  const lockFiles = {
    'pnpm-lock.yaml': { manager: 'pnpm', installCmd: 'pnpm i --prod --frozen-lockfile' },
    'package-lock.json': { manager: 'npm', installCmd: 'npm ci --omit=dev' },
    'yarn.lock': { manager: 'yarn', installCmd: 'yarn install --production --frozen-lockfile' }
  };

  // Check for lock files in order of preference
  for (const [lockFile, config] of Object.entries(lockFiles)) {
    const lockFilePath = path.join(process.cwd(), lockFile);
    if (fs.existsSync(lockFilePath)) {
      console.log(`✓ Detected ${config.manager} (found ${lockFile})`);
      return {
        lockFile,
        lockFilePath,
        ...config
      };
    }
  }

  // Fallback to npm if no lock file is found
  console.log('⚠ No lock file found, defaulting to npm');
  return {
    lockFile: null,
    lockFilePath: null,
    manager: 'npm',
    installCmd: 'npm install --omit=dev'
  };
}

// Helper function to ensure directory exists
function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✓ Created directory: ${dirPath}`);
    }
    return true;
  } catch (error) {
    console.error(`✗ Failed to create directory ${dirPath}:`, error.message);
    return false;
  }
}

// Helper function to copy file safely
function copyFileSafe(src, dest, description) {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied ${description}: ${path.basename(src)}`);
      return true;
    } else {
      console.log(`⚠ ${description} not found: ${path.basename(src)}`);
      return false;
    }
  } catch (error) {
    console.error(`✗ Failed to copy ${description}:`, error.message);
    return false;
  }
}

// Helper function to run command with error handling
function runCommand(command, cwd, description) {
  try {
    console.log(`🔄 ${description}...`);
    console.log(`   Running: ${command}`);
    execSync(command, { 
      cwd: cwd,
      stdio: 'inherit'
    });
    console.log(`✓ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`✗ ${description} failed:`, error.message);
    return false;
  }
}

console.log('🚀 Starting Medusa post-build process...');

// Step 1: Check if .medusa/server exists
if (!fs.existsSync(MEDUSA_SERVER_PATH)) {
  console.error('✗ .medusa/server directory not found.');
  console.error('   This indicates the Medusa build process failed.');
  console.error('   Please check for build errors and ensure the build completed successfully.');
  process.exit(1);
}

console.log(`✓ Found .medusa/server directory: ${MEDUSA_SERVER_PATH}`);

// Step 2: Detect package manager
const packageManagerConfig = detectPackageManager();

// Step 3: Ensure destination directory exists (should already exist, but just in case)
if (!ensureDirectoryExists(MEDUSA_SERVER_PATH)) {
  console.error('✗ Failed to ensure .medusa/server directory exists');
  process.exit(1);
}

// Step 4: Copy lock file if it exists
if (packageManagerConfig.lockFile && packageManagerConfig.lockFilePath) {
  const destLockPath = path.join(MEDUSA_SERVER_PATH, packageManagerConfig.lockFile);
  copyFileSafe(
    packageManagerConfig.lockFilePath, 
    destLockPath, 
    `${packageManagerConfig.manager} lock file`
  );
} else {
  console.log('⚠ No lock file to copy - dependencies will be resolved during install');
}

// Step 5: Copy .env file if it exists
const envPath = path.join(process.cwd(), '.env');
const destEnvPath = path.join(MEDUSA_SERVER_PATH, '.env');
copyFileSafe(envPath, destEnvPath, 'environment file (.env)');

// Step 6: Copy package.json (essential for dependency installation)
const packageJsonPath = path.join(process.cwd(), 'package.json');
const destPackageJsonPath = path.join(MEDUSA_SERVER_PATH, 'package.json');
if (!copyFileSafe(packageJsonPath, destPackageJsonPath, 'package.json')) {
  console.error('✗ Failed to copy package.json - this is required for dependency installation');
  process.exit(1);
}

// Step 7: Install dependencies
console.log(`\n📦 Installing production dependencies using ${packageManagerConfig.manager}...`);

// Check if the package manager is available
try {
  execSync(`${packageManagerConfig.manager} --version`, { stdio: 'pipe' });
} catch (error) {
  console.error(`✗ ${packageManagerConfig.manager} is not available on this system`);
  
  // Fallback to npm if the detected package manager isn't available
  if (packageManagerConfig.manager !== 'npm') {
    console.log('⚠ Falling back to npm...');
    packageManagerConfig.manager = 'npm';
    packageManagerConfig.installCmd = 'npm install --omit=dev';
  } else {
    console.error('✗ npm is also not available. Cannot install dependencies.');
    process.exit(1);
  }
}

if (!runCommand(
  packageManagerConfig.installCmd, 
  MEDUSA_SERVER_PATH, 
  'Installing production dependencies'
)) {
  console.error('✗ Failed to install dependencies');
  process.exit(1);
}

// Step 8: Verify the installation
console.log('\n🔍 Verifying installation...');
const nodeModulesPath = path.join(MEDUSA_SERVER_PATH, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✓ node_modules directory exists');
  
  // Check for key Medusa dependencies
  const keyDependencies = ['@medusajs/medusa', '@medusajs/framework'];
  let foundDependencies = 0;
  
  for (const dep of keyDependencies) {
    const depPath = path.join(nodeModulesPath, dep);
    if (fs.existsSync(depPath)) {
      console.log(`✓ Found dependency: ${dep}`);
      foundDependencies++;
    } else {
      console.log(`⚠ Missing dependency: ${dep}`);
    }
  }
  
  if (foundDependencies > 0) {
    console.log(`✓ Found ${foundDependencies}/${keyDependencies.length} key dependencies`);
  } else {
    console.log('⚠ No key Medusa dependencies found - this might indicate an installation issue');
  }
} else {
  console.log('⚠ node_modules directory not found after installation');
}

// Step 9: Final summary
console.log('\n🎉 Post-build process completed!');
console.log(`📁 Server files location: ${MEDUSA_SERVER_PATH}`);
console.log(`📦 Package manager used: ${packageManagerConfig.manager}`);
console.log('✅ Your Medusa backend is ready for deployment');

console.log('\n📋 Summary:');
console.log(`   • Package manager: ${packageManagerConfig.manager}`);
console.log(`   • Lock file: ${packageManagerConfig.lockFile || 'none'}`);
console.log(`   • Environment file: ${fs.existsSync(destEnvPath) ? 'copied' : 'not found'}`);
console.log(`   • Dependencies: installed in ${MEDUSA_SERVER_PATH}/node_modules`);