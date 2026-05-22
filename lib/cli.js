const arg = require('arg');
const fs = require('fs');
const path = require('path');
const clc = require('cli-color');
const { spawn } = require('child_process');

const normalizeUrl = require('./os');
const defaultConfigs = require('./config');

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
      '--start': Boolean
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
    start: args['--start']
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
  const devScript = path.join(__dirname, '../scripts/run-dev.js');
  const proc = spawn(process.execPath, [devScript], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env,
  });

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      proc.kill(sig);
    });
  });

  proc.on('exit', (code, signal) => {
    process.exit(code == null ? (signal ? 1 : 0) : code);
  });
}

function runProductionMode(piramiteConfigs, onlyBundle) {
  const bundleScript = path.join(__dirname, '../scripts/run-webpack-bundle.js');
  const proc = spawn(process.execPath, [bundleScript], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env },
  });

  proc.on('close', (code) => {
    if (code !== 0) {
      console.log(clc.red(`Bundle failed with exit code ${code}`));
      return;
    }

    console.log(clc.green('Bundle is completed.\n', `File: ${piramiteConfigs.distFolder}/server/server.js`));

    if (!onlyBundle) {
      serve(piramiteConfigs);
    }
  });
}

function serve(piramiteConfigs) {
  console.log(clc.green('Project is up: Port ', piramiteConfigs.port));

  const out = spawn(
    process.execPath,
    [
      '-r',
      'source-map-support/register',
      '--max-http-header-size=20480',
      `${piramiteConfigs.distFolder}/server/server.js`,
    ],
    {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'production' },
    },
  );

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      out.kill(sig);
    });
  });

  out.on('exit', (code, signal) => {
    if (signal || (code != null && code !== 0)) {
      console.log(clc.red(`Sunucu süreci çıktı (kod: ${code}, sinyal: ${signal || '—'})`));
    }
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

function cli(args) {
  const loadEnv = require('./loadEnv');
  loadEnv(process.cwd());

  const argumentList = parseArgumentsIntoOptions(args);
  const piramiteConfigs = argumentList.configFile ? getPiramiteConfigs(argumentList.configFile) : {};
  const assignedArgsAndPiramiteConfigs = Object.assign(piramiteConfigs, argumentList);
  const mergeAllConfigs = Object.assign(defaultConfigs, assignedArgsAndPiramiteConfigs);
  const isValid = checkRequiredVariables(mergeAllConfigs);

  if (isValid) {
    const createdConfig = `module.exports = ${JSON.stringify(mergeAllConfigs)}`;

    fs.writeFile(path.resolve(__dirname, '../piramite.config.js'), createdConfig, function (err) {
      if (err) throw err;

      console.log('File is created successfully.');

      const generateApiRoutes = require('./generateApiRoutes');
      generateApiRoutes(mergeAllConfigs);

      if (mergeAllConfigs.dev) {
        runDevelopmentMode();
      } else if(mergeAllConfigs.start) {
        serve(mergeAllConfigs);
      } else {
        argumentList.noBundle ?
          serve(mergeAllConfigs) :
          runProductionMode(mergeAllConfigs, argumentList.bundle);
      }
    });
  } else {
    return false;
  }
}

module.exports = { cli };
