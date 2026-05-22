#!/usr/bin/env node
/* eslint-disable no-console */
const { engines } = require('../package.json');

function parseMinSemver(range) {
  const match = String(range).match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    return null;
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function versionGte(current, minimum) {
  const parts = current.split('.').map((n) => Number(n));
  for (let i = 0; i < 3; i += 1) {
    const a = parts[i] || 0;
    const b = minimum[i] || 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return true;
}

const nodeMin = parseMinSemver(engines?.node);
if (nodeMin && !versionGte(process.versions.node, nodeMin)) {
  console.error(
    `\n@getir/piramitejs requires Node ${engines.node} (current: ${process.versions.node}).\n` +
      '  nvm use    # .nvmrc → Node 22\n' +
      '  node -v && npm -v\n',
  );
  process.exit(1);
}

const npmMin = parseMinSemver(engines?.npm);
const npmVersion = process.env.npm_version;
if (npmMin && npmVersion && !versionGte(npmVersion, npmMin)) {
  console.error(
    `\n@getir/piramitejs requires npm ${engines.npm} (current: ${npmVersion}).\n` +
      '  npm install -g npm@10\n',
  );
  process.exit(1);
}
