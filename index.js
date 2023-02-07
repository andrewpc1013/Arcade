const startMenu = document.getElementsByClassName("start-menu");
const startButton = document.getElementById("start-button");
const gameArea = document.getElementById("game-area");
const table = document.getElementById("game-grid");
let numRows = 15;
let numColumns = 15;
let snake = {
    body: [],
    nextDirection: [1,0],
    length: 3,
    headLocation: [0,0]
}

startButton.addEventListener("click", startGame);
document.addEventListener("keydown", changeDirection);

// setTimeout(destroyGrid, 3000);

function gameTick() {
    moveSnake();
}

function createGrid(numRows, numColumns) {
    if (numRows === undefined) {
        numRows = 15;
    }

    if (numColumns === undefined) {
        numColumns = 15;
    }

    for (let i = 0; i < numRows; i++) {
        const tr = document.createElement("tr");

        for (let k = 0; k < numColumns; k++) {
            const td = document.createElement("td");

            // td.innerText = "x";

            if ((i + k) % 2) {
                td.className = "even-tiles";
            }
            else {
                td.className = "odd-tiles";
            }

            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
}

function destroyGrid() {
    table.innerHTML = "";
}

function startGame() {
    snake.length = 3;

    hideStartMenu();
    createGrid(numRows, numColumns);
    showGameArea();

    const startRow = Math.floor(Math.random() * numRows);
    const startColumn = Math.floor(Math.random() * numColumns);

    createSnakeSegment(startRow, startColumn);

    setInterval(gameTick, 1000);
}

function showGameArea() {
    gameArea.style.display = "block";
}

function hideGameArea() {
    gameArea.style.display = "none";
}

function showStartMenu() {
    for (let i = 0; i < startMenu.length; i++) {
        startMenu[i].style.display = "flex";
    }
}

function hideStartMenu() {
    for (let i = 0; i < startMenu.length; i++) {
        startMenu[i].style.display = "none";
    }
}

function createSnakeSegment(row, column) {
    snake.body.push([row, column]);
    snake.headLocation = [row, column];

    const cellIndex = (row * numColumns) + column;
    const cell = document.getElementsByTagName("td")[cellIndex];
    cell.className = "snake";
}

function destroySnakeSegment() {
    const position = snake.body.shift();
    
    const row = position[0];
    const column = position[1];
    const cellIndex = (row * numColumns) + column;
    const cell = document.getElementsByTagName("td")[cellIndex];
    if (cellIndex % 2) {
        cell.className = "even-tiles";
    }
    else {
        cell.className = "odd-tiles";
    }
}

function checkCollision() {
    return false;
}

function moveSnake() {
    const newLocation = [snake.headLocation[0] + snake.nextDirection[0], snake.headLocation[1] + snake.nextDirection[1]];
    console.log("yes " + newLocation);

    if (!checkCollision) {
        
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;

    console.log(keyPressed);
    // left = 37
    // up = 38
    // right = 39
    // down = 40 

    // a = 65
    // w = 87
    // d = 68
    // s = 83

    let newDirection = [];

    if (keyPressed === 37 || keyPressed === 65) {
        newDirection = [-1, 0]; //left
    }
    else if (keyPressed === 38 || keyPressed === 87) {
        newDirection = [0, 1]; //up
    }
    else if (keyPressed === 39 || keyPressed === 68) {
        newDirection = [1, 0]; //right
    }
    else if (keyPressed === 40 || keyPressed === 83) {
        newDirection = [0, -1]; //down
    }

    snake.nextDirection = newDirection;
}