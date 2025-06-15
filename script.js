
        // Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

        // Scroll-reveal animation
const revealElements = document.querySelectorAll('.reveal');
const skillItems = document.querySelectorAll('.skill-item');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
                    // Activate skill bars when skill section is active
            if (entry.target.id === 'skills') {
                skillItems.forEach(item => item.classList.add('active'));
            }
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
}, observerOptions);

revealElements.forEach(el => {
    observer.observe(el);
});

        // Small adjustment for the typing effect to reset animation if needed on reload/rerun
window.addEventListener('DOMContentLoaded', () => {
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
                // To restart animation on potential re-render in canvas
        typingText.style.animation = 'none';
                typingText.offsetHeight; // Trigger reflow
                typingText.style.animation = 'typing 3s steps(40, end) forwards, blink-caret .75s step-end infinite';
            }
        });

        // Snake Game JavaScript Logic
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
        const gridSize = 20; // Size of each snake segment and food
        let snake = [{ x: 10, y: 10 }]; // Initial snake position
        let food = {};
        let dx = 0; // Horizontal velocity
        let dy = 0; // Vertical velocity
        let score = 0;
        let gameInterval;
        let gameRunning = false;
        let changingDirection = false; // Flag to prevent multiple direction changes per frame

        const startButton = document.getElementById('startButton');
        const pauseButton = document.getElementById('pauseButton');
        const resetButton = document.getElementById('resetButton');
        const gameStatus = document.getElementById('game-status');

        // Function to draw a single snake part or food
        function drawRect(x, y, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
            ctx.strokeStyle = '#1a202c'; // Dark border for segments
            ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
        }

        // Function to draw the entire snake
        function drawSnake() {
            snake.forEach(part => drawRect(part.x, part.y, '#2563eb')); // blue-700
        }

        // Function to generate random food coordinates
        function generateFood() {
            food = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)),
                y: Math.floor(Math.random() * (canvas.height / gridSize))
            };
            // Ensure food does not spawn on the snake
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === food.x && snake[i].y === food.y) {
                    generateFood(); // Recalculate if it spawns on snake
                    return;
                }
            }
        }

        // Function to draw the food
        function drawFood() {
            drawRect(food.x, food.y, '#ef4444'); // red-500
        }

        // Function to move the snake
        function moveSnake() {
            // Create a new head based on current direction
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            // Add the new head to the beginning of the snake array
            snake.unshift(head);

            // Check if snake ate food
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                gameStatus.textContent = `Score: ${score}`;
                generateFood(); // Generate new food
            } else {
                snake.pop(); // Remove the tail if no food was eaten
            }
        }

        // Check for collisions
        function checkCollision() {
            const head = snake[0];
            // Check collision with walls
            const hitLeftWall = head.x < 0;
            const hitRightWall = head.x >= canvas.width / gridSize;
            const hitTopWall = head.y < 0;
            const hitBottomWall = head.y >= canvas.height / gridSize;

            if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
                return true;
            }

            // Check collision with self
            for (let i = 4; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    return true;
                }
            }
            return false;
        }

        // Main game loop
        function gameLoop() {
            if (!gameRunning) return; // Only run if game is active
            changingDirection = false; // Reset flag for next frame

            if (checkCollision()) {
                endGame();
                return;
            }

            setTimeout(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
                drawFood();
                moveSnake();
                drawSnake();
                gameInterval = requestAnimationFrame(gameLoop); // Continue loop
            }, 100); // Game speed (lower is faster)
        }

        // Handle keyboard input for snake direction
        function changeDirection(event) {
            if (changingDirection) return;
            changingDirection = true;

            const keyPressed = event.keyCode;
            const LEFT_KEY = 37;
            const RIGHT_KEY = 39;
            const UP_KEY = 38;
            const DOWN_KEY = 40;

            const goingUp = dy === -1;
            const goingDown = dy === 1;
            const goingLeft = dx === -1;
            const goingRight = dx === 1;

            if (keyPressed === LEFT_KEY && !goingRight) {
                dx = -1;
                dy = 0;
            }
            if (keyPressed === UP_KEY && !goingDown) {
                dx = 0;
                dy = -1;
            }
            if (keyPressed === RIGHT_KEY && !goingLeft) {
                dx = 1;
                dy = 0;
            }
            if (keyPressed === DOWN_KEY && !goingUp) {
                dx = 0;
                dy = 1;
            }
        }

        // Start the game
        function startGame() {
            if (gameRunning) return; // Prevent starting multiple times
            resetGame(); // Reset game state before starting
            gameRunning = true;
            startButton.classList.add('hidden');
            pauseButton.classList.remove('hidden');
            resetButton.classList.add('hidden'); // Hide reset button
            document.addEventListener('keydown', changeDirection); // Listen for key presses
            gameLoop();
        }

        // Pause the game
        function pauseGame() {
            gameRunning = false;
            cancelAnimationFrame(gameInterval); // Stop animation frame loop
            startButton.classList.remove('hidden');
            startButton.textContent = "Reprendre"; // Change text to resume
            pauseButton.classList.add('hidden');
            resetButton.classList.remove('hidden'); // Show reset button when paused
        }

        // End the game
        function endGame() {
            gameRunning = false;
            cancelAnimationFrame(gameInterval);
            gameStatus.textContent = `Game Over! Score final: ${score}`;
            gameStatus.style.color = "#dc2626"; // red-600
            startButton.classList.add('hidden');
            pauseButton.classList.add('hidden');
            resetButton.classList.remove('hidden'); // Show reset button
            document.removeEventListener('keydown', changeDirection); // Remove event listener
        }

        // Reset the game
        function resetGame() {
            gameRunning = false;
            cancelAnimationFrame(gameInterval);
            snake = [{ x: 10, y: 10 }];
            dx = 0;
            dy = 0;
            score = 0;
            gameStatus.textContent = `Score: ${score}`;
            gameStatus.style.color = "#4a5568"; // Reset color
            generateFood();
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
            drawSnake();
            drawFood();
            startButton.classList.remove('hidden');
            startButton.textContent = "Démarrer"; // Reset button text
            pauseButton.classList.add('hidden');
            resetButton.classList.add('hidden');
        }

        // Event Listeners for game controls
        startButton.addEventListener('click', startGame);
        pauseButton.addEventListener('click', pauseGame);
        resetButton.addEventListener('click', resetGame);

        // Initial setup when window loads
        window.onload = function() {
            // Existing portfolio init logic
            const typingText = document.querySelector('.typing-text');
            if (typingText) {
                typingText.style.animation = 'none';
                typingText.offsetHeight;
                typingText.style.animation = 'typing 3s steps(40, end) forwards, blink-caret .75s step-end infinite';
            }

            // Initialize the Snake game
            generateFood();
            drawSnake();
            drawFood();
        };
        