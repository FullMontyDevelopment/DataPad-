import { strict as assert } from 'node:assert'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sqliteFixture =
  process.env.DATAPADPLUSPLUS_SQLITE_FIXTURE ??
  'tests/fixtures/sqlite/datapadplusplus.sqlite3'
const generatedFixtureEnv = readGeneratedFixtureEnv()

function readGeneratedFixtureEnv() {
  const path = resolve(import.meta.dirname, '..', '..', '..', '..', 'tests', 'fixtures', '.generated.env')

  if (!existsSync(path)) {
    return {}
  }

  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => line.split(/=(.*)/s).slice(0, 2)),
  )
}

function fixturePort(envKey, defaultPort) {
  return process.env[envKey] ?? generatedFixtureEnv[envKey] ?? defaultPort
}

function fixtureProfileEnabled(profile) {
  return (process.env.DATAPADPLUSPLUS_FIXTURE_PROFILE ?? '')
    .split(',')
    .map((item) => item.trim())
    .some((item) => item === 'all' || item === profile)
}

const CORE_CONNECTIONS = [
  {
    name: 'Fixture PostgreSQL',
    engine: 'postgresql',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_POSTGRES_PORT', '54329'),
    database: 'datapadplusplus',
    username: 'datapadplusplus',
    secret: 'datapadplusplus',
    expectedResult: 'row(s) returned from Fixture PostgreSQL',
  },
  {
    name: 'Fixture SQL Server',
    engine: 'sqlserver',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_SQLSERVER_PORT', '14333'),
    database: 'datapadplusplus',
    username: 'sa',
    secret: 'DataPadPlusPlus_pwd_123',
    expectedResult: 'row(s) returned from Fixture SQL Server',
  },
  {
    name: 'Fixture MySQL',
    engine: 'mysql',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_MYSQL_PORT', '33060'),
    database: 'commerce',
    username: 'datapadplusplus',
    secret: 'datapadplusplus',
    expectedResult: 'row(s) returned from Fixture MySQL',
  },
  {
    name: 'Fixture SQLite',
    engine: 'sqlite',
    server: 'localhost',
    database: sqliteFixture,
    username: '',
    secret: '',
    expectedResult: 'row(s) returned from Fixture SQLite',
  },
  {
    name: 'Fixture MongoDB',
    engine: 'mongodb',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_MONGODB_PORT', '27018'),
    database: 'catalog',
    username: 'datapadplusplus',
    secret: 'datapadplusplus',
    expectedResult: 'document(s) loaded',
  },
  {
    name: 'Fixture Redis',
    engine: 'redis',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_REDIS_PORT', '6380'),
    database: '',
    username: '',
    secret: '',
    expectedResult: 'Redis scan returned',
  },
]

