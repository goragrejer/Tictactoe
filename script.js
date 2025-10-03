// 1. State Variables and Constants
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart-button');
const cells = Array.from(document.querySelectorAll('.cell')); // Convert NodeList to an Array for easier handling

// Array to store the game board state. 9 elements, initially all empty strings.
let gameState = ["", "", "", "", "", "", "", "", ""]; 
let currentPlayer = "X";
let gameActive = true;

// 2. Winning Combinations (Indices from 0 to 8)
const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// 3. Messages to display to the user
const winMessage = (player) => `Player ${player} has won! 🎉`;
const drawMessage = `Game ended in a draw! 😟`;
const currentPlayerTurn = (player) => `It's Player ${player}'s turn`;

// Initial status display
statusDisplay.innerHTML = currentPlayerTurn(currentPlayer);

/**
 * Updates the message displayed to the user.
 * @param {string} message - The HTML string to display.
 */
function updateStatus(message) {
    statusDisplay.innerHTML = message;
}

/**
 * Handles a player making a move on the game board.
 * @param {object} clickedCell - The HTML element of the cell that was clicked.
 * @param {number} clickedCellIndex - The index (0-8) of the clicked cell.
 */
function handleMove(clickedCell, clickedCellIndex) {
    // 1. Update the gameState array with the current player's mark
    gameState[clickedCellIndex] = currentPlayer;

    // 2. Update the visual display in the browser
    clickedCell.innerHTML = currentPlayer;

    // 3. Check for a win or a draw
    checkForWinOrDraw();
}

/**
 * Checks if the current game state results in a win or a draw.
 */
function checkForWinOrDraw() {
    let roundWon = false;
    
    // Check all winning conditions
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        // Get the values from the current gameState array for the three indices
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        // If any of the spots are empty, this condition is not met yet
        if (a === '' || b === '' || c === '') {
            continue;
        }

        // Check if all three spots are the same (a === b and a === c)
        if (a === b && b === c) {
            roundWon = true;
            break; // We found a winner, no need to check others
        }
    }

    if (roundWon) {
        updateStatus(winMessage(currentPlayer));
        gameActive = false; // Stop the game
        return;
    }

    // Check for a Draw - if there are no empty strings left and no one has won
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        updateStatus(drawMessage);
        gameActive = false; // Stop the game
        return;
    }

    // If no win and no draw, switch the player
    handlePlayerChange();
}

/**
 * Switches the current player and updates the status display.
 */
function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus(currentPlayerTurn(currentPlayer));
}

/**
 * The main function called when a cell on the board is clicked.
 * @param {object} event - The click event object.
 */
function handleCellClick(event) {
    const clickedCell = event.target;
    // Get the index from the data-cell-index attribute (which is a string, so parse it to int)
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // Check if the cell is already played or if the game is over
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleMove(clickedCell, clickedCellIndex);
}

/**
 * Resets all game state variables and the visual board.
 */
function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    updateStatus(currentPlayerTurn(currentPlayer));
    
    // Clear the visual content of all cells
    cells.forEach(cell => cell.innerHTML = "");
}


// 6. Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
