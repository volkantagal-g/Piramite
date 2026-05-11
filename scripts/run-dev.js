#!/usr/bin/env node
/**
 * esm, esbuild-loader v4+ (optional chaining) ve node: built-in öneklerini
 * güvenilir şekilde işleyemediği için dev sunucusu düz Node ile başlatılır.
 */
const run = require('../src/tools/run');
const start = require('../src/tools/start');

run(start).catch((err) => {
  console.error(err);
  process.exit(1);
});
