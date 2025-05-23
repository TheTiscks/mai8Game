const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('pythonproject/database.sqlite', (err) => {
    if (err) return console.error(err.message);
    console.log('Подключено к базе данных');
});

db.serialize(async () => {
    try {
        // Создаем таблицу
        await new Promise((resolve, reject) => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                email TEXT UNIQUE
            )`, (err) => {
                if (err) reject(err);
                else {
                    console.log('Таблица users создана/проверена');
                    resolve();
                }
            });
        });

        // Добавляем пользователей
        const users = [
            'test1@example.com',
            'test2@example.com',
            'admin@example.com'
        ];

        await new Promise((resolve, reject) => {
            const stmt = db.prepare('INSERT OR IGNORE INTO users (email) VALUES (?)');

            users.forEach((email, index) => {
                stmt.run(email, (err) => {
                    if (err) console.error(`Ошибка при добавлении ${email}:`, err.message);
                    else console.log(`Успешно добавлен: ${email}`);

                    // Закрываем после последней записи
                    if (index === users.length - 1) {
                        stmt.finalize(err => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            });
        });

    } catch (err) {
        console.error('Ошибка в основном потоке:', err);
    } finally {
        // Закрываем соединение с БД
        db.close((err) => {
            if (err) console.error('Ошибка закрытия БД:', err.message);
            else console.log('Соединение с БД закрыто');
        });
    }
});