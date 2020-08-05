const express = require("express")
const cors = require("cors")
const lowDb = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const bodyParser = require("body-parser")
const { nanoid } = require("nanoid")
const path = require('path')

const db = lowDb(new FileSync('db.json'))

db.defaults({ notes: [] }).write()

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.set('views', './');
app.set('view engine', 'ejs');

// alternate localhost and the port Heroku assigns to $PORT
const HOST = '0.0.0.0';
const PORT = 4000;

app.get('/notes', (req, res) => {
  const data = db.get("notes").value()
  return res.json(data)
})

app.post('/notes/new', (req, res) => {
  const note = req.body
  db.get("notes").push({
    ...note, id: nanoid()
  }).write()
  res.json({ success: true })
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
})

app.get('/counter/:number', function (req, res) {
  var names = ['Rk', 'Yass', 'Az']
  res.render('./index.ejs', { counter: req.params.number, names: names })
});

app.listen((PORT || 4000), HOST, () => {
  console.log(`Backend is running on http://localhost:${PORT}`)
})