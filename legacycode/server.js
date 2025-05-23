const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Подключение к базе данных SQLite
const db = new sqlite3.Database('./db.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('Подключено к базе данных SQLite');
        // Создаем таблицу users, если она не существует
        // @ts-ignore
        db.run(`CREATE TABLE IF NOT EXISTS users (
                                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                     email TEXT UNIQUE,
                                                     value INTEGER
                )`);
        // @ts-ignore
        // Создаем таблицу tokens, если она не существует
        db.run(`CREATE TABLE IF NOT EXISTS tokens (
                                                      token TEXT PRIMARY KEY,
                                                      email TEXT,
                                                      created_at INTEGER
                )`);
        // @ts-ignore
        // Добавляем начальные записи в таблицу users, если таблица пуста
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
            if (err) {
                console.error('Ошибка проверки записей:', err.message);
            } else if (row.count === 0) {
                const initialUsers = [
                    { email: 'user1@example.com', value: 100 },
                    { email: 'user2@example.com', value: 200 },
                    { email: 'user3@example.com', value: 300 }
                ];
                const stmt = db.prepare('INSERT INTO users (email, value) VALUES (?, ?)');
                initialUsers.forEach(user => {
                    stmt.run(user.email, user.value);
                });
                stmt.finalize();
                console.log('Добавлены начальные записи в таблицу users');
            }
        });
    }
});

app.use(express.json());
app.use(express.static('public'));

// Эндпоинт для входа по email
app.post('/send-login-link', (req, res) => {
    const { email } = req.body;

    // @ts-ignore
    // Проверяем, существует ли email в таблице users
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Ошибка базы данных:', err.message);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Email не найден в базе данных' });
        }

        // Если email найден, перенаправляем на страницу dashboard
        res.json({ success: true, redirect: `/dashboard?email=${encodeURIComponent(email)}` });
    });
});

// Эндпоинт для пустой страницы dashboard
app.get('/dashboard', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <title>Dashboard</title>
        </head>
        <body>
            <h1>Добро пожаловать на панель управления!</h1>
        </body>
        </html>
    `);
});

// @ts-ignore
// Очистка старых токенов (оставлено для совместимости, хотя токены сейчас не используются)
setInterval(() => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    // @ts-ignore
    db.run('DELETE FROM tokens WHERE created_at < ?', [oneHourAgo]);
}, 60 * 60 * 1000); // Проверять каждые 1 час

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});