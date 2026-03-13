const fs = require('fs');
const path = require('path');
const normalizeUrl = require('./os');

function scanApiFolder(dir, baseDir) {
  const routes = [];

  if (!fs.existsSync(dir)) {
    return routes;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      routes.push(...scanApiFolder(fullPath, baseDir));
    } else if (/\.(js|ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      const relativePath = path.relative(baseDir, fullPath);
      const urlPath = filePathToUrlPath(relativePath);
      routes.push({ urlPath, filePath: normalizeUrl(fullPath) });
    }
  }

  return routes;
}

function filePathToUrlPath(filePath) {
  let route = filePath
    .replace(/\.(js|ts|tsx)$/, '')
    .replace(/\\/g, '/');

  if (route.endsWith('/index')) {
    route = route.slice(0, -'/index'.length);
  }

  route = route.replace(/\[([^\]]+)\]/g, ':$1');

  return '/api/' + (route || '');
}

function generateApiRoutes(piramiteConfig) {
  const apiFolder = piramiteConfig.routing && piramiteConfig.routing.api;
  const outputPath = `${piramiteConfig.appConfigFile.output.path}/apiRoutes.manifest.js`;
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (!apiFolder || !fs.existsSync(apiFolder)) {
    fs.writeFileSync(outputPath, 'module.exports = [];\n');
    return outputPath;
  }

  const routes = scanApiFolder(apiFolder, apiFolder);

  const lines = routes.map(({ urlPath, filePath }) => {
    return `  { path: '${urlPath}', handler: require('${filePath}') }`;
  });

  const content = `module.exports = [\n${lines.join(',\n')}\n];\n`;
  fs.writeFileSync(outputPath, content);

  return outputPath;
}

module.exports = generateApiRoutes;
