document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const resetBtn = document.getElementById('resetButton');
    let currentPlayer = "X";
    let board = ['', '', '', '', '', '', '', '', ''];
    let isGameActive = true;
    let aiMode = true;
    let aiLevel = 'level-1';
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

        if ('' !== board[index] || !isGameActive) {
            return;
        }

        board[index] = currentPlayer;
        e.target.innerText = currentPlayer;

        gameFlow();

        if (aiMode && isGameActive) {
            setTimeout(() => {
                AI()
            }, 500)
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
            toggleActivePlayer()
        }
    }

    const winCheck = () => {
        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];
            if(board[a] && board[a] === board[b] && board[a] === board[c] ){
                return true;
            }
        }
        return false;
    }

    const resetGame = () => {
        if (currentPlayer === "O") {
            toggleActivePlayer();  // Ensure the active player is reset to "X"
        }
        currentPlayer = "X";
        board = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => cell.innerText = '')
        isGameActive = true;
    }

    const toggleActivePlayer = () => {
        document.getElementById(`player-${currentPlayer}`).classList.toggle('is-active');
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        document.getElementById(`player-${currentPlayer}`).classList.toggle('is-active');
    };

    const AI = () => {
        if (aiLevel === 'level-1') {
            level1Ai();
        }
    }


    const level1Ai = () => {
        const emptyCells = getEmptyCells();
        if(emptyCells.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyCells.length)
            const move = emptyCells[randomIndex];

            board[move] = 'O'
            document.querySelector(`.cell[data-index='${move}']`).innerText = 'O';

            gameFlow()
        }
    }

    const getEmptyCells = () => {
        let emptyCells = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                emptyCells.push(i);
            }
        }

        return emptyCells;
    }

    cells.forEach(cell => cell.addEventListener('click', handleClick));
    resetBtn.addEventListener('click', resetGame);
})