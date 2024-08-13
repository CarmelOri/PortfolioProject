document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#grid-container');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const restartButton = document.getElementById('restart-button');
    const upButton = document.getElementById('up-button');
    const downButton = document.getElementById('down-button');
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');

    let squares = [];
    let score = 0;
    let highScore = 0;

    function createGrid() {
        grid.innerHTML = '';
        squares = [];
        for (let i = 0; i < 16; i++) {
            let square = document.createElement('div');
            square.classList.add('grid-cell');
            grid.appendChild(square);
            squares.push(square);
        }
        generate();
        generate();
    }

    function generate() {
        let emptySquares = squares.filter(square => square.innerHTML == '');
        if (emptySquares.length > 0) {
            let randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
            const newValue = Math.random() < 0.9 ? 2 : 4;
            randomSquare.innerHTML = newValue;
            randomSquare.setAttribute('data-value', newValue);
            animateTile(randomSquare);
            checkForGameOver();
        }
    }

    function move(direction) {
        let moved = false;
        let previousState = squares.map(square => square.innerHTML);

        for (let i = 0; i < 4; i++) {
            let rowOrColumn;
            if (direction === 'right' || direction === 'left') {
                rowOrColumn = [i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 3];
            } else {
                rowOrColumn = [i, i + 4, i + 8, i + 12];
            }

            let values = rowOrColumn.map(index => parseInt(squares[index].innerHTML) || 0);
            let mergedValues = mergeValues(values, direction);

            mergedValues.forEach((value, index) => {
                if (squares[rowOrColumn[index]].innerHTML != value.toString()) {
                    moved = true;
                }
                squares[rowOrColumn[index]].innerHTML = value ? value : '';
                setTileData(rowOrColumn[index]);
            });
        }

        let currentState = squares.map(square => square.innerHTML);
        if (moved || !arraysEqual(previousState, currentState)) {
            updateScore();
            generate();
        }
    }

    function mergeValues(values, direction) {
        if (direction === 'right' || direction === 'down') {
            values = values.reverse();
        }

        let mergedValues = [];
        for (let i = 0; i < values.length; i++) {
            if (values[i] !== 0) {
                if (mergedValues.length > 0 && mergedValues[mergedValues.length - 1] === values[i]) {
                    mergedValues[mergedValues.length - 1] *= 2;
                    score += mergedValues[mergedValues.length - 1];
                } else {
                    mergedValues.push(values[i]);
                }
            }
        }

        while (mergedValues.length < 4) {
            mergedValues.push(0);
        }

        if (direction === 'right' || direction === 'down') {
            mergedValues = mergedValues.reverse();
        }

        return mergedValues;
    }

    function setTileData(index) {
        let value = squares[index].innerHTML;
        squares[index].setAttribute('data-value', value);
    }

    function updateScore() {
        scoreDisplay.innerText = score;
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.innerText = highScore;
        }
    }

    function checkForGameOver() {
        let zeros = squares.filter(square => square.innerHTML == '').length;
        let canMove = false;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let current = parseInt(squares[i * 4 + j].innerHTML) || 0;
                let right = j < 3 ? parseInt(squares[i * 4 + j + 1].innerHTML) || 0 : 0;
                let down = i < 3 ? parseInt(squares[(i + 1) * 4 + j].innerHTML) || 0 : 0;

                if (current === right || current === down) {
                    canMove = true;
                }
            }
        }

        if (zeros === 0 && !canMove) {
            alert('Game Over!');
        }
    }

    function arraysEqual(a, b) {
        return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
    }

    function animateTile(tile) {
        tile.style.transform = 'scale(1.2)';
        setTimeout(() => {
            tile.style.transform = 'scale(1)';
        }, 200);
    }

    function restartGame() {
        score = 0;
        scoreDisplay.innerText = score;
        createGrid();
    }

    upButton.addEventListener('click', () => move('up'));
    downButton.addEventListener('click', () => move('down'));
    leftButton.addEventListener('click', () => move('left'));
    rightButton.addEventListener('click', () => move('right'));

    restartButton.addEventListener('click', restartGame);

    createGrid();
});




