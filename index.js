const startMenu = document.getElementsByClassName("start-menu");
const startButton = document.getElementById("start-button");
const optionsButton = document.getElementById("options-button");
const gameInfo = document.getElementsByClassName("game-info");
const scoreDisplay = document.getElementById("score-display");
const highScoreDisplay = document.getElementById("high-score-display");
const gameArea = document.getElementById("game-area");
const table = document.getElementById("game-grid");
const loseMenu = document.getElementsByClassName("lose-menu");
const restartButton = document.getElementById("restart-button");

const defaultSnake = {
    body: [],
    nextDirection: [1,0],
    length: 3,
    headLocation: [0,0]
}
let numRows = 15;
let numColumns = 15;
let snake = {};
let gameTickID;
let tickSpeed = 250;
let currentScore = 0;
let highScore = 0;
let applePosition = [0,0];

startButton.addEventListener("click", startGame);
optionsButton.addEventListener("click", openOptionsMenu);
restartButton.addEventListener("click", restartGame);
document.addEventListener("keydown", changeDirection);

function startGame() {
    snake.body = defaultSnake.body;
    snake.nextDirection = defaultSnake.nextDirection;
    snake.length = defaultSnake.length;
    snake.headLocation = defaultSnake.headLocation;
    currentScore = 0;
    scoreDisplay.innerText = `Score: ${currentScore}`;

    hideElement(startMenu);
    hideElement(loseMenu);
    createGrid(numRows, numColumns);
    showGameArea();
    showGameInfo();

    const startRow = Math.floor(Math.random() * (numRows - 2));
    const startColumn = Math.floor(Math.random() * numColumns);

    createSnakeSegment(startRow, startColumn);

    createApple();

    gameTickID = setInterval(gameTick, tickSpeed);
}

function restartGame() {
    destroyGrid();
    startGame();
}

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

function showGameArea() {
    gameArea.style.display = "block";
}

function hideGameArea() {
    gameArea.style.display = "none";
}

function showElement(element) {
    for (let i = 0; i < element.length; i++) {
        element[i].style.display = "flex";
    }
}

function hideElement(element) {
    for (let i = 0; i < element.length; i++) {
        element[i].style.display = "none";
    }
}

function showLoseMenu() {
    for (let i = 0; i < loseMenu.length; i++) {
        loseMenu[i].style.display = "flex";
    }
}

function hideLoseMenu() {
    for (let i = 0; i < loseMenu.length; i++) {
        loseMenu[i].style.display = "none";
    }
}

function showGameInfo() {
    for (let i = 0; i < gameInfo.length; i++) {
        gameInfo[i].style.display = "flex";
    }
}

function hideGameInfo() {
    for (let i = 0; i < gameInfo.length; i++) {
        gameInfo[i].style.display = "none";
    }
}

function openOptionsMenu() {
    console.log("options");
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

function increaseSnakeLength(amount) {
    if (amount === undefined) {
        amount = 1;
    }

    snake.length += amount;
}

function checkCollision(row, column) {
    return (checkWallCollision(row, column) || checkSelfCollision(row, column));
}

function checkWallCollision(row, column) {
    if (row >= numRows || row < 0) {
        return true;
    }
    else if (column >= numColumns || column < 0) {
        return true;
    }
    else {
        return false;
    }
}

function checkSelfCollision(row, column) {
    if ((snake.body.length === snake.length) && (row === snake.body[0][0] && column === snake.body[0][1])) {
        return false;
    }

    for (let i = 0; i < snake.body.length; i++) {
        if (row === snake.body[i][0] && column === snake.body[i][1]) {
            return true;
        }
    }

    return false;
}

function checkAppleCollision(row, column) {
    if (row === applePosition[0] && column === applePosition[1]) {
        return true;
    }
    else {
        return false;
    }
}

function moveSnake() {
    const newRow = snake.headLocation[0] + snake.nextDirection[0];
    const newColumn = snake.headLocation[1] + snake.nextDirection[1];

    if (!checkCollision(newRow, newColumn)) {
        while (snake.body.length >= snake.length) {
            destroySnakeSegment();
        }

        if (checkAppleCollision(newRow, newColumn)) {
            eatApple();
        }

        createSnakeSegment(newRow, newColumn);
    }
    else {
        loseGame();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;

    let newDirection = [];

    if (keyPressed === 37 || keyPressed === 65) {
        newDirection = [0, -1]; //left
    }
    else if (keyPressed === 38 || keyPressed === 87) {
        newDirection = [-1, 0]; //up
    }
    else if (keyPressed === 39 || keyPressed === 68) {
        newDirection = [0, 1]; //right
    }
    else if (keyPressed === 40 || keyPressed === 83) {
        newDirection = [1, 0]; //down
    }
    else {
        newDirection = snake.nextDirection;
    }

    let snakeNeckRow = snake.body[snake.body.length - 2][0];
    let snakeNeckColumn = snake.body[snake.body.length - 2][1];

    if (snake.body.length > 1) {
        if (!(((snake.headLocation[0] + newDirection[0]) === (snakeNeckRow)) && ((snake.headLocation[1] + newDirection[1]) === (snakeNeckColumn)))) {
            snake.nextDirection = newDirection;
        }
    }
    else {
        snake.nextDirection = newDirection;
    }
}

function loseGame() {
    clearInterval(gameTickID);

    showElement(loseMenu);
}

function increaseScore(amount) {
    if (amount === undefined) {
        amount = 1;
    }

    currentScore += amount;
    scoreDisplay.innerText = `Score: ${currentScore}`;

    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreDisplay.innerText = `High Score: ${highScore}`;
    }
}

function createApple() {
    let badPosition = true;
    let row;
    let column;
    let oldPosition = applePosition.slice(0);

    while (badPosition) {
        row = Math.floor(Math.random() * numRows);
        column = Math.floor(Math.random() * numColumns);

        badPosition = false;
        for (let i = 0; i < snake.body.length; i++) {
            if ((row === snake.body[i][0] && column === snake.body[i][1]) || (row === oldPosition[0] && column === oldPosition[1])) {
                badPosition = true;
            }
        }
    }

    applePosition = [row, column];
    const cellIndex = (row * numColumns) + column;
    const cell = document.getElementsByTagName("td")[cellIndex];
    cell.className = "apple";
}

function eatApple() {
    increaseScore(1);

    createApple();

    increaseSnakeLength(1);
}