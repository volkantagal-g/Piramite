import arg from 'arg';
import fs from 'fs';
import path from 'path';
import clc from "cli-color";
import { spawn } from 'child_process';

import normalizeUrl from './os';

import defaultConfigs from './config';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--config': String,
      '--dev': Boolean,
      '--bundle': Boolean,
      '--release': Boolean,
      '--for-cdn': Boolean,
      '--no-bundle': Boolean,
      '--analyze': Boolean,
      '--port': Number,
      '--ssr': Boolean,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  const argsList = removeUnneccesaryValueInObject({
    port: args['--port'],
    dev: args['--dev'],
    bundle: args['--bundle'],
    noBundle: args['--no-bundle'],
    analyze: args['--analyze'],
    configFile: args['--config'],
    ssr: args['--ssr'],
  });

  return argsList;
}

function getPiramiteConfigs(configFile) {
  const normalizePath = normalizeUrl(path.resolve(process.cwd()));
  const piramiteConfigs = require(path.resolve(normalizePath, configFile));

  return piramiteConfigs;
}

function removeUnneccesaryValueInObject(argsList) {
  for (const property in argsList) {
    if (argsList[property] === undefined) {
      delete argsList[property];
    }
  }

  return argsList;
}

function runDevelopmentMode() {
  const run = require('../src/tools/run');
  const start = require('../src/tools/start');

  run(start);
}

function runProductionMode(piramiteConfigs, onlyBundle) {
  const bundle = require('../src/tools/bundle');

  bundle()
    .then((res) => {
      console.log(clc.green('Bundle is completed.\n',`File: ${piramiteConfigs.distFolder}/server/server.js`));

      if (!onlyBundle) {
        serve(piramiteConfigs);
      }
    });
}

function serve(piramiteConfigs) {
  console.log(clc.green('Project Serve is starting...'));

  const out = spawn('node', [
    '-r',
    'source-map-support/register',
    '--max-http-header-size=20480',
    `${piramiteConfigs.distFolder}/server/server.js`
  ], {env: {'NODE_ENV': 'production', ...process.env}});

  out.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  out.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  out.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function checkRequiredVariables(mergeConfigs) {
  if (!mergeConfigs.prefix) {
    console.log(clc.red("***ERROR*** - 'prefix' is required"));
    console.log(clc.red("Please add 'prefix' value to your config file"));

    return false;
  }

  return true;
}

export function cli(args) {
  const argumentList = parseArgumentsIntoOptions(args);
  console.log(clc.blue(JSON.stringify(argumentList)));
  const piramiteConfigs = argumentList.configFile ? getPiramiteConfigs(argumentList.configFile) : {};
  const assignedArgsAndPiramiteConfigs = Object.assign(piramiteConfigs, argumentList);
  const mergeAllConfigs = Object.assign(defaultConfigs, assignedArgsAndPiramiteConfigs);
  const isValid = checkRequiredVariables(mergeAllConfigs);

  if (isValid) {
    const createdConfig = `module.exports = ${JSON.stringify(mergeAllConfigs)}`;

    fs.writeFile(path.resolve(__dirname, '../piramite.config.js'), createdConfig, function (err) {
      if (err) throw err;

      console.log('File is created successfully.', mergeAllConfigs.dev);

      if (mergeAllConfigs.dev) {
        runDevelopmentMode();
      } else {
        argumentList.noBundle ?
          serve(piramiteConfigs) :
          runProductionMode(mergeAllConfigs, argumentList.bundle);
      }
    });
  } else {
    return false;
  }
}
