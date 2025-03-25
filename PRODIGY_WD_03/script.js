const X_CLASS = 'X';
const O_CLASS = 'O';
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const playerFirstBtn = document.getElementById('playerFirst');
const aiFirstBtn = document.getElementById('aiFirst');

let isPlayerTurn = true;
let isGameActive = true;
let playerSymbol = X_CLASS;
let aiSymbol = O_CLASS;

playerFirstBtn.addEventListener('click', () => setPlayerFirst(true));
aiFirstBtn.addEventListener('click', () => setPlayerFirst(false));
restartButton.addEventListener('click', startGame);

function setPlayerFirst(playerFirst) {
    playerFirstBtn.classList.toggle('active', playerFirst);
    aiFirstBtn.classList.toggle('active', !playerFirst);
    playerSymbol = playerFirst ? X_CLASS : O_CLASS;
    aiSymbol = playerFirst ? O_CLASS : X_CLASS;
    startGame();
}

function startGame() {
    isGameActive = true;
    isPlayerTurn = playerSymbol === X_CLASS;
    cellElements.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove(X_CLASS, O_CLASS, 'winning-cell');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setStatusMessage();
    
    if (!isPlayerTurn) {
        makeAiMove();
    }
}

// Add at the top with other constants
let isAIMode = true;

// Add with other DOM elements
const vsAIBtn = document.getElementById('vsAI');
const vsPlayerBtn = document.getElementById('vsPlayer');
const aiOptions = document.getElementById('aiOptions');

// Add these event listeners after other listeners
vsAIBtn.addEventListener('click', () => setGameMode(true));
vsPlayerBtn.addEventListener('click', () => setGameMode(false));

function setGameMode(aiMode) {
    isAIMode = aiMode;
    vsAIBtn.classList.toggle('active', aiMode);
    vsPlayerBtn.classList.toggle('active', !aiMode);
    aiOptions.style.display = aiMode ? 'block' : 'none';
    startGame();
}

// Modify handleClick function
function handleClick(e) {
    if (!isGameActive) return;
    
    const cell = e.target;
    if (cell.textContent) return;

    const currentSymbol = isAIMode ? playerSymbol : (isPlayerTurn ? X_CLASS : O_CLASS);
    placeMark(cell, currentSymbol);
    
    if (checkWin(currentSymbol)) {
        endGame(false);
        return;
    }
    
    if (isDraw()) {
        endGame(true);
        return;
    }
    
    isPlayerTurn = !isPlayerTurn;
    setStatusMessage();

    if (isAIMode && !isPlayerTurn) {
        setTimeout(makeAiMove, 500);
    }
}

// Modify setStatusMessage function
function setStatusMessage() {
    if (isAIMode) {
        statusElement.textContent = isPlayerTurn ? "Your turn" : "AI thinking...";
    } else {
        statusElement.textContent = `Player ${isPlayerTurn ? 'X' : 'O'}'s turn`;
    }
}

// Modify endGame function
function endGame(draw) {
    isGameActive = false;
    if (draw) {
        statusElement.textContent = "It's a draw!";
    } else {
        if (isAIMode) {
            statusElement.textContent = isPlayerTurn ? "You win!" : "AI wins!";
        } else {
            statusElement.textContent = `Player ${isPlayerTurn ? 'X' : 'O'} wins!`;
        }
    }
}

function makeAiMove() {
    if (!isGameActive) return;
    
    const bestMove = findBestMove();
    const cell = cellElements[bestMove];
    
    placeMark(cell, aiSymbol);
    
    if (checkWin(aiSymbol)) {
        endGame(false);
        return;
    }
    
    if (isDraw()) {
        endGame(true);
        return;
    }
    
    isPlayerTurn = true;
    setStatusMessage();
}

function findBestMove() {
    let bestScore = -Infinity;
    let bestMove = 0;
    
    for (let i = 0; i < 9; i++) {
        if (!cellElements[i].textContent) {
            cellElements[i].textContent = aiSymbol;
            let score = minimax(false, 0);
            cellElements[i].textContent = '';
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    return bestMove;
}

function minimax(isMaximizing, depth) {
    if (checkWin(aiSymbol)) return 10 - depth;
    if (checkWin(playerSymbol)) return depth - 10;
    if (isDraw()) return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!cellElements[i].textContent) {
                cellElements[i].textContent = aiSymbol;
                bestScore = Math.max(bestScore, minimax(false, depth + 1));
                cellElements[i].textContent = '';
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!cellElements[i].textContent) {
                cellElements[i].textContent = playerSymbol;
                bestScore = Math.min(bestScore, minimax(true, depth + 1));
                cellElements[i].textContent = '';
            }
        }
        return bestScore;
    }
}

function placeMark(cell, currentClass) {
    cell.textContent = currentClass;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        if (combination.every(index => cellElements[index].textContent === currentClass)) {
            combination.forEach(index => cellElements[index].classList.add('winning-cell'));
            return true;
        }
        return false;
    });
}

function isDraw() {
    return [...cellElements].every(cell => cell.textContent);
}

function endGame(draw) {
    isGameActive = false;
    if (draw) {
        statusElement.textContent = "It's a draw!";
    } else {
        statusElement.textContent = isPlayerTurn ? "You win!" : "AI wins!";
    }
}

startGame();