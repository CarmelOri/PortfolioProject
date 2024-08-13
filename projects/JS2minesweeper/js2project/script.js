const boardSize = { rows: 7, cols: 14 };
const mineCount = 20;
let board = [];
let isGameActive = true;
let isMarking = false;
let timer;
let startTime;
let elapsedTime = 0;
let isFirstClick = true;

const minesweeperElement = document.getElementById('minesweeper');
const restartButton = document.getElementById('restart');
const toggleButton = document.getElementById('toggle');
const timerElement = document.getElementById('timer');

const initializeBoard = () => {
    board = Array.from({ length: boardSize.rows }, () =>
        Array.from({ length: boardSize.cols }, () => ({
            revealed: false,
            mine: false,
            adjacentMines: 0,
            marked: false
        }))
    );
};

const placeMines = (excludeRow, excludeCol) => {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * boardSize.rows);
        const col = Math.floor(Math.random() * boardSize.cols);
        if ((row !== excludeRow || col !== excludeCol) && !board[row][col].mine) {
            board[row][col].mine = true;
            minesPlaced++;
        }
    }

    // Calculate adjacent mines
    for (let row = 0; row < boardSize.rows; row++) {
        for (let col = 0; col < boardSize.cols; col++) {
            if (!board[row][col].mine) {
                let count = 0;
                for (let r = -1; r <= 1; r++) {
                    for (let c = -1; c <= 1; c++) {
                        const newRow = row + r;
                        const newCol = col + c;
                        if (newRow >= 0 && newRow < boardSize.rows && newCol >= 0 && newCol < boardSize.cols && board[newRow][newCol].mine) {
                            count++;
                        }
                    }
                }
                board[row][col].adjacentMines = count;
            }
        }
    }
};

const renderBoard = () => {
    minesweeperElement.innerHTML = '';
    for (let row = 0; row < boardSize.rows; row++) {
        for (let col = 0; col < boardSize.cols; col++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.row = row;
            cellElement.dataset.col = col;

            if (board[row][col].revealed) {
                cellElement.classList.add('revealed');
                if (board[row][col].mine) {
                    cellElement.classList.add('bomb');
                    cellElement.textContent = '💣';
                } else if (board[row][col].adjacentMines > 0) {
                    cellElement.textContent = board[row][col].adjacentMines;
                }
            } else if (board[row][col].marked) {
                cellElement.classList.add('marked');
                cellElement.textContent = '⚠️';
            }

            cellElement.addEventListener('click', handleCellClick);
            minesweeperElement.appendChild(cellElement);
        }
    }
};

const handleCellClick = (event) => {
    if (!isGameActive) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col].revealed) return;

    if (isFirstClick) {
        isFirstClick = false;
        placeMines(row, col);
        startTime = Date.now();
        timer = setInterval(updateTimer, 1000);
    }

    if (isMarking) {
        board[row][col].marked = !board[row][col].marked;
    } else {
        if (board[row][col].marked) return;

        if (board[row][col].mine) {
            revealAllMines();
            setStatusMessage('Game Over!');
            isGameActive = false;
            clearInterval(timer);
        } else {
            revealCell(row, col);
            if (checkWin()) {
                setStatusMessage('You Win!');
                isGameActive = false;
                clearInterval(timer);
            }
        }
    }

    renderBoard();
};

const revealCell = (row, col) => {
    if (row < 0 || row >= boardSize.rows || col < 0 || col >= boardSize.cols || board[row][col].revealed) return;

    board[row][col].revealed = true;

    if (board[row][col].adjacentMines === 0) {
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                revealCell(row + r, col + c);
            }
        }
    }
};

const revealAllMines = () => {
    for (let row = 0; row < boardSize.rows; row++) {
        for (let col = 0; col < boardSize.cols; col++) {
            if (board[row][col].mine) {
                board[row][col].revealed = true;
            }
        }
    }
};

const checkWin = () => {
    for (let row = 0; row < boardSize.rows; row++) {
        for (let col = 0; col < boardSize.cols; col++) {
            if (!board[row][col].mine && !board[row][col].revealed) {
                return false;
            }
        }
    }
    return true;
};

const setStatusMessage = (message) => {
    setTimeout(() => alert(message), 100);
};

const handleRestartGame = () => {
    isGameActive = true;
    isMarking = false;
    isFirstClick = true;
    startTime = null;
    elapsedTime = 0;
    clearInterval(timer);
    updateTimerDisplay();
    initializeBoard();
    renderBoard();
    toggleButton.classList.remove('active');
    toggleButton.textContent = 'Marking Mode';
};

const toggleMarkingMode = () => {
    isMarking = !isMarking;
    toggleButton.classList.toggle('active');
    toggleButton.textContent = isMarking ? 'Marking Mode' : 'Revealing Mode';
};

const updateTimer = () => {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    updateTimerDisplay();
};

const updateTimerDisplay = () => {
    timerElement.textContent = `Time: ${elapsedTime}s`;
};

restartButton.addEventListener('click', handleRestartGame);
toggleButton.addEventListener('click', toggleMarkingMode);

initializeBoard();
renderBoard();



