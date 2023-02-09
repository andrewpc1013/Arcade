const startMenu = document.getElementsByClassName("start-menu");
const startButton = document.getElementById("start-button");
const optionsButton = document.getElementById("options-button");
const optionsMenu = document.getElementsByClassName("options-menu");
const difficultyInput = document.getElementById("difficulty-input");
const accelerationSelect = document.getElementById("acceleration-input");
const mainMenuButton1 = document.getElementById("main-menu-button-1");
const mainMenuButton2 = document.getElementById("main-menu-button-2");
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
let difficulty = 5;
let difficultyAcceleration = false;
let tickSpeed = 250;
let currentScore = 0;
let highScore = 0;
let applePosition = [0,0];
let snakeColors = [[0, 255, 0]];

startButton.addEventListener("click", startGame);
optionsButton.addEventListener("click", openOptionsMenu);
mainMenuButton1.addEventListener("click", openMainMenu);
mainMenuButton2.addEventListener("click", openMainMenu);
restartButton.addEventListener("click", restartGame);
document.addEventListener("keydown", changeDirection);
accelerationSelect.addEventListener("change", updateDifficultyAccel);

function startGame() {
    snake.body = defaultSnake.body.slice(0);
    snake.nextDirection = defaultSnake.nextDirection;
    snake.length = defaultSnake.length;
    snake.headLocation = defaultSnake.headLocation;
    currentScore = 0;
    scoreDisplay.innerText = `Score: ${currentScore}`;

    updateDifficulty();

    hideElement(startMenu);
    hideElement(loseMenu);
    if (table.children.length > 0) {
        destroyGrid();
    }
    createGrid(numRows, numColumns);
    showElement(gameArea, "self");
    showElement(gameInfo);

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
    updateSnakeColors()
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

function showElement(element, selection) {
    if (selection === undefined || selection === "all") {
        for (let i = 0; i < element.length; i++) {
            element[i].style.display = "flex";
        }
    }
    else if (selection === "self") {
        element.style.display = "flex";
    }
}

function hideElement(element, selection) {
    if (selection === undefined || selection === "all") {
        for (let i = 0; i < element.length; i++) {
            element[i].style.display = "none";
        }
    }
    else if (selection === "self") {
        element.style.display = "none";
    }
}

function openOptionsMenu() {
    hideElement(startMenu);
    showElement(optionsMenu);
}

function openMainMenu() {
    hideElement(optionsMenu);
    hideElement(loseMenu);
    hideElement(gameInfo);
    hideElement(gameArea, "self");
    hideElement(table);
    showElement(startMenu);
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
    cell.style.backgroundColor = "";
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
    if (gameTickID !== undefined) {
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
    const oldPosition = applePosition.slice(0);
    const newPosition = findNewBlankTile(oldPosition);

    const row = newPosition[0];
    const column = newPosition[1];
    const cellIndex = (row * numColumns) + column;
    const tile = document.getElementsByTagName("td")[cellIndex];
    
    applePosition = [row, column];
    tile.className = "apple";
}

function eatApple() {
    increaseScore(1);

    createApple();

    increaseSnakeLength(1);

    if (difficultyAcceleration) {
        accelerateDifficulty();
    }
}

function findNewBlankTile(oldPosition) {
    let badPosition = true;
    let row;
    let column;

    while (badPosition) {
        row = Math.floor(Math.random() * numRows);
        column = Math.floor(Math.random() * numColumns);
        
        let cellIndex = (row * numColumns) + column;
        let tile = document.getElementsByTagName("td")[cellIndex];

        if (tile.className === "odd-tiles" || tile.className === "even-tiles") {
            if (row != oldPosition[0] && column != oldPosition[1]) {
                badPosition = false;
            }
        }
    }

    return [row,column];
}

function updateDifficulty() {
    difficulty = difficultyInput.value;

    let speeds = {
        1: 370,
        2: 310,
        3: 260,
        4: 210,
        5: 170,
        6: 130,
        7: 100,
        8: 70,
        9: 50
    }

    tickSpeed = speeds[difficulty];
}

function accelerateDifficulty() {
    tickSpeed = Math.floor(tickSpeed * .98);

    clearInterval(gameTickID);
    gameTickID = setInterval(gameTick, tickSpeed);
}

function updateDifficultyAccel(event) {
    let onOff = event.target.value;

    if (onOff === "on") {
        difficultyAcceleration = true;
    }
    else if (onOff === "off") {
        difficultyAcceleration = false;
    }
}

function updateSnakeColors() {
    while (snake.body.length > snakeColors.length) {
        createNewSnakeColor();
    }

    let counter = 0;
    for (let i = snake.body.length-1; i >= 0; i--) {
        const red = snakeColors[counter][0];
        const green = snakeColors[counter][1];
        const blue = snakeColors[counter][2];

        const row = snake.body[i][0];
        const column = snake.body[i][1];
        const cellIndex = (row * numColumns) + column;

        const tile = document.getElementsByTagName("td")[cellIndex];
        tile.style.backgroundColor = `rgb(${red},${green},${blue})`;
        counter++;
    }
}

function createNewSnakeColor() {
    let lastColor = snakeColors[snakeColors.length-1];
    let red = lastColor[0];
    let green = lastColor[1];
    let blue = lastColor[2];
    let colorStep = 85;
    const redLimit = 255 - (colorStep * 0);
    const greenLimit = 255 - (colorStep * 0);
    const blueLimit = 255;

    if (red >= redLimit) {
        if (blue > 0) {
            blue -= colorStep;
            if (blue < 0) {
                blue = 0;
            }
        }
        else if (green < greenLimit) {
            green += colorStep;
        }
        else if (green === greenLimit) {
            red -= colorStep;
            if (red < 0) {
                red = 0;
            }
        }
    }
    else if (green >= greenLimit) {
        if (red > 0) {
            red -= colorStep;
            if (red < 0) {
                red = 0;
            }
        }
        else if (blue < blueLimit) {
            blue += colorStep;
        }
        else if (blue === blueLimit) {
            green -= colorStep
            if (green < 0) {
                green = 0;
            }
        }
    }
    else if (blue >= blueLimit) {
        if (green > 0) {
            green -= colorStep;
            if (green < 0) {
                green = 0;
            }
        }
        else if (red < redLimit) {
            red += colorStep;
        }
        else if (red === redLimit) {
            blue -= colorStep;
            if (blue < 0) {
                blue = 0;
            }
        }
    }

    snakeColors.push([red, green, blue]);
    console.log([red,green,blue]);
}