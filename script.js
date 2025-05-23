$(document).ready(function() {
    // Глобальные переменные
    let words = [];
    let timerInterval;
    let seconds = 0;
    let currentCrossword = null;

    // Проверка авторизации
    const userEmail = localStorage.getItem('crosswordUserEmail');
    if (userEmail) {
        showCrossword(userEmail);
    }

    // Обработка формы авторизации
    $('#auth-form').submit(function(e) {
        e.preventDefault();
        const email = $('#email').val().trim();
        if (email) {
            localStorage.setItem('crosswordUserEmail', email);
            showCrossword(email);
        }
    });

    // Выход из системы
    $('#logout-btn').click(function() {
        localStorage.removeItem('crosswordUserEmail');
        location.reload();
    });

    // Функция показа сканворда
    function showCrossword(email) {
        $('#auth-container').hide();
        $('#crossword-container').show();
        $('#user-email').text(email);
        $('#user-avatar').text(email.charAt(0).toUpperCase());
        startTimer();
        generateCrossword();
    }

    // Таймер
    function startTimer() {
        clearInterval(timerInterval);
        seconds = 0;
        updateTimerDisplay();
        timerInterval = setInterval(function() {
            seconds++;
            updateTimerDisplay();
        }, 1000);
    }

    function updateTimerDisplay() {
        const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        $('#timer').text(`${hours}:${minutes}:${secs}`);
    }

    // Генерация сканворда
    function generateCrossword() {
        currentCrossword = {
            grid: [],
            words: []
        };
        $('#crossword').empty();

        // Список слов
        words = [
            { word: "ПРОГРАММИРОВАНИЕ", clue: "Процесс создания компьютерных программ", row: 1, col: 3, direction: "across" },
            { word: "АЛГОРИТМ", clue: "Последовательность действий для решения задачи", row: 3, col: 5, direction: "across" },
            { word: "КОМПИЛЯТОР", clue: "Программа, переводящая код в машинный язык", row: 5, col: 2, direction: "across" },
            { word: "ФУНКЦИЯ", clue: "Подпрограмма, выполняющая определенную задачу", row: 7, col: 8, direction: "across" },
            { word: "БАЗАДАННЫХ", clue: "Структурированный набор данных", row: 9, col: 6, direction: "across" },
            { word: "ИНТЕРФЕЙС", clue: "Средство взаимодействия между системами", row: 11, col: 4, direction: "across" },
            { word: "СЕРВЕР", clue: "Компьютер, предоставляющий услуги другим компьютерам", row: 13, col: 7, direction: "across" },
            { word: "ПИТОН", clue: "Популярный язык программирования", row: 2, col: 4, direction: "down" },
            { word: "ЖАВАСКРИПТ", clue: "Язык для веб-разработки", row: 1, col: 10, direction: "down" },
            { word: "СИНТАКСИС", clue: "Правила написания кода", row: 2, col: 15, direction: "down" },
            { word: "ОБЪЕКТ", clue: "Экземпляр класса в ООП", row: 4, col: 12, direction: "down" },
            { word: "ЦИКЛ", clue: "Конструкция для повторения действий", row: 6, col: 9, direction: "down" },
            { word: "МАССИВ", clue: "Структура данных для хранения элементов", row: 8, col: 6, direction: "down" },
            { word: "КОД", clue: "Набор инструкций для компьютера", row: 10, col: 3, direction: "down" }
        ];

        currentCrossword.words = words;

        // Создание сетки 20x20
        const crossword = $('#crossword');
        for (let row = 0; row < 20; row++) {
            currentCrossword.grid[row] = [];
            for (let col = 0; col < 20; col++) {
                const cell = $('<div>').addClass('cell');
                crossword.append(cell);
                currentCrossword.grid[row][col] = {
                    element: cell,
                    isBlack: false,
                    words: []
                };
            }
        }

        // Размещение слов
        let wordNumber = 1;
        const acrossClues = $('#across-clues');
        const downClues = $('#down-clues');
        acrossClues.empty();
        downClues.empty();

        words.forEach(wordObj => {
            const { word, clue, row, col, direction } = wordObj;
            const wordLength = word.length;

            // Добавление подсказки
            const clueElement = $('<div>')
                .addClass('clue')
                .attr('data-word', `${direction}-${wordNumber}`)
                .html(`<span class="clue-number">${wordNumber}.</span> ${clue}`)
                .click(() => highlightWord(wordObj));

            direction === "across" ? acrossClues.append(clueElement) : downClues.append(clueElement);

            // Размещение в сетке
            for (let i = 0; i < wordLength; i++) {
                const currentRow = direction === "down" ? row + i - 1 : row - 1;
                const currentCol = direction === "across" ? col + i - 1 : col - 1;

                const cellData = currentCrossword.grid[currentRow][currentCol];
                cellData.isBlack = false;

                if (i === 0) {
                    cellData.element.append($('<span>').addClass('cell-number').text(wordNumber));
                }

                if (!cellData.element.children('input').length) {
                    const input = $('<input>')
                        .attr('type', 'text')
                        .attr('maxlength', '1')
                        .attr('data-row', currentRow)
                        .attr('data-col', currentCol)
                        .attr('data-word', `${direction}-${wordNumber}`)
                        .attr('data-position', i);
                    cellData.element.append(input);
                }

                cellData.words.push({ wordObj, position: i, wordNumber });
            }

            wordNumber++;
        });

        // Заполнение черных ячеек
        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 20; col++) {
                if (currentCrossword.grid[row][col].words.length === 0) {
                    currentCrossword.grid[row][col].isBlack = true;
                    currentCrossword.grid[row][col].element.addClass('black');
                }
            }
        }

        // Обработчики событий
        $('.cell input').on('input', function() {
            const direction = $(this).data('word').split('-')[0];
            const row = parseInt($(this).data('row'));
            const col = parseInt($(this).data('col'));
            const nextCell = getNextCell(row, col, direction);
            if (nextCell) nextCell.focus();
            checkWordOnComplete($(this));
        });

        $('.cell input').on('keydown', function(e) {
            if (e.key === 'Backspace' && $(this).val() === '') {
                const direction = $(this).data('word').split('-')[0];
                const row = parseInt($(this).data('row'));
                const col = parseInt($(this).data('col'));
                const prevCell = getPrevCell(row, col, direction);
                if (prevCell) {
                    prevCell.focus();
                    prevCell.val('');
                    e.preventDefault();
                }
            }
        });

        $('.cell input').on('click', function() {
            const wordId = $(this).data('word');
            const wordObj = words.find(w => `${w.direction}-${words.indexOf(w) + 1}` === wordId);
            if (wordObj) highlightWord(wordObj);
        });
    }

    // Вспомогательные функции
    function getPrevCell(row, col, direction) {
        const prevRow = direction === "across" ? row : row - 1;
        const prevCol = direction === "across" ? col - 1 : col;
        if (prevRow >= 0 && prevCol >= 0) {
            const prevCell = currentCrossword.grid[prevRow][prevCol];
            return prevCell.element.children('input').length ? prevCell.element.children('input') : null;
        }
        return null;
    }

    function getNextCell(row, col, direction) {
        const nextRow = direction === "across" ? row : row + 1;
        const nextCol = direction === "across" ? col + 1 : col;
        if (nextRow < 20 && nextCol < 20) {
            const nextCell = currentCrossword.grid[nextRow][nextCol];
            return nextCell.element.children('input').length ? nextCell.element.children('input') : null;
        }
        return null;
    }

    function checkWordOnComplete(inputElement) {
        const wordId = inputElement.data('word');
        const wordObj = words.find(w => `${w.direction}-${words.indexOf(w) + 1}` === wordId);
        if (!wordObj) return;

        const wordCells = $(`input[data-word="${wordId}"]`);
        let allFilled = true;
        wordCells.each(function() {
            if (!$(this).val()) allFilled = false;
        });

        if (allFilled) checkWord(wordObj);
        else wordCells.removeClass('correct incorrect');
    }

    function highlightWord(wordObj) {
        const { word, row, col, direction } = wordObj;
        const wordId = `${direction}-${words.indexOf(wordObj) + 1}`;
        $('.active-cell, .active-clue').removeClass('active-cell active-clue');
        for (let i = 0; i < word.length; i++) {
            const currentRow = direction === "down" ? row + i - 1 : row - 1;
            const currentCol = direction === "across" ? col + i - 1 : col - 1;
            currentCrossword.grid[currentRow][currentCol].element.addClass('active-cell');
        }
        $(`.clue[data-word="${wordId}"]`).addClass('active-clue');
    }

    function checkWord(wordObj) {
        const { word } = wordObj;
        const wordId = `${wordObj.direction}-${words.indexOf(wordObj) + 1}`;
        const wordCells = $(`input[data-word="${wordId}"]`);
        let isCorrect = true;

        wordCells.each(function(index) {
            const userChar = $(this).val().toUpperCase();
            if (userChar !== word[index]) isCorrect = false;
        });

        wordCells.toggleClass('correct', isCorrect).toggleClass('incorrect', !isCorrect);
        $(`.clue[data-word="${wordId}"]`).toggleClass('word-correct', isCorrect).toggleClass('word-incorrect', !isCorrect);
        if (isCorrect) checkAllWordsSolved();
    }

    function checkAllWordsSolved() {
        const allSolved = words.every(wordObj => {
            const wordId = `${wordObj.direction}-${words.indexOf(wordObj) + 1}`;
            return $(`input[data-word="${wordId}"]`).toArray().every(input => $(input).hasClass('correct'));
        });
        if (allSolved) {
            clearInterval(timerInterval);
            alert('Поздравляем! Вы успешно решили сканворд!');
        }
    }

    // Кнопка "Показать ответ"
    $('#reveal-btn').click(function() {
        const activeClue = $('.active-clue');
        if (activeClue.length) {
            const wordId = activeClue.data('word');
            const wordObj = words.find(w => `${w.direction}-${words.indexOf(w) + 1}` === wordId);
            revealWord(wordObj);
        } else {
            alert('Выберите слово для раскрытия (кликните на подсказку или ячейку)');
        }
    });

    function revealWord(wordObj) {
        const { word } = wordObj;
        const wordId = `${wordObj.direction}-${words.indexOf(wordObj) + 1}`;
        $(`input[data-word="${wordId}"]`).each(function(index) {
            $(this).val(word[index]).addClass('correct');
        });
        $(`.clue[data-word="${wordId}"]`).addClass('word-correct');
        checkAllWordsSolved();
    }

    // Новая игра
    $('#new-game-btn').click(function() {
        if (confirm('Начать новую игру? Текущий прогресс будет потерян.')) {
            generateCrossword();
            startTimer();
        }
    });
});