const PROFILE_CONNECTIONS = [
  {
    profile: 'cache',
    name: 'Fixture Valkey',
    engine: 'valkey',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_VALKEY_PORT', '6381'),
    database: '0',
    username: '',
    secret: '',
    expectedResult: 'Redis scan returned',
  },
  {
    profile: 'cache',
    name: 'Fixture Memcached',
    engine: 'memcached',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_MEMCACHED_PORT', '11212'),
    database: '',
    username: '',
    secret: '',
    expectedResult: 'Memcached stats returned',
  },
  {
    profile: 'sqlplus',
    name: 'Fixture MariaDB',
    engine: 'mariadb',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_MARIADB_PORT', '33061'),
    database: 'commerce',
    username: 'datapadplusplus',
    secret: 'datapadplusplus',
    expectedResult: 'row(s) returned from Fixture MariaDB',
  },
  {
    profile: 'sqlplus',
    name: 'Fixture CockroachDB',
    engine: 'cockroachdb',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_COCKROACH_PORT', '26257'),
    database: 'datapadplusplus',
    username: 'root',
    secret: '',
    expectedResult: 'row(s) returned from Fixture CockroachDB',
  },
  {
    profile: 'sqlplus',
    name: 'Fixture TimescaleDB',
    engine: 'timescaledb',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_TIMESCALE_PORT', '54330'),
    database: 'metrics',
    username: 'datapadplusplus',
    secret: 'datapadplusplus',
    expectedResult: 'row(s) returned from Fixture TimescaleDB',
  },
  {
    profile: 'analytics',
    name: 'Fixture ClickHouse',
    engine: 'clickhouse',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_CLICKHOUSE_HTTP_PORT', '8124'),
    database: 'analytics',
    username: 'datapadplusplus',
    secret: 'datapadplusplus',
    expectedResult: 'ClickHouse query returned',
  },
  {
    profile: 'analytics',
    name: 'Fixture Prometheus',
    engine: 'prometheus',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_PROMETHEUS_PORT', '9091'),
    database: '',
    username: '',
    secret: '',
    expectedResult: 'Prometheus vector query returned',
  },
  {
    profile: 'search',
    name: 'Fixture OpenSearch',
    engine: 'opensearch',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_OPENSEARCH_PORT', '9201'),
    database: '',
    username: '',
    secret: '',
    expectedResult: 'OpenSearch search returned',
  },
  {
    profile: 'search',
    name: 'Fixture Elasticsearch',
    engine: 'elasticsearch',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_ELASTICSEARCH_PORT', '9202'),
    database: '',
    username: '',
    secret: '',
    expectedResult: 'Elasticsearch search returned',
  },
  {
    profile: 'graph',
    name: 'Fixture Neo4j',
    engine: 'neo4j',
    server: '127.0.0.1',
    port: fixturePort('DATAPADPLUSPLUS_NEO4J_HTTP_PORT', '7475'),
    database: 'neo4j',
    username: 'neo4j',
    secret: 'datapadplusplus',
    expectedResult: 'Neo4j Cypher returned',
  },
]

const CONNECTIONS = [
  ...CORE_CONNECTIONS,
  ...PROFILE_CONNECTIONS.filter((connection) => fixtureProfileEnabled(connection.profile)),
]

let applicationWindowAttached = false

async function applicationWindows() {
  const currentHandle = await browser.getWindowHandle()
  const handles = await browser.getWindowHandles()
  if (handles.length === 1 && applicationWindowAttached) {
    return [{ handle: currentHandle, url: await browser.getUrl(), title: await browser.getTitle() }]
  }
  const windows = []

  for (const handle of handles) {
    await browser.switchToWindow(handle)
    applicationWindowAttached = true
    windows.push({
      handle,
      url: await browser.getUrl(),
      title: await browser.getTitle(),
    })
  }

  await browser.switchToWindow(currentHandle)
  return windows
}

async function selectApplicationWindow() {
  const windows = await applicationWindows()
  const applicationWindow = windows.find(
    (window) => window.url !== 'about:blank' || window.title.length > 0,
  )

  if (applicationWindow && applicationWindow.handle !== await browser.getWindowHandle()) {
    await browser.switchToWindow(applicationWindow.handle)
  }

  return windows
}

async function appText() {
  await selectApplicationWindow()
  return browser.execute(() => document.body?.innerText ?? '')
}

async function appBootstrapDiagnostics() {
  const windows = await selectApplicationWindow()
  const documentState = await browser.execute(() => ({
    url: window.location.href,
    readyState: document.readyState,
    title: document.title,
    rootHtml: document.querySelector('#root')?.innerHTML.slice(0, 2_000) ?? '<missing>',
    bodyHtml: document.body?.innerHTML.slice(0, 2_000) ?? '<missing>',
    scripts: [...document.scripts].map((script) => script.src || '<inline>'),
  }))

  return {
    windows,
    document: documentState,
  }
}

