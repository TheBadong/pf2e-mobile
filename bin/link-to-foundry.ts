import 'dotenv/config';
import * as fs from 'node:fs';

const moduleName = 'pf2e-mobile';

const currentPath = import.meta.dirname;

const defaultDataPath = process.env.HOME + '/foundrydata';
const customDataPath = process.env.DATA_PATH;

let foundryDataPath = defaultDataPath;

if (customDataPath) {
  if (!fs.existsSync(`${customDataPath}`)) {
    console.error(
      'No FroundryVTT Data path found! Make sure path is correct in .env',
    );
    process.exit(1);
  }
  
  foundryDataPath = customDataPath;
}

console.info('Using foundry data path: ' + foundryDataPath);

if (!fs.existsSync(`${foundryDataPath}/modules/`)) {
  fs.mkdirSync(`${foundryDataPath}/modules/`);
}

if (!fs.existsSync(`${foundryDataPath}/modules/${moduleName}`)) {
  fs.symlinkSync(
    `${currentPath}/../dist`,
    `${foundryDataPath}/Data/modules/${moduleName}`,
  );
}

console.log(
  `Linked ${currentPath}/../dist to ${foundryDataPath}/modules/${moduleName}`,
);
