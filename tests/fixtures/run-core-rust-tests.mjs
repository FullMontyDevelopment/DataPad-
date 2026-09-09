import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const repoRoot = resolve(import.meta.dirname, '..', '..')

// The core Compose group starts exactly PostgreSQL, MySQL, SQL Server, MongoDB,
// and Redis. Optional service tests belong to their respective fixture jobs.
export const coreRustSuites = [
  {
    target: ['--lib'],
    tests: [
      'adapters::datastores::redis::browser::tests::redis_live_fixture_reads_the_complete_large_value_when_enabled',
      'adapters::datastores::sqlserver::import_export::tests::live_fixture_creates_verifies_and_restores_native_backup',
    ],
  },
  {
    target: ['--test', 'adapters_integration'],
    tests: [
      'postgres_adapter_fixture_roundtrip',
      'mysql_adapter_fixture_roundtrip',
      'sqlserver_adapter_fixture_roundtrip',
      'mongodb_adapter_fixture_roundtrip',
      'redis_adapter_fixture_roundtrip',
    ],
  },
]

export function runCoreRustTests({ root = repoRoot, env = process.env, run = spawnSync } = {}) {
  const generated = resolve(root, 'tests', 'fixtures', '.generated.env')
  const fixtureEnv = existsSync(generated)
    ? Object.fromEntries(readFileSync(generated, 'utf8').split(/\r?\n/)
      .filter((line) => /^[A-Z_][A-Z0-9_]*=/.test(line))
      .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]))
    : {}
  const options = {
    cwd: root,
    env: { ...fixtureEnv, ...env, DATAPADPLUSPLUS_FIXTURE_RUN: '1', DATAPADPLUSPLUS_FIXTURE_PROFILE: 'core' },
    shell: false,
  }

  function cargo(args, extraOptions) {
    const result = run('cargo', args, { ...options, ...extraOptions })
    if (result.error) throw result.error
    if (result.status !== 0) throw new Error(`Core Rust fixture tests failed (exit ${result.status}).`)
    return result
  }

  for (const suite of coreRustSuites) {
    const args = ['test', '--manifest-path', 'apps/desktop/src-tauri/Cargo.toml',
      '--locked', '--features', 'live-fixtures', ...suite.target, '--', '--exact', ...suite.tests]
    // libtest accepts unknown filters as a successful zero-test run. Verify the
    // complete selection before execution so renamed/deleted tests fail CI.
    const listed = cargo([...args, '--list'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] })
    const discovered = new Set(listed.stdout.split(/\r?\n/)
      .filter((line) => line.endsWith(': test')).map((line) => line.slice(0, -6)))
    for (const name of suite.tests) {
      if (!discovered.has(name)) throw new Error(`Core fixture test is missing or renamed: ${name}`)
    }
    console.log(`Running ${suite.tests.length} core fixture tests (${suite.target.join(' ')}).`)
    cargo([...args, '--nocapture', '--test-threads=1'], { stdio: 'inherit' })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCoreRustTests()
}