async function waitForText(text, timeout = 30000) {
  try {
    await browser.waitUntil(
      async () => {
        const body = await appText()
        return body.includes(text)
      },
      {
        timeout,
        timeoutMsg: `Expected desktop shell to contain "${text}"`,
      },
    )
  } catch (error) {
    const visibleText = (await appText()).replace(/\s+/g, ' ').trim().slice(0, 1_000)
    const diagnostics = await appBootstrapDiagnostics()
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(
      `${message}. Visible desktop text: ${visibleText || '<empty>'}. Bootstrap: ${JSON.stringify(diagnostics)}`,
    )
  }
}

async function expectNoText(text) {
  const body = await appText()
  assert.equal(body.includes(text), false, `Unexpected text found: ${text}`)
}

async function clickControl(label) {
  const name = JSON.stringify(label)
  const control = await browser.$(
    `//*[self::button or @role="button" or @role="option"][@aria-label=${name} or @title=${name} or normalize-space(.)=${name}]`,
  )
  await control.waitForExist({ timeoutMsg: `Unable to find control "${label}"` })
  // Native pointer events also blur the editor and flush its pending draft.
  await control.scrollIntoView({ block: 'center', inline: 'nearest' })
  // Library overflow buttons appear on keyboard focus as well as hover. Focus
  // explicitly: embedded WebDriver hover is not implemented on every platform.
  await browser.execute((targetLabel) => {
    const normalize = (value) => value?.replace(/\s+/g, ' ').trim() ?? ''
    const item = [...document.querySelectorAll('button, [role="button"], [role="option"]')].find(
      (element) => element.getAttribute('aria-label') === targetLabel
        || element.getAttribute('title') === targetLabel || normalize(element.textContent) === targetLabel,
    )
    item?.focus()
  }, label)
  await control.waitForDisplayed()
  await control.waitForEnabled()
  await control.click()
}

async function setQueryEditorText(text) {
  // Unscoped SQL tabs are already raw and intentionally have no mode switch.
  if (await browser.$('button[aria-label="Raw"]').isExisting()) await clickControl('Raw')
  // Wait for the lazy editor mount before editing a brand-new query tab.
  const editor = await browser.$('.monaco-editor [aria-label="Query editor"]')
  await editor.waitForDisplayed()
  await editor.click()
  // Set up the draft through Monaco's public editor API, which still fires the
  // application's normal change handler. Embedded WebDriver character events
  // do not reliably support Monaco's native EditContext. The assertions below
  // exercise real persistence/execution rather than driver keyboard emulation.
  const updated = await browser.execute((value) => {
    const input = document.querySelector('.monaco-editor [aria-label="Query editor"]')
    const instance = window.monaco?.editor.getEditors().find((candidate) => candidate.getDomNode()?.contains(input))
    if (!instance) return false
    instance.setValue(value)
    instance.setPosition({ lineNumber: 1, column: value.length + 1 })
    instance.focus()
    return true
  }, text)
  assert.ok(updated, 'Expected the active Monaco query editor instance.')
  await browser.waitUntil(async () => browser.execute((expected) => {
    const lines = [...document.querySelectorAll('.monaco-editor .view-lines .view-line')]
    const input = document.querySelector('textarea.editor-textarea[aria-label="Query editor"]')
    const value = lines.length ? lines.map((line) => line.textContent).join('\n') : input?.value
    return value?.replace(/\u00a0/g, ' ').trim() === expected
  }, text), { timeoutMsg: 'Expected the query editor to retain the complete draft.' })
}

async function setField(label, value) {
  const updated = await browser.execute(
    ({ targetLabel, nextValue }) => {
      const labels = [...document.querySelectorAll('label')]
      const labelElement = labels.find((item) => {
        const firstLine = item.innerText.split('\n')[0]?.trim()
        return firstLine === targetLabel
      })
      const field = labelElement?.querySelector('input, select, textarea')

      if (!field) {
        return false
      }

      const prototype =
        field instanceof HTMLSelectElement
          ? HTMLSelectElement.prototype
          : field instanceof HTMLTextAreaElement
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype
      const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value')
      descriptor?.set?.call(field, nextValue)
      field.dispatchEvent(new Event('input', { bubbles: true }))
      field.dispatchEvent(new Event('change', { bubbles: true }))
      return true
    },
    { targetLabel: label, nextValue: value },
  )

  assert.equal(updated, true, `Unable to set field "${label}"`)
}

