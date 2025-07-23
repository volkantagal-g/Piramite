#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Piramite config dosyasını oku
function getPiramitePort() {
  try {
    const configPath = path.resolve(__dirname, '../piramite.config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');

    // JSON.parse için uygun hale getir
    const jsonStr = configContent.replace('module.exports = ', '').replace(/,$/, '');
    const config = JSON.parse(jsonStr);

    return config.port || 3578;
  } catch (error) {
    console.log('Config dosyası okunamadı, varsayılan port 3578 kullanılıyor');
    return 3578;
  }
}

// Tarayıcıyı aç
function openBrowser(port) {
  const url = `http://localhost:${port}`;
  console.log(`Browser is opening: ${url}`);

  const { platform } = process;
  let command;

  if (platform === 'darwin') {
    command = 'open';
  } else if (platform === 'win32') {
    command = 'start';
  } else {
    command = 'xdg-open';
  }

  spawn(command, [url], { stdio: 'inherit' });
}

// Ana fonksiyon
async function main() {
  const port = getPiramitePort();
  console.log(`Piramite port: ${port}`);

  // Piramite'yi başlat
  const piramite = spawn('piramite', ['--config', './demo/piramite-app.config.js', '--dev'], {
    stdio: 'inherit',
    shell: true
  });

  // 5 saniye bekle ve tarayıcıyı aç
  setTimeout(() => {
    openBrowser(port);
  }, 5000);

  // Process sinyallerini yakala
  process.on('SIGINT', () => {
    piramite.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    piramite.kill('SIGTERM');
    process.exit(0);
  });
}

main().catch(console.error);
