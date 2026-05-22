#!/usr/bin/env node

// Child webpack processes may resolve `node:` built-ins; patch before any require chain.
const Module = require('module');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function stripNodeBuiltinPrefix(request, parent, isMain, options) {
  if (typeof request === 'string' && request.startsWith('node:')) {
    request = request.slice('node:'.length);
  }
  return resolveFilename.call(this, request, parent, isMain, options);
};

const { cli } = require('../lib/cli');
cli(process.argv);
