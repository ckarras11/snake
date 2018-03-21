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
let ax;
let ay;
placeApple()

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
function animate() {
    setTimeout(() => {
        requestAnimationFrame(animate);
        if(paused) return;
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
    // Draw Snake
    snake.forEach(seg => {
        drawRect(seg.x, seg.y, blockSize, 'lime')
    })
    // Draw Apple
    drawRect(ax, ay, blockSize, 'red')

    handleCollisions();
    moveSnake();  
}
function drawCanvas() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width, canvas.height)
}
function drawRect(x, y, size, color) {
    c.fillStyle = color;
    c.fillRect(x,y,size,size);
}
function placeApple() {
    ax = Math.floor(Math.random() * (canvas.width - blockSize * 2) + blockSize);
    ay = Math.floor(Math.random() * (canvas.height - blockSize * 2) + blockSize);
}
function handleCollisions() {
    // Handle Apple Collision
    if (px >= ax && px <= ax + blockSize || px + blockSize >= ax && px + blockSize <= ax + blockSize) {
        if (py >= ay && py <= ay + blockSize || py + blockSize >= ay && py + blockSize <= ay + blockSize) {
            placeApple();
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
function restartGame() {
    score = 0;
    snake = [{ x: sx, y: sy }];
    direction = 'right';
    px = sx;
    py = sy;
    placeApple();
}
animate()