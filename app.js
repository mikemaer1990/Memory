const menu = document.querySelector(".menu");
const gameOverMenu = document.querySelector(".game-over-menu");
const gameBoard = document.querySelector(".game-container");
const cards = gameBoard.querySelectorAll(".card");
const displayGuesses = document.getElementById("guesses");
const displayScore = document.getElementById("score");
const displayTime = document.getElementById("time");
const gameOverTime = document.getElementById("gameOverTime");
const gameOverScore = document.getElementById("gameOverScore");
const playButton = document.getElementById("play");
const playAgainButton = document.getElementById("play-again");

playButton.addEventListener("click", () => {
    gameSetup();
    gamePlay();
});
playAgainButton.addEventListener("click", () => {
    gameOverMenu.style.display = "none";
    gameSetup();
    gamePlay();
});

const gameSetup = () => {
    cards.forEach((card) => {
        if (card.classList.contains("clicked")) {
            card.classList.remove("clicked");
            card.style.opacity = 1;
        }
    });
    resetScoreBoard();
    menu.style.display = "none";
    gameBoard.style.display = "block";
    let classArray = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
    ];

    function shuffleArray(arr) {
        arr.sort(() => Math.random() - 0.5);
    }
    shuffleArray(classArray);
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.add(classArray[i]);
    }
};
const resetScoreBoard = () => {
    displayScore.innerHTML = 0;
    displayGuesses.innerHTML = 0;
};

const trackTime = () => {
    let start = Date.now();

    setInterval(function () {
        let delta = Math.floor((Date.now() - start) / 1000);

        if (delta < 10) {
            displayTime.innerHTML = `0:0${delta}`;
        } else if (delta < 60) {
            displayTime.innerHTML = `0:${delta}`;
        } else if (delta >= 60) {
            minutes = Math.floor(delta / 60);
            seconds = Math.floor(delta - 60 * minutes);
            if (seconds === 0) {
                displayTime.innerHTML = `${minutes}:00`;
            } else if (seconds < 10) {
                displayTime.innerHTML = `${minutes}:0${seconds}`;
            } else if (seconds > 10) {
                displayTime.innerHTML = `${minutes}:${seconds}`;
            }
        }
    }, 100);
};

const gamePlay = () => {
    let winningScore = 6;
    let clickCounter = 0;
    let clickTrackerList = [];
    let scoreCounter = 0;
    let scoreClickCounter = 0;
    trackTime();
    // Listen for clicks
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (card.classList.contains("clicked")) {
                console.log("k");
                // do nothing
            } else {
                clickCounter++;
                if (clickCounter < 2) {
                    clickTracker(card);
                } else if (clickCounter === 2) {
                    clickTracker(card);
                    updateGuess();
                    setTimeout(checkCards, 1500, clickTrackerList, scoreClickCounter);
                }
            }
        });
    });

    const checkCards = (card, ...args) => {
        if (card[0].classList[1] === card[1].classList[1]) {
            // hide / remove cards
            for (let item of card) {
                item.style.opacity = 0;
            }
            // increase score variable
            updateScore();
            if (scoreCounter === winningScore) {
                gameBoard.style.display = "none";
                gameOver(scoreClickCounter);
            }
        } else {
            // flip cards back over
            for (let item of card) {
                item.classList.toggle("clicked");
            }
        }
        clickCounter = 0;
        clickTrackerList = [];
    };

    const updateGuess = () => {
        scoreClickCounter++;
        displayGuesses.innerHTML = scoreClickCounter;
    };

    const updateScore = () => {
        scoreCounter++;
        displayScore.innerHTML = scoreCounter;
    };

    const clickTracker = (card) => {
        clickTrackerList.push(card);
        card.classList.toggle("clicked");
    };

    const gameOver = (clicks) => {
        gameBoard.style.display = "none";
        gameOverMenu.style.display = "block";
        gameOverScore.innerHTML = scoreClickCounter;
        gameOverTime.innerHTML = displayTime.innerHTML;
    };
};