async function runActiveQuery(connection) {
  const redis = connection.engine === 'redis' || connection.engine === 'valkey'
  if (redis) await clickControl('Redis Console')
  await clickControl(redis ? 'Run Redis command' : 'Run query')
  await waitForText(connection.expectedResult, 60000)
}

async function activateSeededFixtureTab(connection) {
  const tab = await browser.$(
    `//*[@role="tablist" and @aria-label="Editor tabs"]//*[@role="tab" and contains(normalize-space(.), ${JSON.stringify(connection.name)})]`,
  )
  await tab.waitForExist()
  await tab.scrollIntoView({ block: 'nearest', inline: 'center' })
  await tab.click()
  await browser.waitUntil(
    async () => browser.execute(
      (connectionName) => document.querySelector(
        '[role="tablist"][aria-label="Editor tabs"] [role="tab"][aria-selected="true"]',
      )?.textContent?.includes(connectionName)
        && document.querySelector('.editor-surface-context')?.textContent?.includes(connectionName),
      connection.name,
    ),
    { timeout: 20000, timeoutMsg: `Expected ${connection.name} to become the active tab.` },
  )
}

async function showLibrary() {
  if (!await browser.execute(() => Boolean(document.querySelector('.workbench-sidebar')))) {
    await clickControl('Show Library')
  }
}

async function loadExplorerForActiveConnection(connection) {
  await showLibrary()
  await clickControl(`Open actions for ${connection.name}`)
  await clickControl(`Open Explorer for ${connection.name}`)
  await browser.waitUntil(
    async () => browser.execute((name) => {
      const explorer = document.querySelector('.datastore-explorer-workspace, .mongo-explorer-workspace')
      return explorer?.querySelector('h1, h2')?.textContent === name
        && Boolean(explorer.querySelector('[role="treeitem"], .mongo-explorer-node'))
    }, connection.name),
    {
      timeout: 60000,
      timeoutMsg: 'Expected explorer tree rows to load for the active connection.',
    },
  )
  await clickControl('Refresh')
  await browser.waitUntil(async () => browser.execute(() => {
    const explorer = document.querySelector('.datastore-explorer-workspace, .mongo-explorer-workspace')
    return Boolean(explorer?.querySelector('[role="treeitem"], .mongo-explorer-node'))
      && !explorer.querySelector('[aria-busy="true"]')
      && !explorer.querySelector('.datastore-explorer-workspace-error, .mongo-explorer-error')
  }), { timeout: 60000, timeoutMsg: `Expected refreshed metadata for ${connection.name}.` })
  await activateSeededFixtureTab(connection)
}

async function inspectWorkspaceExportDialog() {
  await clickControl('Open settings')
  await waitForText('Settings')
  await clickControl('Workspace + Backups')
  await waitForText('Workspace')
  await clickControl('Export')
  await browser.$('[role="dialog"][aria-labelledby="workspace-export-dialog-title"]').waitForDisplayed()
  await setField('Passphrase', 'correct horse battery staple')
  await setField('Confirm passphrase', 'correct horse battery staple')
  const state = await browser.execute(() => {
    const dialog = document.querySelector('[role="dialog"][aria-labelledby="workspace-export-dialog-title"]')
    const includeSecrets = dialog?.querySelector('input[type="checkbox"]')
    const submit = [...(dialog?.querySelectorAll('button') ?? [])].find(
      (button) => button.textContent?.includes('Choose Location and Export'),
    )
    return {
      includeSecrets: includeSecrets instanceof HTMLInputElement && includeSecrets.checked,
      submitEnabled: submit instanceof HTMLButtonElement && !submit.disabled,
      text: dialog?.textContent ?? '',
    }
  })
  assert.equal(state.includeSecrets, false, 'Workspace export must exclude secrets by default.')
  assert.equal(state.submitEnabled, true, 'A valid confirmed passphrase should enable export.')
  assert.equal(state.text.includes('DataPadPlusPlus_pwd_123'), false)
  assert.equal(state.text.includes('fixture-token'), false)
  await clickControl('Cancel')
  await clickControl('Close tab Settings')
}

