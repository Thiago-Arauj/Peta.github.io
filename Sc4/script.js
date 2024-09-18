const playerGrid = document.getElementById('playerGrid');
const opponentGrid = document.getElementById('opponentGrid');
const message = document.getElementById('message');

let playerShips = [];
let opponentShips = [];
let currentPlayer = 'player';

// Initialize the grids
function createGrid(gridElement, isPlayer) {
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;

        if (isPlayer) {
            cell.addEventListener('click', () => placeShip(cell));
        } else {
            cell.addEventListener('click', () => attack(cell));
        }

        gridElement.appendChild(cell);
    }
}

// Place ships on the player's grid
function placeShip(cell) {
    if (playerShips.length < 5 && !cell.classList.contains('ship')) {
        cell.classList.add('ship');
        playerShips.push(cell.dataset.index);
        
        if (playerShips.length === 5) {
            message.textContent = "All ships placed! Start attacking!";
            playerGrid.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', placeShip));
            opponentGrid.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', () => attack(cell)));
        }
    }
}

// Attack the opponent's grid
function attack(cell) {
    if (currentPlayer === 'player' && !cell.classList.contains('hit') && !cell.classList.contains('miss')) {
        if (opponentShips.includes(cell.dataset.index)) {
            cell.classList.add('hit');
            message.textContent = "Hit!";
        } else {
            cell.classList.add('miss');
            message.textContent = "Miss!";
        }
        
        currentPlayer = 'opponent';
        
        // Randomly attack player's grid for AI
        setTimeout(() => opponentAttack(), 1000);
    }
}

// Opponent's random attack
function opponentAttack() {
    const cells = Array.from(playerGrid.children);
    
    while (currentPlayer === 'opponent') {
        const randomCell = cells[Math.floor(Math.random() * cells.length)];
        
        if (!randomCell.classList.contains('hit') && !randomCell.classList.contains('miss')) {
            if (playerShips.includes(randomCell.dataset.index)) {
                randomCell.classList.add('hit');
                message.textContent = "Opponent hit your ship!";
            } else {
                randomCell.classList.add('miss');
                message.textContent = "Opponent missed!";
            }
            
            currentPlayer = 'player';
            break; // Exit loop after one attack
        }
    }
}

// Create grids for player and opponent
createGrid(playerGrid, true);
createGrid(opponentGrid, false);

// Randomly place opponent's ships for simplicity
function placeOpponentShips() {
    while (opponentShips.length < 5) {
        const randomIndex = Math.floor(Math.random() * 100);
        
        if (!opponentShips.includes(randomIndex.toString())) {
            opponentShips.push(randomIndex.toString());
            opponentGrid.children[randomIndex].classList.add('ship'); // Visually represent the ship
        }
    }
}
placeOpponentShips();