let canvas = document.getElementById('game')
let c = canvas.getContext('2d');

// Setup
canvas.width = 400;
canvas.height = 300;
const fps = 20;
let state = 'title';
let score = 0;

// Starting Point
const sx = canvas.width / 2;
const sy = canvas.height / 2;
const blockSize = 10;
let snake = [{ x: sx, y: sy }];
let px;
let py;
let direction = 'right';
let paused = false

// Apple Placement
let ax = Math.floor(Math.random() * (canvas.width - blockSize * 2) + blockSize);
let ay = Math.floor(Math.random() * (canvas.height - blockSize * 2) + blockSize);


window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowLeft':
            if(direction !== 'right') direction = 'left'
            break;
        case 'ArrowRight':
            if(direction !== 'left') direction = 'right'
            break;
        case 'ArrowUp':
            if(direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if(direction !== 'up') direction = 'down';
            break;
        case 'KeyS':
            if(state === 'title') state = 'playing';
            break;
        case 'KeyR':
            if(state === 'dead') {
                restartGame();
                state = 'playing';
            } 
            break;
        case 'KeyP':
            paused = !paused
    }
})

function restartGame() {
    score = 0;
    snake = [{ x: sx, y: sy }];
    direction = 'right';
    px = sx;
    py = sy;
    ax = Math.floor(Math.random() * (canvas.width - blockSize * 2) + blockSize);
    ay = Math.floor(Math.random() * (canvas.height - blockSize * 2) + blockSize);
}

function animate() {
    setTimeout(() => {
        requestAnimationFrame(animate);
        if(paused) {
            return;
        }
        switch (state) {
            case 'title':
                titleScreen();
                break;
            case 'playing':
                draw();
                break;
            case 'dead':
                gameOverScreen();
                break;
        }
    }, 1000 / fps)
}
function draw() {
    drawCanvas();
    c.beginPath();
    c.fillStyle = 'lime';
    // Draw Snake
    snake.forEach(seg => {
        c.fillRect(seg.x, seg.y, blockSize, blockSize);
    })
    // Draw Apple
    c.fillStyle = 'red';
    c.fillRect(ax, ay, blockSize, blockSize);

    handleCollisions();
    moveSnake();  
}
function drawCanvas() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width, canvas.height)
}
function handleCollisions() {
    // Handle Apple Collision
    if (px >= ax && px <= ax + blockSize || px + blockSize >= ax && px + blockSize <= ax + blockSize) {
        if (py >= ay && py <= ay + blockSize || py + blockSize >= ay && py + blockSize <= ay + blockSize) {
            ax = Math.floor(Math.random() * (canvas.width - blockSize * 2) + blockSize);
            ay = Math.floor(Math.random() * (canvas.height - blockSize * 2) + blockSize);
            score ++;
            snake.push(addSeg())
        }
    }
    // Handle Snake collisions
    for (let i = 1; i < snake.length; i++) {
        if (px === snake[i].x && py === snake[i].y) {
            state = 'dead';
        }
    };
    // Handle Wall collisions
    if (px + blockSize > canvas.width || px < 0 || py < 0 || py + blockSize > canvas.height) {
        state = 'dead';
    }
}
function moveSnake() {
    let n = addSeg()
    snake.pop();
    px = n.x;
    py = n.y;
    snake.unshift(n)
}
function addSeg() {
    let h = snake[0]
    let seg = {};
    switch (direction) {
        case 'left':
            seg.x = h.x - blockSize;
            seg.y = h.y;
            break;
        case 'right':
            seg.x = h.x + blockSize;
            seg.y = h.y;
            break;
        case 'up':
            seg.x = h.x;
            seg.y = h.y - blockSize;
            break;
        case 'down':
            seg.x = h.x;
            seg.y = h.y + blockSize;
            break;
    }
    return seg;
}
function titleScreen() {
    drawCanvas();
    c.fillStyle = 'lime';
    c.textAlign = 'center';
    c.font = '40px Arial';
    c.fillText('Snake', sx, sy);
    c.font = '30px Arial';
    c.fillText('Press "S" to Start', sx, sy + 40)
}
function gameOverScreen() {
    drawCanvas();
    c.fillStyle = 'red'
    c.textAlign = 'center';
    c.font=`40px Arial`;
    c.fillText('Game Over!', sx, sy)
    c.font=`30px Arial`;
    c.fillText(`You scored ${score} points`, sx, sy + 40)
    c.fillText('Press "R" to restart', sx, canvas.height - 10)

}
animate()