async function editorTabCount() {
  return browser.execute(
    () => document.querySelectorAll('[role="tablist"][aria-label="Editor tabs"] [role="tab"]').length,
  )
}

async function setMultiWindowTabsEnabled(enabled) {
  const changed = await browser.execute((nextEnabled) => {
    const card = [...document.querySelectorAll('.settings-plugin-card')].find(
      (candidate) => candidate.querySelector('h4')?.textContent?.trim() === 'Multi-window Tabs',
    )
    const checkbox = card?.querySelector('input[type="checkbox"]')
    if (!(checkbox instanceof HTMLInputElement)) {
      return false
    }
    if (checkbox.checked !== nextEnabled) {
      checkbox.click()
    }
    return true
  }, enabled)

  assert.equal(changed, true, 'Unable to change the Multi-window Tabs setting.')
  await browser.waitUntil(
    async () => browser.execute((nextEnabled) => {
      const card = [...document.querySelectorAll('.settings-plugin-card')].find(
        (candidate) => candidate.querySelector('h4')?.textContent?.trim() === 'Multi-window Tabs',
      )
      const checkbox = card?.querySelector('input[type="checkbox"]')
      return checkbox instanceof HTMLInputElement && checkbox.checked === nextEnabled
    }, enabled),
    {
      timeout: 20000,
      timeoutMsg: `Expected Multi-window Tabs to become ${enabled ? 'enabled' : 'disabled'}.`,
    },
  )
  await waitForText(enabled
    ? 'Multi-window Tabs plugin enabled.'
    : 'Tabs returned to the main window and the plugin was disabled.')
}

async function openActiveTabContextMenu() {
  const tab = await browser.$('[role="tablist"][aria-label="Editor tabs"] [role="tab"][aria-selected="true"]')
  await tab.scrollIntoView({ block: 'nearest', inline: 'center' })
  await browser.execute(() => {
    const selected = document.querySelector('[role="tablist"][aria-label="Editor tabs"] [role="tab"][aria-selected="true"]')
    const bounds = selected.getBoundingClientRect()
    selected.focus()
    selected.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true, cancelable: true, button: 2,
      clientX: bounds.left + bounds.width / 2,
      clientY: bounds.top + bounds.height / 2,
    }))
  })
  await browser.$('[role="menu"]').waitForDisplayed()
}

