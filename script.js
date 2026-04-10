const GAME_OPTIONS = Object.freeze({
    ROCK: 'ROCK',
    PAPER: 'PAPER',
    SCISSORS: 'SCISSORS'
});

let gameState = {
    p1Score: 0,
    p2Score: 0,
    p1Choice: null,
    p2Choice: null
};

const elements = {
    modeSelect: document.querySelector('#game-mode'),
    p1Input: document.querySelector('#name-p1'),
    p2Input: document.querySelector('#name-p2'),
    p1Label: document.querySelector('#label-p1'),
    p2Label: document.querySelector('#label-p2'),
    p1Score: document.querySelector('#human-score'),
    p2Score: document.querySelector('#machine-score'),
    resultText: document.querySelector('.result-text'),
    statusMsg: document.querySelector('.status-msg'),
    buttons: document.querySelectorAll('.choice'),
    resetBtn: document.querySelector('#reset-btn')
};

const getAlexaChoice = () => {
    const options = Object.values(GAME_OPTIONS);
    return options[Math.floor(Math.random() * options.length)];
};

const checkWinner = (p1, p2) => {
    if (p1 === p2) return 'TIE';
    if (
        (p1 === GAME_OPTIONS.ROCK && p2 === GAME_OPTIONS.SCISSORS) ||
        (p1 === GAME_OPTIONS.PAPER && p2 === GAME_OPTIONS.ROCK) ||
        (p1 === GAME_OPTIONS.SCISSORS && p2 === GAME_OPTIONS.PAPER)
    ) {
        return 'P1';
    }
    return 'P2';
};

const resetScores = () => {
    gameState.p1Score = 0;
    gameState.p2Score = 0;
    gameState.p1Choice = null;
    gameState.p2Choice = null;
    elements.p1Score.innerText = '0';
    elements.p2Score.innerText = '0';
    elements.resultText.innerText = '';
    elements.statusMsg.innerText = 'Aguardando jogada...';
    elements.statusMsg.style.color = 'white';
};

const updateNames = () => {
    elements.p1Label.innerText = elements.p1Input.value || 'Jogador 1';
    elements.p2Label.innerText = elements.p2Input.value || 'Jogador 2';
};

const handlePlay = (choice) => {
    updateNames();
    
    if (elements.modeSelect.value === 'alexa') {
        gameState.p1Choice = choice;
        gameState.p2Choice = getAlexaChoice();
        resolveRound();
    } else {
        if (!gameState.p1Choice) {
            gameState.p1Choice = choice;
            elements.statusMsg.innerText = `Vez de ${elements.p2Input.value || 'Jogador 2'}...`;
            elements.statusMsg.style.color = "#ffff00";
        } else {
            gameState.p2Choice = choice;
            resolveRound();
        }
    }
};

const resolveRound = () => {
    const result = checkWinner(gameState.p1Choice, gameState.p2Choice);
    const p1Name = elements.p1Input.value || 'Jogador 1';
    const p2Name = elements.p2Input.value || 'Jogador 2';
    
    if (result === 'TIE') {
        elements.resultText.innerText = "Empate! 🤝";
        elements.resultText.style.color = "white";
    } else if (result === 'P1') {
        gameState.p1Score++;
        elements.p1Score.innerText = gameState.p1Score;
        elements.resultText.innerText = `${p1Name} Ganhou! 🎉`;
        elements.resultText.style.color = "#00ff00";
    } else {
        gameState.p2Score++;
        elements.p2Score.innerText = gameState.p2Score;
        elements.resultText.innerText = `${p2Name} Ganhou! 🏆`;
        elements.resultText.style.color = "#ff4444";
    }

    gameState.p1Choice = null;
    gameState.p2Choice = null;
    elements.statusMsg.innerText = "Aguardando jogada...";
    elements.statusMsg.style.color = "white";
};

elements.buttons.forEach(btn => {
    btn.addEventListener('click', () => handlePlay(btn.dataset.type));
});

elements.modeSelect.addEventListener('change', () => {
    resetScores();
    if (elements.modeSelect.value === 'alexa') {
        elements.p2Input.value = "Alexa";
        elements.p2Input.disabled = true;
    } else {
        elements.p2Input.value = "";
        elements.p2Input.disabled = false;
        elements.p2Input.placeholder = "Jogador 2";
    }
    updateNames();
});

elements.resetBtn.addEventListener('click', resetScores);
elements.p1Input.addEventListener('input', updateNames);
elements.p2Input.addEventListener('input', updateNames);

updateNames();