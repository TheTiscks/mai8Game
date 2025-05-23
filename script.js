$(document).ready(function() {
    // Глобальные переменные
    let words = [];
    let currentCrossword = null;
    let currentLevel = 1;
    let coins = parseInt(localStorage.getItem('userCoins')) || 0;

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

    // Выбор уровня сложности
    $('.level-btn').click(function() {
        $('.level-btn').removeClass('active');
        $(this).addClass('active');
        currentLevel = $(this).data('level');
        generateCrossword();
    });

    // Функция показа сканворда
    function showCrossword(email) {
        checkDailyBonus();
        $('#auth-container').hide();
        $('#crossword-container').show();
        $('#user-email').text(email);
        $('#user-avatar').text(email.charAt(0).toUpperCase());
        updateCoinsDisplay();
        generateCrossword();
    }

    // Обновление отображения монет
    function updateCoinsDisplay() {
        $('#user-coins').text(coins);
        localStorage.setItem('userCoins', coins.toString());
    }

    // Награда за уровень
    function awardLevelComplete() {
    // Дополнительная награда за сложность
    if (currentLevel === 2) {
        coins += 5; // Бонус 5 монет за сложный уровень
        $('#user-coins').text(coins);
    }
    localStorage.setItem('userCoins', coins.toString());
}

    // Ежедневный бонус
    function checkDailyBonus() {
        const lastLogin = localStorage.getItem('lastLogin');
        const today = new Date().toDateString();
        
        if (lastLogin !== today) {
            coins += 50;
            alert('Ежедневный бонус: +50 монет!');
            localStorage.setItem('lastLogin', today);
            updateCoinsDisplay();
        }
    }

    // Генерация сканворда
    function generateCrossword() {
        currentCrossword = {
            grid: [],
            words: []
        };

        const crossword = $('#crossword');
        crossword.empty();

        // Размер сетки
        const rows = 20;
        const cols = 20;

        // Список слов для сканворда
        if (currentLevel === 1) {
            words = [
                // По горизонтали
                { word: "ОТЕЛЬ", clue: "Место, где останавливаются туристы", row: 1, col: 3, direction: "across" },
                { word: "ПЛЯЖ", clue: "Песчаное место у моря", row: 3, col: 5, direction: "across" },
                { word: "САМОЛЕТ", clue: "Воздушный транспорт", row: 5, col: 2, direction: "across" },
                { word: "ЧЕМОДАН", clue: "В него складывают вещи для поездки", row: 7, col: 8, direction: "across" },
                { word: "КАРТА", clue: "Помогает не заблудиться", row: 9, col: 6, direction: "across" },
                { word: "ЭКСКУРСИЯ", clue: "Организованный осмотр достопримечательностей", row: 11, col: 4, direction: "across" },
                { word: "ПАСПОРТ", clue: "Документ для выезда за границу", row: 13, col: 7, direction: "across" },

                // По вертикали
                { word: "ГОРА", clue: "Высокая природная возвышенность", row: 2, col: 4, direction: "down" },
                { word: "МОРЕ", clue: "Большой водоем с соленой водой", row: 1, col: 10, direction: "down" },
                { word: "ВАЛЮТА", clue: "Деньги другой страны", row: 2, col: 15, direction: "down" },
                { word: "ОСТРОВ", clue: "Участок суши, окруженный водой", row: 4, col: 12, direction: "down" },
                { word: "ПОЕЗД", clue: "Железнодорожный транспорт", row: 6, col: 9, direction: "down" },
                { word: "СУВЕНИР", clue: "Памятная вещь из поездки", row: 8, col: 6, direction: "down" },
                { word: "ВИЗА", clue: "Разрешение на въезд в страну", row: 10, col: 3, direction: "down" }
            ];
        } else {
            // Средний уровень сложности
            words = [
                // По горизонтали
                { word: "АЭРОПОРТ", clue: "Место, откуда отправляются самолеты", row: 1, col: 1, direction: "across" },
                { word: "КУРОРТ", clue: "Место для отдыха и лечения", row: 3, col: 4, direction: "across" },
                { word: "БАГАЖ", clue: "Вещи, которые берут в поездку", row: 5, col: 2, direction: "across" },
                { word: "ГИД", clue: "Проводник, который показывает достопримечательности", row: 7, col: 8, direction: "across" },
                { word: "ПУТЕШЕСТВИЕ", clue: "Поездка в другую местность или страну", row: 9, col: 5, direction: "across" },
                { word: "ТУРИСТ", clue: "Человек, который посещает новые места", row: 11, col: 3, direction: "across" },
                { word: "ПАЛАТКА", clue: "Временное жилище для кемпинга", row: 13, col: 7, direction: "across" },

                // По вертикали
                { word: "ВОКЗАЛ", clue: "Место отправления поездов", row: 2, col: 6, direction: "down" },
                { word: "ПАСПОРТ", clue: "Главный документ путешественника", row: 1, col: 12, direction: "down" },
                { word: "ОКЕАН", clue: "Самый большой водоем на Земле", row: 2, col: 18, direction: "down" },
                { word: "РОЮКЗАК", clue: "Сумка для переноски вещей за спиной", row: 4, col: 15, direction: "down" },
                { word: "БИЛЕТ", clue: "Документ на проезд", row: 6, col: 10, direction: "down" },
                { word: "ГОРОД", clue: "Крупный населенный пункт", row: 8, col: 7, direction: "down" },
                { word: "ПЛЯЖ", clue: "Место для купания и загара", row: 10, col: 4, direction: "down" }
            ];
        }


        currentCrossword.words = words;

        // Создание сетки
        for (let row = 0; row < rows; row++) {
            currentCrossword.grid[row] = [];
            for (let col = 0; col < cols; col++) {
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

            // Проверка размещения
            if (
                (direction === "across" && col + wordLength - 1 > cols) ||
                (direction === "down" && row + wordLength - 1 > rows)
            ) {
                console.error(`Слово "${word}" не помещается`);
                return;
            }

            // ========== ДО ЭТОГО МЕСТА ========== //
            // Добавляем подсказку
            // ... следующий код ...

            // Добавляем подсказку
            const clueElement = $('<div>')
                .addClass('clue')
                .attr('data-word', `${direction}-${wordNumber}`)
                .html(`<span class="clue-number">${wordNumber}.</span> ${clue}`)
                .click(function() {
                    highlightWord(wordObj);
                });

            if (direction === "across") {
                acrossClues.append(clueElement);
            } else {
                downClues.append(clueElement);
            }

            // Размещаем слово в сетке
            for (let i = 0; i < wordLength; i++) {
                const currentRow = direction === "down" ? row + i - 1 : row - 1;
                const currentCol = direction === "across" ? col + i - 1 : col - 1;

                // Проверка границ
                if (currentRow < 0 || currentRow >= rows || currentCol < 0 || currentCol >= cols) {
                    console.error(`Ячейка (${currentRow}, ${currentCol}) выходит за границы сетки`);
                    continue;
                }

                const cellData = currentCrossword.grid[currentRow][currentCol];
                cellData.isBlack = false;

                // Добавляем номер слова
                if (i === 0) {
                    cellData.element.append($('<span>').addClass('cell-number').text(wordNumber));
                }

                // Создаем input для буквы
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

                // Добавляем информацию о слове в ячейку
                cellData.words.push({
                    wordObj,
                    position: i,
                    wordNumber
                });
            }

            wordNumber++;
        });

        // Заполняем остальные клетки как черные
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (currentCrossword.grid[row][col].words.length === 0) {
                    currentCrossword.grid[row][col].isBlack = true;
                    currentCrossword.grid[row][col].element.addClass('black');
                }
            }
        }

        // Навигация по сканворду
        $('.cell input').on('input', function() {
            const direction = $(this).data('word').split('-')[0];
            const wordNum = $(this).data('word').split('-')[1];
            const row = parseInt($(this).data('row'));
            const col = parseInt($(this).data('col'));

            // Автопереход к следующей ячейке
            const nextCell = getNextCell(row, col, direction);
            if (nextCell) {
                nextCell.focus();
            }

            // Проверка слова при полном вводе
            checkWordOnComplete($(this));
        });

        // Обработка Backspace для перехода к предыдущей ячейке
        $('.cell input').on('keydown', function(e) {
            if (e.key === 'Backspace' && $(this).val() === '') {
                const direction = $(this).data('word').split('-')[0];
                const row = parseInt($(this).data('row'));
                const col = parseInt($(this).data('col'));

                const prevCell = getPrevCell(row, col, direction);
                if (prevCell) {
                    prevCell.focus();
                    prevCell.val(''); // Очищаем предыдущую ячейку
                    e.preventDefault(); // Предотвращаем удаление символа в текущей ячейке
                }
            }
        });

        // Подсветка слова при клике на ячейку
        $('.cell input').on('click', function() {
            const wordId = $(this).data('word');
            if (wordId) {
                const wordObj = words.find(w =>
                    `${w.direction}-${words.indexOf(w) + 1}` === wordId
                );
                if (wordObj) {
                    highlightWord(wordObj);
                }
            }
        });
    }

    // Функция получения предыдущей ячейки
    function getPrevCell(row, col, direction) {
        let prevRow = row;
        let prevCol = col;

        if (direction === "across") {
            prevCol -= 1;
        } else {
            prevRow -= 1;
        }

        if (prevRow >= 0 && prevRow < 20 && prevCol >= 0 && prevCol < 20) {
            const prevCellData = currentCrossword.grid[prevRow][prevCol];
            if (!prevCellData.isBlack && prevCellData.element.children('input').length) {
                return prevCellData.element.children('input');
            }
        }
        return null;
    }

    // Проверка слова при полном вводе
    function checkWordOnComplete(inputElement) {
        const wordId = inputElement.data('word');
        const wordObj = words.find(w =>
            `${w.direction}-${words.indexOf(w) + 1}` === wordId
        );

        if (wordObj) {
            // Проверяем, заполнены ли все буквы слова
            const wordCells = $(`input[data-word="${wordId}"]`);
            let allFilled = true;

            wordCells.each(function() {
                if (!$(this).val()) {
                    allFilled = false;
                    return false; // break the loop
                }
            });

            if (allFilled) {
                checkWord(wordObj);
            } else {
                // Снимаем подсветку, если слово не полностью заполнено
                wordCells.removeClass('correct incorrect');
                $(`.clue[data-word="${wordId}"]`).removeClass('word-correct word-incorrect');
            }
        }
    }

    // Функция подсветки слова
    function highlightWord(wordObj) {
        const { word, row, col, direction } = wordObj;
        const wordLength = word.length;
        const wordNum = words.indexOf(wordObj) + 1;
        const wordId = `${direction}-${wordNum}`;

        // Снимаем подсветку
        $('.cell').removeClass('active-cell');
        $('.clue').removeClass('active-clue');

        // Подсвечиваем ячейки
        for (let i = 0; i < wordLength; i++) {
            const currentRow = direction === "down" ? row + i - 1 : row - 1;
            const currentCol = direction === "across" ? col + i - 1 : col - 1;

            if (currentRow >= 0 && currentRow < 20 && currentCol >= 0 && currentCol < 20) {
                currentCrossword.grid[currentRow][currentCol].element.addClass('active-cell');
            }
        }

        // Подсвечиваем подсказку
        $(`.clue[data-word="${wordId}"]`).addClass('active-clue');
    }

    // Функция получения следующей ячейки
    function getNextCell(row, col, direction) {
        let nextRow = row;
        let nextCol = col;

        if (direction === "across") {
            nextCol += 1;
        } else {
            nextRow += 1;
        }

        if (nextRow >= 0 && nextRow < 20 && nextCol >= 0 && nextCol < 20) {
            const nextCellData = currentCrossword.grid[nextRow][nextCol];
            if (!nextCellData.isBlack && nextCellData.element.children('input').length) {
                return nextCellData.element.children('input');
            }
        }
        return null;
    }

    // Проверка одного слова
    function checkWord(wordObj) {
        const { word, row, col, direction } = wordObj;
        const wordLength = word.length;
        const wordNum = words.indexOf(wordObj) + 1;
        const wordId = `${direction}-${wordNum}`;
        let isCorrect = true;

        // Проверяем каждую букву
        for (let i = 0; i < wordLength; i++) {
            const currentRow = direction === "down" ? row + i - 1 : row - 1;
            const currentCol = direction === "across" ? col + i - 1 : col - 1;

            if (currentRow < 0 || currentRow >= 20 || currentCol < 0 || currentCol >= 20) continue;

            const cellData = currentCrossword.grid[currentRow][currentCol];
            const input = cellData.element.children('input');
            const userChar = input.val().toUpperCase();
            const correctChar = word[i];

            if (userChar !== correctChar) {
                isCorrect = false;
                break;
            }
        }

        // Подсвечиваем слово в зависимости от результата проверки
        const wordCells = $(`input[data-word="${wordId}"]`);
        const clueElement = $(`.clue[data-word="${wordId}"]`);

        if (isCorrect) {
            wordCells.addClass('correct').removeClass('incorrect');
            clueElement.addClass('word-correct').removeClass('word-incorrect');

            // Проверяем, все ли слова решены
            checkAllWordsSolved();
        } else {
            wordCells.addClass('incorrect').removeClass('correct');
            clueElement.addClass('word-incorrect').removeClass('word-correct');
        }

        return isCorrect;
    }


