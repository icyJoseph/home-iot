const fs = require('fs');
const path = require('path');

const logPath = path.resolve(__dirname, '../logs/');

console.log(`Watching ${logPath}`);

fs.watch(`${logPath}`, (eventType, filename) => {
  console.log(eventType);
  // could be either 'rename' or 'change'. new file event and delete
  // also generally emit 'rename'
  console.log(filename);
});
