const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mkl28618',
  database: 'todo_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add new task
app.post('/tasks', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO tasks (name, completed) VALUES (?, ?)', [name, false], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, name, completed: false });
  });
});

// Toggle task complete
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.query('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Task updated' });
  });
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Task deleted' });
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
