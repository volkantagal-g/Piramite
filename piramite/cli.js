#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const program = new Command();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getConfig() {
  const configPath = path.resolve(__dirname, '../piramite.config.js');
  if (!fs.existsSync(configPath)) {
    console.error('piramite.config.js bulunamadı!');
    process.exit(1);
  }
  const configModule = await import(`${configPath}?t=${Date.now()}`);
  return configModule.default || configModule;
}

async function createComponentInInputFolder(name) {
  const config = await getConfig();
  const { inputFolder } = config;
  if (!inputFolder) {
    console.error('piramite.config.js içinde inputFolder alanı bulunamadı!');
    process.exit(1);
  }
  const entryDir = path.resolve(__dirname, '..', inputFolder);
  if (!fs.existsSync(entryDir)) {
    fs.mkdirSync(entryDir, { recursive: true });
  }
  const componentDir = path.join(entryDir, name);
  if (fs.existsSync(componentDir)) {
    console.error(`${name} componenti zaten var!`);
    process.exit(1);
  }
  fs.mkdirSync(componentDir);
  // Component dosyaları
  const files = [
    {
      ext: 'tsx',
      content: `const ${name} = () => {\n  return <div>${name} component</div>;\n};\nexport default ${name};\n`
    },
    {
      ext: 'module.css',
      content: `/* ${name} component styles */\n`
    },
    {
      ext: 'types.ts',
      content: `// Types for ${name} component\n`
    }
  ];
  files.forEach(({ ext, content }) => {
    fs.writeFileSync(path.join(componentDir, `${name}.${ext}`), content);
  });
  console.log(`${name} componenti inputFolder (${inputFolder}) içinde oluşturuldu!`);
}

program
  .option('--component, -c <name>', 'Yeni bir component oluştur (inputFolder içinde)')
  .action(async opts => {
    if (opts.component) {
      await createComponentInInputFolder(opts.component);
    }
  });

program.parse(process.argv);
