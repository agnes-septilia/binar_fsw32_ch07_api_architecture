// get element from html
const cardArray = document.querySelectorAll('.accordion-card');

// define function
function cardClosed(card, bullet, line, text) {
    document.getElementById(card).style.height = "60px";
    document.getElementById(bullet).style.content = "url('../images/assets/ellipse-outline.svg')";
    document.getElementById(line).style.visibility = "hidden";
    document.getElementById(text).style.visibility = "hidden";
}

function cardOpened(card, bullet, line, text) {
    document.getElementById(card).style.height = "100px";
    document.getElementById(bullet).style.content = "url('../images/assets/ellipse.svg')";
    document.getElementById(line).style.visibility = "visible";
    document.getElementById(text).style.visibility = "visible";
}


// create counter of clicked card
let cardOneClicked = 0;
let cardTwoClicked = 1;
let cardThreeClicked = 1; 


// run function on click
cardArray.forEach(card => {
    card.addEventListener("click", event => {
        if (card === cardArray[0]) {
            if (cardOneClicked % 2 === 0) {
                cardClosed("acc-card-1", "acc-bullet-1", "vertical-line-1", "acc-text-p1");
            } else {
                cardOpened("acc-card-1", "acc-bullet-1", "vertical-line-1", "acc-text-p1");
            }

            cardOneClicked++;

        } else if (card === cardArray[1]) {
            if (cardTwoClicked % 2 === 0) {
                cardClosed("acc-card-2", "acc-bullet-2", "vertical-line-2", "acc-text-p2");
            } else {
                cardOpened("acc-card-2", "acc-bullet-2", "vertical-line-2", "acc-text-p2");
            }

            cardTwoClicked++;

        } else {
            if (cardThreeClicked % 2 === 0) {
                cardClosed("acc-card-3", "acc-bullet-3", "vertical-line-3", "acc-text-p3");
            } else {
                cardOpened("acc-card-3", "acc-bullet-3", "vertical-line-3", "acc-text-p3");
            }

            cardThreeClicked++;
        }

    });

});