describe('DataPad++ Tauri desktop fixtures', () => {
  it('starts with a fixture-seeded workspace instead of demo seed data', async () => {
    for (const connection of CORE_CONNECTIONS) {
      await waitForText(connection.name)
    }

    await expectNoText('Analytics Postgres')
    await expectNoText('Ops dashboard')
    await expectNoText('Redis hot key pack')
    await expectNoText('No connections yet.')
  })

  for (const connection of CONNECTIONS) {
    it(`executes and explores the ${connection.engine} fixture`, async () => {
      await activateSeededFixtureTab(connection)
      await runActiveQuery(connection)
      await loadExplorerForActiveConnection(connection)
      if (connection.engine === 'redis' || connection.engine === 'valkey') {
        // The console-mode draft is intentionally disposable. Close it through
        // the real unsaved-work confirmation before measuring bulk-close later.
        const count = await editorTabCount()
        await browser.$('[role="tab"][aria-selected="true"] [aria-label^="Close tab "]').click()
        await browser.waitUntil(async () => (await editorTabCount()) < count
          || await browser.$('#close-tab-dialog-title').isExisting())
        if (await browser.$('#close-tab-dialog-title').isExisting()) await clickControl('Discard Changes')
        await browser.waitUntil(async () => (await editorTabCount()) === count - 1)
      }
    })
  }

  it('saves real work and opens a secret-safe workspace export', async () => {
    await showLibrary()
    await clickControl(`Open actions for ${CORE_CONNECTIONS[0].name}`)
    await clickControl(`New Query for ${CORE_CONNECTIONS[0].name}`)
    await setQueryEditorText('SELECT 1 AS fixture_saved;')
    await openActiveTabContextMenu()
    await clickControl('Save')
    await waitForText('Save this item to the workspace Library')
    await setField('Name', 'CI saved PostgreSQL query')
    await clickControl('Save')
    await waitForText('CI saved PostgreSQL query')

    await inspectWorkspaceExportDialog()
  })

  it('opens the visual Datastore Tests plugin editor for a fixture connection', async () => {
    await clickControl('Open settings')
    await clickControl('Plugins')
    // Plugins are deliberately disabled in the standard fixture workspace.
    const enabled = await browser.execute(() => {
      const card = [...document.querySelectorAll('.settings-plugin-card')].find(
        (item) => item.querySelector('h4')?.textContent?.trim() === 'Datastore Tests',
      )
      const input = card?.querySelector('input[type="checkbox"]')
      if (!(input instanceof HTMLInputElement)) return false
      if (!input.checked) input.click()
      return true
    })
    assert.ok(enabled, 'Expected the Datastore Tests plugin control.')
    await waitForText('Datastore Tests plugin enabled.')
    await clickControl('Close tab Settings')
    await showLibrary()
    await clickControl('Open actions for Fixture SQLite')
    await clickControl('New Test Suite for Fixture SQLite')
    await waitForText('Create target-bound test suite')
    const databaseScope = await browser.$('.create-test-suite-database-target')
    await databaseScope.waitForDisplayed()
    await databaseScope.click()
    await clickControl('Create Test Suite')

    await waitForText('Run Suite')
    await waitForText('Add Case')
    await waitForText('Setup')
    await waitForText('Execute')
    await waitForText('Teardown')
    await waitForText('Assertions')
    await expectNoText('Raw JSON')

    assert.ok(await browser.$('.test-suite-heading svg').isExisting())
    assert.ok(await browser.$('button[aria-label^="Open test case "] svg').isExisting())
  })

  it('moves a working tab into a native editor window and returns it to main', async () => {
    await activateSeededFixtureTab(CORE_CONNECTIONS[3])
    const mainHandle = await browser.getWindowHandle()
    const selectedTabTitle = await browser.execute(() =>
      document.querySelector(
        '[role="tablist"][aria-label="Editor tabs"] [role="tab"][aria-selected="true"]',
      )?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    )
    assert.ok(selectedTabTitle, 'Expected a selected working tab before moving it.')

    await clickControl('Open settings')
    await waitForText('Settings')
    await clickControl('Plugins')
    await waitForText('Multi-window Tabs')
    await setMultiWindowTabsEnabled(true)
    await clickControl('Close tab Settings')
    await activateSeededFixtureTab(CORE_CONNECTIONS[3])

    await openActiveTabContextMenu()
    await clickControl('Move to New Window')
    await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 2, {
      timeout: 30000,
      timeoutMsg: 'Expected a detached DataPad++ editor window.',
    })

    const editorHandle = (await browser.getWindowHandles()).find((handle) => handle !== mainHandle)
    assert.ok(editorHandle, 'Unable to identify the detached editor window.')
    await browser.switchToWindow(editorHandle)
    await browser.waitUntil(
      async () => browser.execute((title) => document.body?.innerText.includes(title) ?? false, selectedTabTitle),
      {
        timeout: 30000,
        timeoutMsg: 'Expected the moved tab to render in the detached editor window.',
      },
    )
    assert.equal(
      await browser.execute(() => Boolean(document.querySelector('.workbench-sidebar'))),
      false,
      'Detached editor windows must not render the main Explorer shell.',
    )

    await openActiveTabContextMenu()
    await clickControl('Move to Main Window')
    await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 1, {
      timeout: 30000,
      timeoutMsg: 'Expected the empty editor window to close after returning its last tab.',
    })
    await browser.switchToWindow(mainHandle)
    await browser.waitUntil(
      async () => browser.execute((title) => document.body?.innerText.includes(title) ?? false, selectedTabTitle),
      {
        timeout: 30000,
        timeoutMsg: 'Expected the returned tab to be visible in the main window.',
      },
    )

    await clickControl('Open settings')
    await waitForText('Settings')
    await clickControl('Plugins')
    await setMultiWindowTabsEnabled(false)
    await clickControl('Close tab Settings')
  })

  it('closes eligible tabs in one transition while a running tab remains usable', async () => {
    // A fast seeded SELECT can finish before the menu opens. Use a bounded,
    // genuinely running server query instead of depending on machine timing.
    await activateSeededFixtureTab(CORE_CONNECTIONS[0])
    await setQueryEditorText('SELECT pg_sleep(15), 1 AS fixture_bulk_close;')
    const initialTabCount = await editorTabCount()
    assert.ok(initialTabCount > 3, 'Expected several fixture tabs for bulk-close validation.')

    await browser.execute(() => {
      window.__datapadBulkCloseTabCounts = []
      const tablist = document.querySelector('[role="tablist"][aria-label="Editor tabs"]')
      const observer = new MutationObserver(() => {
        window.__datapadBulkCloseTabCounts.push(
          tablist?.querySelectorAll('[role="tab"]').length ?? 0,
        )
      })
      if (tablist) {
        observer.observe(tablist, { childList: true, subtree: true })
      }
      window.__datapadBulkCloseObserver = observer
    })

    await clickControl('Run query')
    await browser.waitUntil(async () => browser.execute(() =>
      Boolean(document.querySelector('[role="tab"][aria-selected="true"].is-running')),
    ), { timeout: 10000, timeoutMsg: 'Expected the delayed fixture query to be running.' })
    await openActiveTabContextMenu()
    await clickControl('Close All')

    await browser.waitUntil(async () => (await editorTabCount()) === 1, {
      timeout: 30000,
      timeoutMsg: 'Expected all eligible tabs to close while the running tab remained.',
    })
    await clickControl('Open the Messages panel and review command/runtime errors.')
    await waitForText('still open because its query is running or queued')
    const observedCounts = await browser.execute(() => {
      window.__datapadBulkCloseObserver?.disconnect()
      return window.__datapadBulkCloseTabCounts ?? []
    })
    assert.equal(
      observedCounts.some((count) => count > 1 && count < initialTabCount),
      false,
      `Expected one atomic tab transition, observed counts: ${observedCounts.join(', ')}`,
    )

    await browser.waitUntil(
      async () => browser.execute(() => {
        const runButton = [...document.querySelectorAll('button')].find(
          (button) => button.getAttribute('aria-label') === 'Run query',
        )
        return Boolean(runButton && !runButton.disabled)
      }),
      {
        timeout: 60000,
        timeoutMsg: 'Expected the surviving tab to unlock after its query completed.',
      },
    )
    const closedSurvivor = await browser.execute(() => {
      const closeButton = document.querySelector(
        '[role="tablist"][aria-label="Editor tabs"] [aria-label^="Close tab "]',
      )
      if (!(closeButton instanceof HTMLElement)) {
        return false
      }
      closeButton.click()
      return true
    })
    assert.equal(closedSurvivor, true, 'Unable to close the surviving unlocked tab.')
    await waitForText('Save changes before closing?')
    await clickControl('Discard Changes')
    await browser.waitUntil(async () => (await editorTabCount()) === 0, {
      timeout: 30000,
      timeoutMsg: 'Expected the surviving tab to close normally after it unlocked.',
    })
  })
})
