const gameBoard = document.querySelector('.game-container');
const cards = gameBoard.querySelectorAll('.card')

const gameSetup = () => {
    let classArray = ['one', 'two', 'three', 'four', 'five', 'six', 'one', 'two', 'three', 'four', 'five', 'six'];

    function shuffleArray(arr) {
        arr.sort(() => Math.random() - 0.5);
    }
    shuffleArray(classArray);
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.add(classArray[i]);
    }
}

const gamePlay = () => {
    let clickCounter = 0;
    let clickTracker = [];
    let scoreCounter = 0;
    // Listen for clicks
    cards.forEach(card => {
        card.addEventListener('click', () => {
            clickCounter++;
            if (clickCounter < 2) {
                clickTracker.push(card);
                card.classList.toggle('clicked');

            } else if (clickCounter === 2) {
                clickTracker.push(card);
                card.classList.toggle('clicked');
                setTimeout(checkCards, 1500, clickTracker);
            }
        })
    });

    const checkCards = (card) => {
        if (card[0].classList[1] === card[1].classList[1]) {
            // hide / remove cards
            card[0].style.opacity = 0;
            card[1].style.opacity = 0;
            // increase score variable
            scoreCounter++;
        } else {
            // flip cards back over
            card[0].classList.toggle('clicked');
            card[1].classList.toggle('clicked');
        }
        clickCounter = 0;
        clickTracker = [];
    }

    const clearCards = () => {

    }
};


gameSetup();
gamePlay();