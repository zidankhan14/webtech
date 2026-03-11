// --- 1. DOM Element Selection ---
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');

// --- 2. Game State Variables ---
let board = ["", "", "", "", "", "", "", "", ""]; // Tracks the 9 cells
let currentPlayer = "X";
let isGameActive = true;
let scores = { X: 0, O: 0 }; // Challenge: Track scores

// All possible winning line combinations (indices of the board array)
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// --- 3. Gameplay Logic ---
function handleCellClick(event) {
    const clickedCell = event.target;
    // Get the index from the HTML data-index attribute
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Prevent marking if the cell is already filled OR if the game is over
    if (board[cellIndex] !== "" || !isGameActive) {
        return;
    }

    // Mark the internal board state and update UI
    board[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    
    // Add animation class (Challenge)
    clickedCell.classList.add('pop'); 

    // Check for win/draw before letting the next player go
    checkWinOrDraw();
}

// --- 4. Win and Draw Detection ---
function checkWinOrDraw() {
    let roundWon = false;
    let winningCells = [];

    // Loop through all winning combinations
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        
        // If any of the cells are empty, skip this combination
        if (board[a] === "" || board[b] === "" || board[c] === "") {
            continue;
        }
        
        // If all three match, we have a winner
        if (board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCells = [a, b, c]; // Save these to highlight them
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        isGameActive = false;
        
        // Highlight the winning cells
        winningCells.forEach(index => {
            cells[index].classList.add('win');
        });

        // Update score (Challenge)
        scores[currentPlayer]++;
        updateScoreboard();
        return; // Stop the function here
    }

    // Check for a draw (if there are no empty strings left in the board array)
    if (!board.includes("")) {
        statusText.textContent = "It's a draw!";
        isGameActive = false;
        return;
    }

    // If no win and no draw, switch players
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

// --- 5. Helper Functions ---
function updateScoreboard() {
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
}

// --- 6. Reset Functionality ---
function resetGame() {
    // Reset internal state
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s Turn`;

    // Clear the UI cells and remove classes
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('win', 'pop');
    });
}

// --- 7. Event Listeners ---
// Attach the click event to every cell
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
// Attach the click event to the reset button
resetBtn.addEventListener('click', resetGame);