/**
 * Runtime environment validation for critical environment variables
 * This ensures that required variables are present when the server starts,
 * not just during build time.
 */

export function validateRuntimeEnvironment() {
  // Skip validation during build phase
  if (process.env.SKIP_ENV_VALIDATION === 'true') {
    console.log('Skipping environment validation (build mode)');
    return;
  }

  const requiredEnvVars = [
    { key: 'DATABASE_URL', description: 'PostgreSQL database connection string' },
    { key: 'JWT_SECRET', description: 'JWT token signing secret' },
    { key: 'COOKIE_SECRET', description: 'Cookie signing secret' }
  ]

  const missingVars: string[] = []

  for (const { key, description } of requiredEnvVars) {
    const value = process.env[key]
    if (!value || value === 'placeholder-for-build') {
      missingVars.push(`${key} (${description})`)
    }
  }

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:')
    for (const missingVar of missingVars) {
      console.error(`   • ${missingVar}`)
    }
    console.error('\nPlease set these environment variables before starting the server.')
    throw new Error(`Missing required environment variables: ${missingVars.map(v => v.split(' ')[0]).join(', ')}`)
  }

  console.log('✅ All required environment variables are present')
}