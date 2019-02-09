const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 9191;

const logs = path.resolve(__dirname, '../logs/');

app.get('/', (req, res) => {
  fs.readdir(logs, async (err, files) => {
    const allData = await files.reduce(async (prev, file) => {
      const acc = await prev;
      const data = await new Promise(resolve =>
        fs.readFile(`${logs}/${file}`, 'utf8', (err, data) => {
          resolve(JSON.parse(data));
        }),
      );
      return [...acc, data];
    }, []);
    console.log('Sending all data');
    return res.send(allData);
  });
});

app.listen(PORT, () => console.log(`Running in ${PORT}`));
