import { defineManifest } from '@crxjs/vite-plugin'

// @ts-ignore
import { name, version } from './package.json'

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

export default defineManifest(async (env) => ({
  name: env.mode === 'staging' ? `[INTERNAL] ${name}` : name,
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  manifest_version: 3,
  icons: {
    '16': `src/assets/logo.png`,
    '48': `src/assets/logo.png`,
    '128': `src/assets/logo.png`,
  },
  action: {
    default_popup: 'src/popup/index.html',
  },
  background: {
    service_worker: 'src/background/index.ts',
  },
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Alt+Shift+S',
      },
    },
    elementSelector: {
      suggested_key: {
        default: 'Alt+S',
        mac: 'Alt+S',
      },
      description: '打开元素选择器',
    },
    screenshot: {
      suggested_key: {
        default: 'Alt+Shift+A',
        mac: 'Alt+Shift+A',
      },
      description: '截图',
    },
  },
  content_scripts: [
    {
      all_frames: false,
      js: ['src/content-script/index.ts'],
      matches: ['*://*/*'],
      run_at: 'document_start',
    },
  ],
  host_permissions: ['*://*/*'],
  options_page: 'src/options/index.html',
  permissions: [
    'alarms',
    'activeTab',
    'tabs',
    'storage',
    'webRequest',
    'scripting',
    'storage',
    'notifications',
    'downloads',
    'tabCapture',
  ],
  web_accessible_resources: [
    {
      matches: ['*://*/*'],
      resources: ['js/content-script/content-loader.js'],
      use_dynamic_url: true,
    },
  ],

  content_security_policy: {
    sandbox:
      "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';",
  },
}))
