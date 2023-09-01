const ball = document.getElementById('ball');
const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');
const gameContainer = document.querySelector('.game-container');
const leftScoreDisplay = document.getElementById('leftScore');
const rightScoreDisplay = document.getElementById('rightScore');
const startButtons = document.querySelectorAll('.start-button');

let ballX = 400;
let ballY = 200;
let ballSpeedX = 4; // Vitesse initiale plus lente
let ballSpeedY = 4; // Vitesse initiale plus lente
let leftPaddleY = 150;
let leftPaddleSpeed = 5;
let rightPaddleY = 150;
let rightPaddleSpeed = 0;
let leftScore = 0;
let rightScore = 0;

let leftPaddleControlType = 'mouse'; // Type de contrôle de la raquette gauche (souris par défaut)
let rightPaddleControlType = 'auto'; // Type de contrôle de la raquette droite (automatique par défaut)

let gameMode = null;

function startGame(mode) {
    const gameStartContainer = document.querySelector('.game-start-container');
    gameStartContainer.style.display = 'none'; // Masquer l'encadré de démarrage
    resetBall();
    document.body.classList.add('game-started'); // Ajouter la classe "game-started" au body

    if (mode === 'solo') {
        // En mode solo, la raquette de droite a un contrôle automatique de type 2
        rightPaddleControlType = 'auto';
    } else if (mode === 'duo') {
        // En mode duo, la raquette de droite a un contrôle de type 3 (clavier AZERTY)
        rightPaddleControlType = 'keyboard';
    }

    if (mode === 'solo' || mode === 'duo') {
        gameContainer.addEventListener('mousemove', (e) => {
            if (leftPaddleControlType === 'mouse') {
                leftPaddleY = e.clientY - gameContainer.getBoundingClientRect().top - leftPaddle.clientHeight / 2;
                if (leftPaddleY < 0) {
                    leftPaddleY = 0;
                } else if (leftPaddleY > gameContainer.clientHeight - leftPaddle.clientHeight) {
                    leftPaddleY = gameContainer.clientHeight - leftPaddle.clientHeight;
                }
                leftPaddle.style.top = leftPaddleY + 'px';
            }
        });
    }

    // Réinitialisez la position de la balle
    resetBall();

    // Démarrez la logique du jeu en appelant updateGameArea
    requestAnimationFrame(updateGameArea);
}

// Boutons "Solo" et "Duo"
startButtons.forEach(button => {
    button.addEventListener('click', () => {
        gameMode = button.getAttribute('data-mode');
        leftPaddleControlType = 'mouse'; // En mode solo ou duo, la raquette de gauche a un contrôle de type 1 (souris)
        startGame(gameMode);
    });
});

function updateGameArea() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= 380) {
        ballSpeedY *= -1;
    }

    if (ballX <= 20 && ballY >= leftPaddleY && ballY <= leftPaddleY + 100) {
        ballSpeedX *= -1;
        ballSpeedX *= 1.05; // Réduire l'accélération
        ballSpeedY *= 1.05; // Réduire l'accélération
    }

    if (ballX >= 760 && ballY >= rightPaddleY && ballY <= rightPaddleY + 100) {
        ballSpeedX *= -1;
        ballSpeedX *= 1.05; // Réduire l'accélération
        ballSpeedY *= 1.05; // Réduire l'accélération
    }

    if (ballX <= 0 || ballX >= 780) {
        if (ballX <= 0) {
            rightScore++;
            rightScoreDisplay.innerText = rightScore;
        } else {
            leftScore++;
            leftScoreDisplay.innerText = leftScore;
        }

        if (leftScore === 7 || rightScore === 7) {
            alert(rightScore === 7 ? "Computer Wins!" : "Player Wins!");
            location.reload();
        }

        resetBall();
    }

    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    // Gestion du déplacement automatique de la raquette droite (type 2)
    if (rightPaddleControlType === 'auto') {
        // Suivre la balle
        if (ballY < rightPaddleY + rightPaddle.clientHeight / 2) {
            rightPaddleSpeed = -5;
        } else {
            rightPaddleSpeed = 5;
        }
    }

    // Gestion du déplacement de la raquette droite avec le clavier (type 3)
    if (rightPaddleControlType === 'keyboard') {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'z' || e.key === 'Z') {
                rightPaddleSpeed = -5;
            } else if (e.key === 's' || e.key === 'S') {
                rightPaddleSpeed = 5;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'z' || e.key === 'Z' || e.key === 's' || e.key === 'S') {
                rightPaddleSpeed = 0;
            }
        });
    }

    rightPaddleY += rightPaddleSpeed;

    if (rightPaddleSpeed > 5) {
        rightPaddleSpeed = 5;
    }

    if (rightPaddleY < 0) {
        rightPaddleY = 0;
    } else if (rightPaddleY > gameContainer.clientHeight - rightPaddle.clientHeight) {
        rightPaddleY = gameContainer.clientHeight - rightPaddle.clientHeight;
    }

    rightPaddle.style.top = rightPaddleY + 'px';

    requestAnimationFrame(updateGameArea);
}

function resetBall() {
    ballX = 400;
    ballY = 200;
    ballSpeedX = 4; // Vitesse réinitialisée à une valeur plus lente
    ballSpeedY = 4; // Vitesse réinitialisée à une valeur plus lente

    // Retirez la classe "game-started" lorsque le jeu est réinitialisé
    document.body.classList.remove('game-started');
}

updateGameArea();


