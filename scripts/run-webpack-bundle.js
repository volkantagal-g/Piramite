#!/usr/bin/env node
/* eslint-disable */
require('../src/tools/bundle.js')()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
