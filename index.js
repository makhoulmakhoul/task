require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'mkl28618',
    database: process.env.DB_DATABASE || 'todo_db',
    port: process.env.DB_PORT || 3306,
  });
  

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');

  // Modify the task table to ensure 'id' is AUTO_INCREMENT and PRIMARY KEY
  const alterTableQuery = 'ALTER TABLE tsk 
MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT';

  db.query(alterTableQuery, (err) => {
    if (err && err.code !== 'ER_DUP_KEYNAME') {
      console.error('Error modifying task table:', err);
    } else {
      console.log('Task table modified (id set as AUTO_INCREMENT PRIMARY KEY)');
    }
  });
});


// Health check route
app.get('/', (req, res) => {
    res.send('Todo API is running');
  });

// Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tsk', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add new task
app.post('/tasks', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO tsk (name, completed) VALUES (?, ?)', [name, false], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, name, completed: false });
  });
});

// Toggle task complete
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.query('UPDATE tsk SET completed = NOT completed WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Task updated' });
  });
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM tsk WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Task deleted' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
