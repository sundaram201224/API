const express = require('express');
const mysql = require('mysql2'); 
const app = express();

const PORT = 4000;

// Database connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sundaram@201224',
    database: 'practice_database'
});

db.connect(error => {
    if (error) {
        console.error("Error connecting to the database:", error.message);
        return;
    }
    console.log("Connection to the database was successful");
});

// Middleware to parse JSON requests
app.use(express.json());

// GET endpoint to fetch all users
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';

    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }
        res.json(results);
    });
});

// POST endpoint to add a new user
app.post('/users', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    const query = 'INSERT INTO users (name) VALUES (?)';

    db.query(query, [name], (error, results) => {
        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }
        const newUser = { id: results.insertId, name };
        res.status(201).json(newUser);
    });
});
//DELETE endpoint to remove an user
app.delete('/users', (req, res) => {
    const { id } = req.body;

    if (!id || typeof id !== 'number') {
        return res.status(400).json({ error: "Valid ID is required" });
    }
    const query = 'DELETE FROM practice_database.users WHERE id = ?';

    db.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    });
});    
//PUT changing already exists id
app.put('/users/:id', (req, res) => {
    const { id } = req.params; 
    const { name } = req.body; 

    if (!id || !name) {
        return res.status(400).json({ error: "ID and name are required" });
    }

    const query = 'UPDATE practice_database.users SET name = ? WHERE id = ?';

    db.query(query, [name, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    });
});
//PATCH removes an specific thing partially
app.patch('/users/:id', (req, res) => {
    const { id } = req.params; 
    const { name } = req.body; 

    // Validate input
    if (!name) {
        return res.status(400).json({ error: "Name is required for updating" });
    }

    const query = 'UPDATE practice_database.users SET name = ? WHERE id = ?';

    db.query(query, [name, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