// В функции checkAllWordsSolved
    function checkAllWordsSolved() {
        let allSolved = true;
        
        words.forEach(wordObj => {
            const wordId = `${wordObj.direction}-${words.indexOf(wordObj) + 1}`;
            const wordCells = $(`input[data-word="${wordId}"]`);
            
            let wordCorrect = true;
            wordCells.each(function() {
                if (!$(this).hasClass('correct')) {
                    wordCorrect = false;
                    return false;
                }
            });
            
            if (!wordCorrect) allSolved = false;
        });

        if (allSolved) {
            // Начисление валюты
            const levelReward = currentLevel * 15; // 15 монет за уровень 1, 30 за уровень 2
            coins += levelReward;
            
            // Сохранение и обновление
            localStorage.setItem('userCoins', coins.toString());
            $('#user-coins').text(coins);
            
            setTimeout(() => {
                alert(`🎉 Уровень пройден!\nПолучено: ${levelReward} монет`);
                awardLevelComplete();
            }, 300);
        }
        return allSolved;
    }

    // Кнопка показа ответа
    $('#reveal-btn').click(function() {
        const activeClue = $('.active-clue');
        if (activeClue.length) {
            const wordId = activeClue.data('word');
            const wordObj = words.find(w =>
                `${w.direction}-${words.indexOf(w) + 1}` === wordId
            );

            if (wordObj) {
                revealWord(wordObj);
            }
        } else {
            alert('Выберите слово для раскрытия (кликните на подсказку или ячейку)');
        }
    });

    // Раскрытие одного слова
    function revealWord(wordObj) {
        const { word, row, col, direction } = wordObj;
        const wordLength = word.length;
        const wordNum = words.indexOf(wordObj) + 1;
        const wordId = `${direction}-${wordNum}`;

        for (let i = 0; i < wordLength; i++) {
            const currentRow = direction === "down" ? row + i - 1 : row - 1;
            const currentCol = direction === "across" ? col + i - 1 : col - 1;

            if (currentRow < 0 || currentRow >= 20 || currentCol < 0 || currentCol >= 20) continue;

            const cellData = currentCrossword.grid[currentRow][currentCol];
            const input = cellData.element.children('input');

            input.val(word[i])
                .addClass('correct')
                .removeClass('incorrect');
        }

        // Подсвечиваем подсказку как правильную
        $(`.clue[data-word="${wordId}"]`).addClass('word-correct').removeClass('word-incorrect');

        // Проверяем, все ли слова решены
        checkAllWordsSolved();
    }

    // Новая игра
    $('#new-game-btn').click(function() {
        if (confirm('Начать новую игру? Текущий прогресс будет потерян.')) {
            generateCrossword();
        }
    });
});
