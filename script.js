//  PASSO 1: IDENTIFIQUE SUAS IMAGENS AQUI
const YOU_IMAGE_PATH = 'imagens/coração1.png';
const ME_IMAGE_PATH = 'imagens/coração2.png';

// ADICIONE OS CAMINHOS DAS IMAGENS DE RESULTADO AQUI
const WIN_IMAGE_PATH = 'imagens/flor.jpg'; // <-- TROQUE PELO SEU ARQUIVO
const LOSE_IMAGE_PATH = 'imagens/saranghaeyo.jpg'; // <-- TROQUE PELO SEU ARQUIVO
const TIE_IMAGE_PATH = 'imagens/us.jpg';  // <-- TROQUE PELO SEU ARQUIVO

//  PASSO 2: DEFINA OS NOMES DOS JOGADORES
const PLAYER_YOU_NAME = "You";
const PLAYER_ME_NAME = "Me";

// Seleção dos elementos do HTML
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

const board = document.getElementById('board');
const cellElements = document.querySelectorAll('[data-cell]');
const playerYouCard = document.getElementById('player-you');
const playerMeCard = document.getElementById('player-me');

const winMessageElement = document.getElementById('win-message');
const subMessageElement = document.getElementById('sub-message');
const endScreenImage = document.getElementById('end-screen-image');

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let isYouTurn;
let gameActive;

// Carrega as imagens nos avatares
document.querySelector('#player-you img').src = YOU_IMAGE_PATH;
document.querySelector('#player-me img').src = ME_IMAGE_PATH;
document.querySelector('#player-you p').innerText = PLAYER_YOU_NAME;
document.querySelector('#player-me p').innerText = PLAYER_ME_NAME;


// Event Listeners para os botões
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

function startGame() {
    isYouTurn = true;
    gameActive = true;

    // Reseta o tabuleiro
    cellElements.forEach(cell => {
        cell.innerHTML = ''; 
        cell.classList.remove('you', 'me');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });

    // Troca as telas
    startScreen.classList.add('hide');
    endScreen.classList.add('hide');
    gameScreen.classList.remove('hide');

    updatePlayerHighlight();
}

function handleClick(e) {
    if (!gameActive) return;

    const cell = e.target;
    const currentClass = isYouTurn ? 'you' : 'me';

    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
        const winner = isYouTurn ? PLAYER_YOU_NAME : PLAYER_ME_NAME;
        endGame(false, winner);
    } else if (isDraw()) {
        endGame(true, null);
    } else {
        swapTurns();
        updatePlayerHighlight();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    const img = document.createElement('img');
    img.src = (currentClass === 'you') ? YOU_IMAGE_PATH : ME_IMAGE_PATH;
    cell.appendChild(img);
}

function swapTurns() {
    isYouTurn = !isYouTurn;
}

function updatePlayerHighlight() {
    playerYouCard.classList.toggle('active-player', isYouTurn);
    playerMeCard.classList.toggle('active-player', !isYouTurn);
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains('you') || cell.classList.contains('me');
    });
}

// ----- FUNÇÃO ENDGAME -----
function endGame(draw, winnerName) {
    gameActive = false;

    if (draw) {
        
        // Cenário 1: Empate
        winMessageElement.innerText = "It's a tie!";
        subMessageElement.innerText = "We are a perfect match!";
        endScreenImage.src = TIE_IMAGE_PATH; // Define a imagem de empate

    } else if (winnerName === PLAYER_YOU_NAME) {
        // Cenário 2: "You" venceu
        winMessageElement.innerText = "You Won!";
        subMessageElement.innerText = "Your prize: Sunset walk just the two of us";
        endScreenImage.src = WIN_IMAGE_PATH; // Define a imagem de vitória

    } else {
        // Cenário 3: "You" perdeu
        winMessageElement.innerText = "It's okay, you're still the love of my life.";
        subMessageElement.innerText = "";
        endScreenImage.src = LOSE_IMAGE_PATH; // Define a imagem de derrota
    }

    // Garante que a imagem não mostre um ícone quebrado se não houver src
    endScreenImage.style.display = endScreenImage.src ? 'block' : 'none';

    // Mostra a tela de fim de jogo com a mensagem e imagem corretas
    endScreen.classList.remove('hide');
}
