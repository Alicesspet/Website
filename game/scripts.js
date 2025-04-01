let gridSize = 4;
let images = [];
let pairs = [];
let flippedCards = [];
let matchedCards = [];
let timerInterval;
let secondsElapsed = 0;


const clickSound = new Audio('sounds/click-sound.mp3'); // Chargez le son

function playClickSound() {
    clickSound.play(); // Joue le son à chaque clic
}

function setGridSize(size) {
    stopTimer();
    startTimer();
    gridSize = size;
    document.getElementById('gameGrid').style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    document.getElementById('gameGrid').style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    startGame(); // Restart the game when the grid size is changed
}

function startGame() {
    document.getElementById('startPopup').style.display = 'none';
    document.getElementById('gameGrid').style.display = 'grid';
    startTimer();
    setupBoard();
}

function setupBoard() {
    const totalPairs = (gridSize * gridSize) / 2;
    images = Array.from({length: totalPairs}, (_, i) => `img/img${i+1}.png`);
    pairs = [...images, ...images];
    shuffledCards = shuffle(pairs);
    const grid = document.getElementById('gameGrid');
    grid.innerHTML = ''; // Clear previous grid

    shuffledCards.forEach((image) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;
        const img = document.createElement('img');
        img.src = image;
        card.appendChild(img);
        card.onclick = () => {
            flipCard(card);
            playClickSound(); // Joue le son à chaque clic
        }
        grid.appendChild(card);
    });

    flippedCards = [];
    matchedCards = [];
}

function flipCard(card) {
    if (flippedCards.length < 2 && !flippedCards.includes(card) && !matchedCards.includes(card)) {
        card.classList.add('flipped');
        flippedCards.push(card);
    }
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
        matchedCards.push(card1, card2);
        if (matchedCards.length === (pairs.length)) {
            stopTimer(); 
            document.getElementById('victoryTime').textContent = 
                `Your Time : ${document.getElementById("timer").textContent}`;
            document.getElementById('victoryPopup').style.display = 'block';
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    flippedCards = [];
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function restartGame() {
    document.getElementById('victoryPopup').style.display = 'none';
    document.getElementById('gameGrid').style.display = 'none';
    startGame();
}

function startTimer() {
    clearInterval(timerInterval); // Réinitialise l'ancien timer s'il y en avait un
    secondsElapsed = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    document.getElementById("timer").textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}
