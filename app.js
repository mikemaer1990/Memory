/* This is my first attempt at making a game. Using this as a fun way to learn about manipulating the DOM.
Also a good way to learn some CSS tricks when it comes to animation! */

// DOM Variables
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
const correctGuess = new Audio("./sounds/success.wav");
// Lowering the volume to save headphone users!
correctGuess.volume = 0.1;

// Initialize score related variables OUTSIDE of main game function
let winningScore, clickCounter, clickTrackerList, scoreCounter, scoreClickCounter;

// Event listeners for play / play again button
playButton.addEventListener("click", () => {
    gameSetup();
    gamePlay();
});
playAgainButton.addEventListener("click", () => {
    gameSetup();
    gamePlay();
    gameOverMenu.style.display = "none";
});

// Array of class names to assign to each card element - which is paired to a matching image (back of card)
const gameSetup = () => {
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
    // Remove any added classes from the previous game
    cards.forEach((card) => {
        if (card.classList.contains("clicked")) {
            card.classList.remove("clicked");
            card.style.opacity = 1;
        }
        classArray.forEach(number => {
            if (card.classList.contains(number)) {
                card.classList.remove(number)
            }
        })
    });
    // Reset the scoreboard values
    resetScoreBoard();
    // Shuffle the classname array
    classArray.sort(() => Math.random() - 0.5);
    // Add each class to a card
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.add(classArray[i]);
    }
};

// Function to reset scoreboard
const resetScoreBoard = () => {
    displayScore.innerHTML = 0;
    displayGuesses.innerHTML = 0;
    displayTime.innerHTML = "0:00";
    menu.style.display = "none";
    gameBoard.style.display = "block";
};

// Main game function
const gamePlay = () => {
    // Get start time for timer
    let start = Date.now();
    // Update every 100ms
    const timer = setInterval(function () {
        // Delta = difference between start date and now - in seconds
        let delta = Math.floor((Date.now() - start) / 1000);
        let minutes = 0;
        let seconds = 0;
        // If greater than 10s - display time formatted as below
        if (delta < 10) {
            displayTime.innerHTML = `0:0${delta}`;
            // Same for over 10s but under 60s
        } else if (delta < 60) {
            displayTime.innerHTML = `0:${delta}`;
            // Otherwise - display minutes + seconds
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
    // Declare our variable values for the current game
    winningScore = 6;
    // Keeps track of clicks - only two allowed at a time
    clickCounter = 0;
    // Keeps track of the cards clicked on in the current pair
    clickTrackerList = [];
    // Tracks score
    scoreCounter = 0;
    // Tracks total guesses
    scoreClickCounter = 0;
    // Listen for clicks
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            // If less than two cards are clicked and the card is not clicked already in this pair
            if (!card.classList.contains("clicked") && clickCounter <= 1) {
                // Increment the counter
                clickCounter++;
                // If 0 OR 1 cards are currently clicked
                if (clickCounter < 2) {
                    // Update the array holding our clicked cards for comparison and flip the card
                    clickTracker(card);
                    // If two card are clicked
                } else if (clickCounter === 2 && clickTrackerList.length <= 2) {
                    // Update the array holding our clicked cards for comparison and flip the card
                    clickTracker(card);
                    // Update guess counter and display the value
                    updateGuess();
                    // Compare the two cards - wait 800ms for timing
                    setTimeout(checkCards, 800, clickTrackerList);
                    clickTrackerList = [];
                }
            }
        });
    });

    // Function to compare two cards
    const checkCards = (card) => {
        // If the cards match
        if (card[0].classList[1] === card[1].classList[1]) {
            // Play sound
            correctGuess.play();
            // hide / remove cards
            for (let item of card) {
                item.style.opacity = 0;
            }
            // increase score variable
            updateScore();
            // If the game is over
            if (scoreCounter === winningScore) {
                gameOver(scoreClickCounter);
                return;
            }
            // If the cards don't match
        } else if (card[0].classList[1] != card[1].classList[1]) {
            // flip cards back over
            for (let item of card) {
                item.classList.toggle("clicked");
            }
        }
        // Reset click counter regardless
        clickCounter = 0;
    };

    // Function to update scoreboard with guess count
    const updateGuess = () => {
        scoreClickCounter++;
        displayGuesses.innerHTML = scoreClickCounter;
    };

    // Function to update scoreboard with score count
    const updateScore = () => {
        scoreCounter++;
        displayScore.innerHTML = scoreCounter;
    };

    // Function to track clicked cards and update the cards with the 'clicked' class
    const clickTracker = (card) => {
        if (clickTrackerList.length <= 2) {
            clickTrackerList.push(card);
            card.classList.toggle("clicked");
            return clickTrackerList;
        }
    };

    // Gameover function which resets variables / timers and displays new menu elements
    const gameOver = (clicks) => {
        gameBoard.style.display = "none";
        gameOverMenu.style.display = "flex";
        gameOverScore.innerHTML = clicks;
        gameOverTime.innerHTML = displayTime.innerHTML;
        scoreCounter = 0;
        scoreClickCounter = 0;
        clickCounter = 0;
        clearInterval(timer)
        return;
    };
};