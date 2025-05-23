const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Инициализация БД
const db = new sqlite3.Database('./PythonProject/database.sqlite', (err) => {
    if (err) throw err;
    console.log('✔ База данных подключена');
});

// Создание таблицы
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) throw err;
    console.log('✔ Таблица users готова');
});

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Статические файлы
app.use(express.static(path.join(__dirname, 'PythonProject')));

// Маршруты
app.post('/api/login', (req, res) => {
    const email = req.body.email?.trim()?.toLowerCase();
    if (!email) return res.status(400).json({ error: 'Email required' });

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'User not found' });

        req.session.user = user;
        res.json({ success: true });
    });
});

// Остальные маршруты...

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});