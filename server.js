const { program } = require('commander');
const express = require('express');
const fs = require('fs');
const path = require('path');

program
  .requiredOption('-h, --host <host>', 'Server host address')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <cacheDir>', 'Cache directory path');

program.parse(process.argv);

const { host, port, cache } = program.opts();

if (!fs.existsSync(cache)) {
  console.error('Cache directory does not exist');
  process.exit(1);
}

const app = express();
app.use(express.json());

app.get('/notes/:name', (req, res) => {
  const notePath = path.join(cache, req.params.name);

  if (!fs.existsSync(notePath)) {
    return res.status(404).send('Not found');
  }

  const noteContent = fs.readFileSync(notePath, 'utf-8');
  res.send(noteContent);
});

app.put('/notes/:name', (req, res) => {
  const notePath = path.join(cache, req.params.name);

  if (!fs.existsSync(notePath)) {
    return res.status(404).send('Not found');
  }

  fs.writeFileSync(notePath, req.body.text || '');
  res.send('Note updated');
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
