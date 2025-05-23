$(document).ready(function() {
    // Проверяем, авторизован ли пользователь
    const userEmail = localStorage.getItem('crosswordUserEmail');
    if (userEmail) {
        showCrossword();
    }

    // Обработка формы авторизации
    $('#auth-form').submit(function(e) {
        e.preventDefault();
        const email = $('#email').val().trim();

        if (email) {
            localStorage.setItem('crosswordUserEmail', email);
            showCrossword();
        }
    });

    // Кнопка выхода
    $('#logout-btn').click(function() {
        localStorage.removeItem('crosswordUserEmail');
        location.reload();
    });

    // Функция показа сканворда
    function showCrossword() {
        $('#auth-container').hide();
        $('#crossword-container').show();
        generateCrossword();
    }

    // Генерация простого сканворда
    function generateCrossword() {
        const crossword = $('#crossword');
        crossword.empty();

        // Пример простого сканворда 15x15
        const gridSize = 15;
        const words = [
            { word: "КОМПЬЮТЕР", row: 1, col: 1, direction: "across" },
            { word: "МОНИТОР", row: 3, col: 1, direction: "down" },
            { word: "КЛАВИАТУРА", row: 5, col: 1, direction: "across" },
            { word: "МЫШЬ", row: 7, col: 1, direction: "down" },
            { word: "ПРОГРАММА", row: 9, col: 1, direction: "across" }
        ];

        // Создаем сетку
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = $('<div>').addClass('cell');
                crossword.append(cell);
            }
        }

        // Размещаем слова
        let wordNumber = 1;
        words.forEach(wordObj => {
            const { word, row, col, direction } = wordObj;

            for (let i = 0; i < word.length; i++) {
                const currentRow = direction === "down" ? row + i - 1 : row - 1;
                const currentCol = direction === "across" ? col + i - 1 : col - 1;
                const index = currentRow * gridSize + currentCol;

                const cell = $('.cell').eq(index);
                cell.removeClass('black');

                // Добавляем номер слова
                if (i === 0) {
                    cell.append($('<span>').addClass('cell-number').text(wordNumber));
                }

                // Создаем input для буквы
                const input = $('<input>')
                    .attr('type', 'text')
                    .attr('maxlength', '1')
                    .val(word[i]);
                cell.empty().append(input);
            }

            wordNumber++;
        });

        // Заполняем остальные клетки как черные
        $('.cell').each(function() {
            if ($(this).children().length === 0) {
                $(this).addClass('black');
            }
        });
    }
});