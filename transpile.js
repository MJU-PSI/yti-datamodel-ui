const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const directoryPath = './dist';

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(file => {
    if (file.startsWith('main-es') && file.endsWith('.js')) {
      const inputFilePath = path.join(directoryPath, file);
      const outputFilePath = inputFilePath;

      try {
        execSync(`npx babel ${inputFilePath} -o ${outputFilePath}`);
        console.log(`Transpiled ${file}`);
      } catch (error) {
        console.error(`Error transpiling ${file}:`, error);
      }
    }
  });
});
