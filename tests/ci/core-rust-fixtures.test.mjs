import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { coreRustSuites, runCoreRustTests } from '../fixtures/run-core-rust-tests.mjs'

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'datapad-core-rust-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  mkdirSync(join(root, 'tests', 'fixtures'), { recursive: true })
  writeFileSync(join(root, 'tests', 'fixtures', '.generated.env'),
    'DATAPADPLUSPLUS_REDIS_PORT=26380\nDATAPADPLUSPLUS_SQLSERVER_PORT=24333\n')
  return root
}

function listedTests(args) {
  const suite = coreRustSuites.find((suite) => args.includes(suite.target[0]))
  return suite.tests.map((name) => `${name}: test`).join('\n')
}

test('core runner executes only the seven seeded-engine tests and forwards fixture ports', (t) => {
  const calls = []
  runCoreRustTests({
    root: fixture(t),
    env: { DATAPADPLUSPLUS_REDIS_PORT: '36380', DATAPADPLUSPLUS_FIXTURE_RUN: '0' },
    run: (command, args, options) => {
      calls.push({ command, args, options })
      return { status: 0, stdout: listedTests(args) }
    },
  })
  assert.equal(calls.length, 4)
  assert.equal(coreRustSuites.flatMap((suite) => suite.tests).length, 7)
  for (const { command, args, options } of calls) {
    assert.equal(command, 'cargo')
    assert.ok(args.includes('--exact'))
    assert.ok(args.includes('--locked'))
    assert.equal(options.shell, false)
    assert.equal(options.env.DATAPADPLUSPLUS_REDIS_PORT, '36380')
    assert.equal(options.env.DATAPADPLUSPLUS_SQLSERVER_PORT, '24333')
    assert.equal(options.env.DATAPADPLUSPLUS_FIXTURE_RUN, '1')
    assert.equal(options.env.DATAPADPLUSPLUS_FIXTURE_PROFILE, 'core')
    assert.doesNotMatch(args.join(' '), /timescale|cosmosdb|cassandra|neo4j|janusgraph|search_live|cockroach/)
    if (!args.includes('--list')) assert.ok(args.includes('--test-threads=1'))
  }
})

test('core runner rejects successful empty or renamed test selections', (t) => {
  let calls = 0
  assert.throws(() => runCoreRustTests({
    root: fixture(t), env: {},
    run: () => { calls += 1; return { status: 0, stdout: '0 tests, 0 benchmarks' } },
  }), /missing or renamed/)
  assert.equal(calls, 1)
})

test('core runner stops and propagates a failed test suite', (t) => {
  let calls = 0
  assert.throws(() => runCoreRustTests({
    root: fixture(t), env: {},
    run: (_command, args) => {
      calls += 1
      return { status: args.includes('--list') ? 0 : 101, stdout: listedTests(args) }
    },
  }), /exit 101/)
  assert.equal(calls, 2)
})
