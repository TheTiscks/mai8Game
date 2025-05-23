const express = require('express');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const app = express();
const port = 3000;

// Подключение к базе данных SQLite
const db = new sqlite3.Database('./db.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('Подключено к базе данных SQLite');
        // Создаем таблицу для токенов, если она не существует
        db.run(`CREATE TABLE IF NOT EXISTS tokens (
            token TEXT PRIMARY KEY,
            email TEXT,
            created_at INTEGER
        )`);
    }
});

app.use(express.json());
app.use(express.static('public'));

// Настройка Nodemailer для отправки писем
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Замените на ваш email
        pass: 'your-email-password'   // Замените на ваш пароль
    }
});

// Эндпоинт для отправки ссылки для входа
app.post('/send-login-link', (req, res) => {
    const { email } = req.body;

    // Проверяем, существует ли email в таблице users
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Ошибка базы данных:', err.message);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Email не найден в базе данных' });
        }

        // Генерируем токен
        const token = crypto.randomBytes(20).toString('hex');
        const loginLink = `http://localhost:${port}/login?token=${token}`;

        // Сохраняем токен в базе данных
        const createdAt = Date.now();
        db.run('INSERT INTO tokens (token, email, created_at) VALUES (?, ?, ?)', [token, email, createdAt], (err) => {
            if (err) {
                console.error('Ошибка при сохранении токена:', err.message);
                return res.status(500).json({ message: 'Ошибка сервера' });
            }

            // Отправляем письмо
            const mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: 'Ссылка для входа',
                text: `Нажмите на эту ссылку, чтобы войти: ${loginLink}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Ошибка при отправке письма:', error);
                    res.status(500).json({ message: 'Ошибка при отправке письма' });
                } else {
                    console.log('Email отправлен:', info.response);
                    res.json({ message: 'Ссылка для входа отправлена на вашу почту' });
                }
            });
        });
    });
});

// Эндпоинт для обработки входа по токену
app.get('/login', (req, res) => {
    const { token } = req.query;

    // Проверяем токен в базе данных
    db.get('SELECT * FROM tokens WHERE token = ?', [token], (err, row) => {
        if (err) {
            console.error('Ошибка базы данных:', err.message);
            return res.status(500).send('Ошибка сервера');
        }
        if (!row) {
            return res.status(400).send('Неверный или истекший токен');
        }

        // Удаляем токен после использования
        db.run('DELETE FROM tokens WHERE token = ?', [token], (err) => {
            if (err) {
                console.error('Ошибка при удалении токена:', err.message);
                return res.status(500).send('Ошибка сервера');
            }

            // Перенаправляем на главную страницу с параметром email
            res.redirect(`/?email=${encodeURIComponent(row.email)}`);
        });
    });
});

// Очистка старых токенов (старше 1 часа)
setInterval(() => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    db.run('DELETE FROM tokens WHERE created_at < ?', [oneHourAgo]);
}, 60 * 60 * 1000); // Проверять каждые 1 час

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});