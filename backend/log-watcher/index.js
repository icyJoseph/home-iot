const fs = require('fs');
const path = require('path');

// only save up to 100 files
const MAX_FILES = 100;
const logs = path.resolve(__dirname, '../logs/');

const getLogs = async () => {
  return new Promise(resolve =>
    fs.readdir(logs, (err, files = []) => {
      if (err) return resolve([]);
      return resolve(files);
    }),
  );
};

console.log(`Watching ${logs}`);

fs.watch(`${logs}`, async (eventType, filename) => {
  // could be either 'rename' or 'change'. new file event and delete
  // also generally emit 'rename'

  const files = await getLogs();
  if (files.length > MAX_FILES) {
    const [fileToDelete] = files.sort((a, b) => {
      const [unixA] = a.split('.');
      const [unixB] = b.split('.');
      return parseInt(unixA) - parseInt(unixB);
    });

    // path of deletion target
    const pathToDelete = `${logs}/${fileToDelete}`;
    fs.unlink(pathToDelete, async () => {
      const updated = await getLogs();
      console.log(`Deleted ${fileToDelete}. Got ${updated.length} logs left.`);
    });
  }
  return null;
});
