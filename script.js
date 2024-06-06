document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const resetBtn = document.getElementById('resetButton');
    let currentPlayer = "X";
    let board = ['', '', '', '', '', '', '', '', ''];
    let isGameActive = true;
    let clickAble = true;
    let aiMode = true;
    let aiLevel = 'level-3';

    document.getElementById(`player-${currentPlayer}`).classList.add('is-active');

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleClick = (e) => {
        const index = e.target.dataset.index;

        if (board[index] !== '' || !isGameActive || !clickAble) {
            return;
        }

        board[index] = currentPlayer;
        e.target.innerText = currentPlayer;

        gameFlow();

        clickAble = !clickAble;

        if (aiMode && isGameActive) {
            setTimeout(() => {
                AI();
            }, 500);
        }
    }

    const gameFlow = () => {
        if (winCheck()) {
            setTimeout(() => {
                alert(`Winner: ${currentPlayer}`);
            }, 50);
            isGameActive = false;
        } else if (board.includes('') === false) {
            isGameActive = false;
            setTimeout(() => {
                alert('Draw');
            }, 50);
        } else {
            toggleActivePlayer();
        }
    }

    const winCheck = () => {
        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
        return false;
    }

    const checkWinnable = (player) => {
        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];

            if (board[a] === player && board[b] === player && board[c] === '') {
                return c;
            }
            if (board[a] === player && board[c] === player && board[b] === '') {
                return b;
            }
            if (board[b] === player && board[c] === player && board[a] === '') {
                return a;
            }
        }
        return false;
    }

    const getAiMove = () => {
        let move = checkWinnable(currentPlayer);
        if (move !== false) {
            return move;
        }

        let opponent = currentPlayer === 'X' ? 'O' : 'X';
        move = checkWinnable(opponent);
        if (move !== false) {
            return move;
        }

        return false;
    }

    const randomPlacement = (emptyCells) => {
        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        const move = emptyCells[randomIndex];

        board[move] = currentPlayer;
        document.querySelector(`.cell[data-index='${move}']`).innerText = currentPlayer;

        gameFlow();
        clickAble = !clickAble;
    }

    const resetGame = () => {
        currentPlayer = "X";
        board = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => cell.innerText = '');
        isGameActive = true;
        clickAble = true;
        document.querySelectorAll('.player').forEach(el => el.classList.remove('is-active'));
        document.getElementById(`player-${currentPlayer}`).classList.add('is-active');
    }

    const toggleActivePlayer = () => {
        document.getElementById(`player-${currentPlayer}`).classList.toggle('is-active');
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        document.getElementById(`player-${currentPlayer}`).classList.toggle('is-active');
    };

    const AI = () => {
        if (aiLevel === 'level-1') {
            level1Ai();
        } else if (aiLevel === 'level-2') {
            level2Ai();
        } else if (aiLevel === 'level-3') {
            level3Ai();
        }
    }

    const level1Ai = () => {
        const emptyCells = getEmptyCells();
        if (emptyCells.length > 0) {
            randomPlacement(emptyCells);
        }
    }

    const level2Ai = () => {
        const emptyCells = getEmptyCells();
        if (emptyCells.length > 0) {
            let winnableIndex = getAiMove();
            if (winnableIndex || winnableIndex === 0) {
                board[winnableIndex] = currentPlayer;
                document.querySelector(`.cell[data-index='${winnableIndex}']`).innerText = currentPlayer;
                gameFlow();
                clickAble = !clickAble;
            } else {
                randomPlacement(emptyCells);
            }
        }
    }

    const level3Ai = () => {
        const move = bestMove();
        if (move !== undefined) {
            board[move] = currentPlayer;
            document.querySelector(`.cell[data-index='${move}']`).innerText = currentPlayer;
            gameFlow();
            clickAble = !clickAble;
        }
    };

    const getEmptyCells = () => {
        let emptyCells = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                emptyCells.push(i);
            }
        }
        return emptyCells;
    }

    const minimax = (newBoard, depth, isMaximizing) => {
        let scores = { X: -10, O: 10, draw: 0 };
        let result = checkWinner();
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < newBoard.length; i++) {
                if (newBoard[i] === '') {
                    newBoard[i] = currentPlayer;
                    let score = minimax(newBoard, depth + 1, false);
                    newBoard[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < newBoard.length; i++) {
                if (newBoard[i] === '') {
                    newBoard[i] = currentPlayer === 'X' ? 'O' : 'X';
                    let score = minimax(newBoard, depth + 1, true);
                    newBoard[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const bestMove = () => {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = currentPlayer;
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    };

    const checkWinner = () => {
        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.includes('') ? null : 'draw';
    };

    cells.forEach(cell => cell.addEventListener('click', handleClick));
    resetBtn.addEventListener('click', resetGame);
});
