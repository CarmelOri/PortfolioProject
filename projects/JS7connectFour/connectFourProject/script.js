const columns = document.querySelectorAll('.column');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset');
let gameActive = true;
let currentPlayer = 'player1';
let gameState = Array(7).fill(null).map(() => Array(6).fill(null));


function handleColumnClick(e) {
    if (!gameActive) return;


    const columnIndex = Array.from(columns).indexOf(e.currentTarget);
    const columnCells = e.currentTarget.querySelectorAll('div');


    for (let i = 0; i < columnCells.length; i++) {
        if (!columnCells[i].classList.contains('player1') && !columnCells[i].classList.contains('player2')) {
            columnCells[i].classList.add(currentPlayer);
            gameState[columnIndex][i] = currentPlayer;
            checkWin();
            currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
            statusDisplay.textContent = `${currentPlayer === 'player1' ? "Player 1's" : "Player 2's"} turn`;
            return;
        }
    }
}


function checkWin() {
    const directions = [
        { x: 0, y: 1 },   // vertical
        { x: 1, y: 0 },   // horizontal
        { x: 1, y: 1 },   // diagonal /
        { x: 1, y: -1 }   // diagonal \
    ];


    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            if (gameState[x][y] === null) continue;


            for (let { x: dx, y: dy } of directions) {
                if (checkDirection(x, y, dx, dy)) {
                    gameActive = false;
                    alert(`${gameState[x][y] === 'player1' ? 'Red' : 'Yellow'} wins!`);
                    statusDisplay.textContent = `${gameState[x][y] === 'player1' ? "Player 1" : "Player 2"} wins!`;
                    return;
                }
            }
        }
    }


    if (gameState.every(column => column.every(cell => cell !== null))) {
        gameActive = false;
        alert("It's a draw!");
        statusDisplay.textContent = "It's a draw!";
    }
}


function checkDirection(x, y, dx, dy) {
    const target = gameState[x][y];


    for (let i = 1; i < 4; i++) {
        const newX = x + dx * i;
        const newY = y + dy * i;


        if (
            newX < 0 || newX >= 7 ||
            newY < 0 || newY >= 6 ||
            gameState[newX][newY] !== target
        ) {
            return false;
        }
    }


    return true;
}


function resetGame() {
    gameState = Array(7).fill(null).map(() => Array(6).fill(null));
    columns.forEach(column => column.querySelectorAll('div').forEach(cell => {
        cell.classList.remove('player1', 'player2');
    }));
    gameActive = true;
    currentPlayer = 'player1';
    statusDisplay.textContent = "Player 1's turn";
}


columns.forEach(column => column.addEventListener('click', handleColumnClick));
resetButton.addEventListener('click', resetGame);




