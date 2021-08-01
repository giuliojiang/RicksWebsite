import express from 'express';
import Datastore from 'nedb';

const db = new Datastore({
  filename: 'db.nedb',
  autoload: true
});

var app = express();

app.use(express.json({
  limit: '100mb'
}));

app.post('/images', (req, res) => {
  const body = req.body;
  const name = body.name;
  const data = body.data;
  db.insert({name, data}, () => {
    res.send(JSON.stringify({
      success: true
    }));
  });
});

app.get('/images', (req, res) => {
  db.find({}, {_id: 1, name: 1}, (err, docs) => {
    res.send(JSON.stringify(docs));
  });
});

app.get('/images/:id', (req, res) => {
  db.findOne({
    _id: req.params.id
  }, (err, doc) => {
    res.send(JSON.stringify({
      data: doc.data
    }));
  });
});

app.use(express.static('build'));

app.listen(3000, () => {
  console.info('Server listening on http://localhost:3000');
});