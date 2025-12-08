let mouse = { x: 0, y: 0 };
const size = { width: 500, height: 530, tiles: 13, tileShrink: 2 };
const scenes = { MAIN_MENU: 0, GAME: 1, GAME_OVER: 2 };
const directions = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 };
const timePerMove = 150;
let currentDirection = directions.RIGHT;
let previousDirection = directions.RIGHT;
let currentScene = scenes.MAIN_MENU;
let lastMoveTime = 0;
let highScore = 0;
let score = 0;
let snake = [{ x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }];
let apple = { x: 10, y: 6 };
let started = false;


// setup
function setup() {
    createCanvas(10, 10);
    windowResized();
    frameRate(30);
    loadImages();
    imageMode(CENTER, CENTER);
    noStroke();
}


let zoom;
function windowResized() {   
    if (windowWidth < windowHeight) {
        zoom = windowWidth / size.width;
    } else {
        zoom = (windowHeight) / size.height;
        if (zoom * size.width > windowWidth) {
            zoom = windowWidth / size.width;
        }
    }

    zoom *= 0.98; // 2% margin
    resizeCanvas(size.width * zoom, size.height * zoom);
}

let images = { apple: './apple.png', trophy: './trophy.png'};
function loadImages() {
    Object.entries(images).forEach(([imageName, imagePath]) => {
        images[imageName] = loadImage(imagePath);
    });
}

function draw() {
    scale(zoom);
    mouse = { x: 1 / zoom * mouseX, y: 1 / zoom * mouseY };

    // draw background
    const tileSize = size.width / size.tiles - size.tileShrink;
    const offset = size.tileShrink * size.tiles / 2;
    background(88, 137, 57);
    for (let x = 0; x < size.tiles; x += 1) {
        for (let y = 0; y < size.tiles; y += 1) {
            fill(...((x + y) % 2 == 0 ? [171, 214, 90] : [162, 209, 82]));
            square(x * tileSize + offset, y * tileSize + offset + 30, tileSize+1);
        }
    }


    // draw apple
    if (apple && images.apple) {
        image(images.apple, apple.x * tileSize + offset + tileSize / 2, apple.y * tileSize + offset + 31 + tileSize / 2, tileSize, tileSize);
    }


    // draw snake
    for ([index, segment] of snake.entries()) {
        const tileSize = size.width / size.tiles - size.tileShrink;
        const offset = size.tileShrink * size.tiles / 2;
        fill(lerpColor(color(79, 117, 239), color(26, 64, 158), (snake.length - 1 - index) / 50));
        square(segment.x * tileSize + offset+1, segment.y * tileSize + offset + 31, tileSize);
    }

    // draw score
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(20);
    image(images.apple, 50, 20, 30, 30);
    text(score, 70, 20);

    image(images.trophy, 150, 20, 30, 30);
    text(highScore, 170, 20);


    if (currentScene === scenes.MAIN_MENU) {
        drawMainMenu();
    } else if (currentScene === scenes.GAME) {
        drawGame();
    } else if (currentScene === scenes.GAME_OVER) {
        drawGameOver();
    }
}

let mouseJustReleased = false;
function mousePressed() { mouseJustReleased = false; }
function mouseReleased() {
    mouseJustReleased = true;
    setTimeout(() => { mouseJustReleased = false; }, (1000 / frameRate())*0.9);
}


function keyPressed() {
    if ((key === 'ArrowUp' || key === 'w') && previousDirection !== directions.DOWN) {
        currentDirection = directions.UP;
    } else if ((key === 'ArrowDown' || key === 's') && previousDirection !== directions.UP) {
        currentDirection = directions.DOWN;
    } else if ((key === 'ArrowLeft' || key === 'a') && previousDirection !== directions.RIGHT) {
        currentDirection = directions.LEFT;
    } else if ((key === 'ArrowRight' || key === 'd') && previousDirection !== directions.LEFT) {
        currentDirection = directions.RIGHT;
    }
    started = true;
}


// actual game code

function drawMainMenu() {
    fill(0, 0, 0, 125);
    rect(0, 0, size.width, size.height);

    fill(84, 194, 247);
    rect(125, 100, size.width - 250, size.height - 200, 7.5);


    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Snake", size.width / 2, size.height / 2 - 100);

    textSize(20);
    image(images.apple, size.width / 2 - 60, size.height / 2 - 25, 50, 50);
    text(score, size.width / 2 - 60, size.height / 2 + 25);

    image(images.trophy, size.width / 2 + 60, size.height / 2 - 25, 50, 50);
    text(highScore, size.width / 2 + 60, size.height / 2 + 25);
    
    // play button
    const buttonHovered = mouse.x >= size.width / 2 - 100 &&
        mouse.x <= size.width / 2 + 100 &&
        mouse.y >= size.height/2 + 75 &&
        mouse.y <= size.height/2 + 125;
        
    if (buttonHovered) { fill(17, 85, 204); cursor('pointer') } else { fill(34, 102, 204); cursor('default') }
    rect(size.width / 2 - 100, size.height/2 + 75, 200, 50, 7.5);
    fill(255);
    textSize(20);
    text("Play", size.width / 2, size.height/2 + 100);

    if (mouseJustReleased && buttonHovered) {
        currentScene = scenes.GAME;
        score = 0;
        started = false;
        cursor('default');
        snake = [{ x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }];
        currentDirection = directions.RIGHT;
        previousDirection = directions.RIGHT;
        apple = { x: 10, y: 6 };
    }
}


function drawGame() {
    if (started && millis() - lastMoveTime > timePerMove) { // move snake
        const head = snake[snake.length - 1];
        lastMoveTime = millis();
        if (currentDirection === directions.UP) {
            snake.push({ x: head.x, y: head.y - 1 });
        } else if (currentDirection === directions.DOWN) {
            snake.push({ x: head.x, y: head.y + 1 });
        } else if (currentDirection === directions.LEFT) {
            snake.push({ x: head.x - 1, y: head.y });
        } else if (currentDirection === directions.RIGHT) {
            snake.push({ x: head.x + 1, y: head.y });
        }

        // check collisions
        newHead = snake[snake.length - 1];
        if (newHead.x < 0 || newHead.x >= size.tiles || newHead.y < 0 || newHead.y >= size.tiles ||
            snake.slice(0, snake.length - 1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            currentScene = scenes.GAME_OVER;
            snake.pop();
            return;
        }

        if (head.x === apple.x && head.y === apple.y) { // ate apple
            score += 1;
            if (score > highScore) {
                highScore = score;
            }
            while (snake.some(segment => segment.x === apple.x && segment.y === apple.y)) {
                apple = { x: floor(random(size.tiles)), y: floor(random(size.tiles)) };
            }
        } else {
            snake.shift();
        }

        previousDirection = currentDirection;
    }
}

function drawGameOver() {
    const lerpValue = max(millis() - lastMoveTime - 300, 0)/1000 * 0.9;
    fill(lerpColor(color(200, 0, 0, 150), color(0, 0, 0, 125), lerpValue));
    rect(0, 0, size.width, size.height);

    if (lerpValue >= 0.9) currentScene = scenes.MAIN_MENU;
}
