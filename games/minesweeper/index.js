let mouse = { x: 0, y: 0 };
const size = { width: 500, height: 530, tileShrink: 2 };
const scenes = { MAIN_MENU: 0, HARDNESS_SELECTION: 1, GAME: 2, GAME_OVER: 3 };
const hardnesses = { EASY: { mineCount: 15, tiles: 13 }, MEDIUM: { mineCount: 25, tiles: 16 }, HARD: { mineCount: 35, tiles: 20 } };
let highScore = { EASY: null, MEDIUM: null, HARD: null };
let currentHardness = hardnesses.EASY;
let currentScene = scenes.MAIN_MENU;
let lastMoveTime = 0;
let mines = [];
let score = 0;
let started = 0;


// setup
function setup() {
    createCanvas(10, 10);
    windowResized();
    frameRate(30);
    loadImages();
    imageMode(CENTER);
    noStroke();
}

function hardnessData () {
    const hardnessToStr = currentHardness == hardnesses.EASY ? "EASY" : currentHardness == hardnesses.MEDIUM ? "MEDIUM" : "HARD";
    return {...hardnesses[hardnessToStr], highScore: highScore[hardnessToStr]};
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

let images = { flag: './flag.png', clock: './clock.png', trophy: './trophy.png' };
function loadImages() {
    Object.entries(images).forEach(([imageName, imagePath]) => {
        images[imageName] = loadImage(imagePath);
    });
}

function draw() {
    scale(zoom);
    mouse = { x: 1 / zoom * mouseX, y: 1 / zoom * mouseY };

    // draw background
    const tiles = hardnessData().tiles;
    const tileSize = size.width / tiles - size.tileShrink;
    const offset = size.tileShrink * tiles / 2;
    background(88, 137, 57);
    for (let x = 0; x < tiles; x += 1) {
        for (let y = 0; y < tiles; y += 1) {
            fill(...((x + y) % 2 == 0 ? [171, 214, 90] : [162, 209, 82]));
            square(x * tileSize + offset, y * tileSize + offset + 30, tileSize+1);
        }
    }


    if (currentScene === scenes.MAIN_MENU) {
        drawMainMenu();
    } else if (currentScene === scenes.HARDNESS_SELECTION) {
        drawHardnessSelection();
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


// actual game code

function drawMainMenu() {
    fill(0, 0, 0, 125);
    rect(0, 0, size.width, size.height);

    fill(84, 194, 247);
    rect(125, 100, size.width - 250, size.height - 200, 7.5);


    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Minesweeper", size.width / 2, size.height / 2 - 100);

    textSize(20);
    image(images.clock, size.width / 2 - 60, size.height / 2 - 25, 50, 50);
    text(highScore[hardnessToStr[currentHardness]] || "--", size.width / 2 - 60, size.height / 2 + 25);

    image(images.trophy, size.width / 2 + 60, size.height / 2 - 25, 50, 50);
    text(highScore[hardnessToStr[currentHardness]] || "--", size.width / 2 + 60, size.height / 2 + 25);
    
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
        currentScene = scenes.HARDNESS_SELECTION;
    }
}

function drawHardnessSelection() {
    fill(0, 0, 0, 125);
    rect(0, 0, size.width, size.height);

    fill(84, 194, 247);
    rect(125, 100, size.width - 250, size.height - 200, 7.5);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(28);
    text("Select Hardness", size.width / 2, size.height / 2 - 125);

    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonSpacing = 25;
    const startY = size.height / 2 - (3 * buttonHeight + 2 * buttonSpacing) / 2 + 25;

    push();
    colorMode(HSL);
    const hardness = {"Easy": 206, "Medium": 42, "Hard": 5};
    let i = 0;
    Object.entries(hardness).forEach(([hardnessName, hardnessColor]) => {
        const x = size.width / 2 - buttonWidth / 2;
        const y = startY + i * (buttonHeight + buttonSpacing);

        const buttonHovered = mouse.x >= x && mouse.x <= x + buttonWidth && mouse.y >= y && mouse.y <= y + buttonHeight;
        if (buttonHovered) { fill(hardnessColor, 100, 43); cursor('pointer') } else { cursor('default'); fill(hardnessColor, 100, 50); }

        rect(x, y, buttonWidth, buttonHeight, 7.5);
        fill(255);
        textSize(20);
        text(hardnessName, size.width / 2, y + buttonHeight / 2);

        if (mouseJustReleased && buttonHovered) {
            currentHardness = hardnesses[hardnessName.toUpperCase()];
            currentScene = scenes.GAME;
            score = 0;
            started = false;

            mines = [];
            while (mines.length < minesCount[currentHardness]) {
                const newMine = { x: Math.floor(Math.random() * size.tiles), y: Math.floor(Math.random() * size.tiles) };
                if (!mines.some(mine => mine.x === newMine.x && mine.y === newMine.y)) { mines.push(newMine) }
            }

            cursor('default');
        }
        i++;
    });
    pop();
}


function drawGame() {
    if (!started && mouseJustReleased) {
        lastMoveTime = millis();
        started = true;
    }
}

function drawGameOver() {}