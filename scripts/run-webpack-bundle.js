#!/usr/bin/env node
/* eslint-disable */
const path = require('path');

process.chdir(path.resolve(__dirname, '..'));

require('../src/tools/bundle.js')()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
