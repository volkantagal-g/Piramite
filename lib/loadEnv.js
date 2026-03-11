const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

function loadEnv(projectRoot) {
  const env = process.env.PIRAMITE_ENV || 'local';

  const envFiles = [
    '.env',
    '.env.local',
    `.env.${env}`,
    `.env.${env}.local`,
  ];

  envFiles.forEach(file => {
    const filePath = path.resolve(projectRoot, file);
    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath, override: true });
    }
  });
}

module.exports = loadEnv;
