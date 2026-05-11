#!/usr/bin/env node

require = require('esm')(module /*, options*/);

// esm, require("node:path") vb. Node built-in öneklerini çözemediği için webpack-dev-middleware 7+ patlıyor.
const Module = require('module');
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function stripNodeBuiltinPrefix(request, parent, isMain, options) {
  if (typeof request === 'string' && request.startsWith('node:')) {
    request = request.slice('node:'.length);
  }
  return resolveFilename.call(this, request, parent, isMain, options);
};

require('../lib/cli').cli(process.argv);
