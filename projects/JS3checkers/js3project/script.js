const checkersElement = document.getElementById('checkers');
const restartButton = document.getElementById('restart');
const currentPlayerElement = document.getElementById('currentPlayer');


let board = [];
let currentPlayer = 'red';
let selectedPiece = null;
let validMoves = [];


const initializeBoard = () => {
    board = [];
    for (let row = 0; row < 8; row++) {
        const rowArray = [];
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1 && row < 3) {
                rowArray.push({ piece: 'red', king: false });
            } else if ((row + col) % 2 === 1 && row > 4) {
                rowArray.push({ piece: 'black', king: false });
            } else {
                rowArray.push(null);
            }
        }
        board.push(rowArray);
    }
    updateCurrentPlayerDisplay();
    renderBoard();
};


const updateCurrentPlayerDisplay = () => {
    currentPlayerElement.textContent = `Player: ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}`;
    currentPlayerElement.style.backgroundColor = currentPlayer === 'red' ? '#e74c3c' : '#2c3e50';
};


const renderBoard = () => {
    checkersElement.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            cellElement.dataset.row = row;
            cellElement.dataset.col = col;


            const piece = board[row][col];
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece', piece.piece);
                if (piece.king) {
                    pieceElement.textContent = 'K';
                }
                cellElement.appendChild(pieceElement);
            }


            if (validMoves.some(move => move.row === row && move.col === col)) {
                cellElement.classList.add('highlight');
            }


            cellElement.addEventListener('click', handleCellClick);
            checkersElement.appendChild(cellElement);
        }
    }
};


const handleCellClick = (event) => {
    const row = parseInt(event.currentTarget.dataset.row);
    const col = parseInt(event.currentTarget.dataset.col);


    if (selectedPiece) {
        if (validMoves.some(move => move.row === row && move.col === col)) {
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
            selectedPiece = null;
            validMoves = [];
            renderBoard();
        } else {
            selectedPiece = null;
            validMoves = [];
            renderBoard();
        }
    } else if (board[row][col] && board[row][col].piece === currentPlayer) {
        selectedPiece = { row, col };
        validMoves = getValidMoves(row, col);
        renderBoard();
    }
};


const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol];
    const direction = piece.piece === 'red' ? 1 : -1;


    if (piece.king) {
        const rowStep = toRow > fromRow ? 1 : -1;
        const colStep = toCol > fromCol ? 1 : -1;
        let r = fromRow + rowStep;
        let c = fromCol + colStep;
        while (r !== toRow && c !== toCol) {
            if (board[r][c] !== null) return false;
            r += rowStep;
            c += colStep;
        }
        return true;
    } else {
        if (fromRow + direction === toRow && Math.abs(fromCol - toCol) === 1 && board[toRow][toCol] === null) {
            return true;
        }
        if (fromRow + 2 * direction === toRow && Math.abs(fromCol - toCol) === 2) {
            const middleRow = (fromRow + toRow) / 2;
            const middleCol = (fromCol + toCol) / 2;
            const middlePiece = board[middleRow][middleCol];
            if (middlePiece && middlePiece.piece !== piece.piece && board[toRow][toCol] === null) {
                return true;
            }
        }
    }


    return false;
};


const movePiece = (fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol];
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;


    const pieceElement = document.querySelector(`.cell[data-row="${toRow}"][data-col="${toCol}"] .piece`);
    if (pieceElement) {
        pieceElement.classList.add('move');
        setTimeout(() => pieceElement.classList.remove('move'), 500);
    }


    const distance = Math.abs(fromRow - toRow);
    if (distance >= 2) {
        let step = 1;
        const dr = (toRow - fromRow) / distance;
        const dc = (toCol - fromCol) / distance;
        for (let i = 1; i < distance; i++) {
            const middleRow = fromRow + dr * i;
            const middleCol = fromCol + dc * i;
            if (board[middleRow][middleCol] !== null && board[middleRow][middleCol].piece !== piece.piece) {
                board[middleRow][middleCol] = null;
                break;
            }
        }
    }


    if ((currentPlayer === 'red' && toRow === 7) || (currentPlayer === 'black' && toRow === 0)) {
        piece.king = true;
    }


    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    updateCurrentPlayerDisplay();


    checkWinCondition(); // Check for a win after each move
};


const checkWinCondition = () => {
    const redPieces = board.flat().filter(piece => piece && piece.piece === 'red').length;
    const blackPieces = board.flat().filter(piece => piece && piece.piece === 'black').length;


    if (redPieces === 0) {
        alert('Black wins!');
        initializeBoard();
    } else if (blackPieces === 0) {
        alert('Red wins!');
        initializeBoard();
    }
};


const getValidMoves = (row, col) => {
    const piece = board[row][col];
    const validMoves = [];
    const directions = piece.king ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : (piece.piece === 'red' ? [[1, 1], [1, -1]] : [[-1, 1], [-1, -1]]);


    directions.forEach(([dr, dc]) => {
        let step = 1;
        while (true) {
            const newRow = row + dr * step;
            const newCol = col + dc * step;
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            if (board[newRow][newCol] === null) {
                validMoves.push({ row: newRow, col: newCol });
            } else if (board[newRow][newCol].piece !== piece.piece) {
                const jumpRow = newRow + dr;
                const jumpCol = newCol + dc;
                if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8 && board[jumpRow][jumpCol] === null) {
                    validMoves.push({ row: jumpRow, col: jumpCol });
                }
                break;
            } else {
                break;
            }
            if (!piece.king) break;
            step++;
        }
    });


    return validMoves;
};


restartButton.addEventListener('click', initializeBoard);


initializeBoard();




