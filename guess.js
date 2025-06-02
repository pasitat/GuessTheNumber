'use strict';

const arrowUp = document.querySelector('#arrow-up');
const arrowDown = document.querySelector('#arrow-down');
const trophyIcon = document.querySelector('#trophy-icon');
const midElement = document.querySelector('.mid');

// console.log(document.querySelector('.message').textContent);
// document.querySelector('.message').textContent = '🎉 Correct Number'
// Make secnumber global for testing purposes
window.secnumber = Math.trunc(Math.random()*30)+1;
// document.querySelector('.mid').textContent = window.secnumber; // Optional: display for debugging tests
let score = 20;
let highscore = 0;

document.querySelector('.btnCheck').addEventListener('click', function(){
    const guess = Number(document.querySelector('.number').value);
    console.log(guess); // Log guess for test debugging
    console.log("Current secret number for check:", window.secnumber); // Log secret for test debugging

    if (!guess) {
        document.querySelector('.message').textContent = '🚫 No Number';
        arrowUp.style.display = 'none';
        arrowUp.style.animation = '';
        arrowDown.style.display = 'none';
        arrowDown.style.animation = '';
        trophyIcon.style.display = 'none'; // Ensure trophy is hidden here too
        trophyIcon.style.animation = '';
        midElement.style.display = 'block'; // Ensure mid is visible
    }
    else if( score === 1){ // Game lost condition
        document.querySelector('.message').textContent = '😭 You lost the game!';
        document.querySelector('#score').textContent = score - 1;
        arrowUp.style.display = 'none';
        arrowUp.style.animation = '';
        arrowDown.style.display = 'none';
        arrowDown.style.animation = '';
        trophyIcon.style.display = 'none'; // Ensure trophy is hidden
        trophyIcon.style.animation = '';
        midElement.style.display = 'block'; // Ensure mid is visible, showing last score or '?'
    }
    else if (guess === window.secnumber) { // Correct guess
        // Hide arrows first
        arrowUp.style.display = 'none';
        arrowUp.style.animation = '';
        arrowDown.style.display = 'none';
        arrowDown.style.animation = '';

        // Set mid element text, then hide it for trophy animation
        midElement.textContent = window.secnumber;
        midElement.style.display = 'none';

        // Show and animate trophy
        trophyIcon.style.display = 'block';
        trophyIcon.style.animation = 'scaleUpAndFade 2s forwards';

        // Update score message and background (as before)
        document.querySelector('.message').textContent = '🎉 Correct Number';
        document.querySelector('body').style.backgroundColor =  '#52006A';

        // Update highscore (as before)
        console.log(highscore);
        if (score > highscore) {
            highscore = score;
            document.querySelector('#highscore').textContent = highscore;
        }

        // After 2 seconds, hide trophy and restore mid element
        setTimeout(() => {
            trophyIcon.style.display = 'none';
            trophyIcon.style.animation = '';
            midElement.style.display = 'block';
        }, 2000);
    }
    else if (guess > window.secnumber) { // Too High
        arrowDown.style.display = 'none';
        arrowDown.style.animation = '';
        arrowUp.style.display = 'block';
        arrowUp.style.animation = 'moveUp 2s forwards';
        setTimeout(() => {
            arrowUp.style.display = 'none';
            arrowUp.style.animation = '';
        }, 2000);
        document.querySelector('.message').textContent = '📈 Too High!';
        score--;
        document.querySelector('#score').textContent  = score;
        // Ensure trophy is not accidentally shown
        trophyIcon.style.display = 'none';
        trophyIcon.style.animation = '';
        midElement.style.display = 'block';
    }
    else if (guess < window.secnumber) { // Too Low
        arrowUp.style.display = 'none';
        arrowUp.style.animation = '';
        arrowDown.style.display = 'block';
        arrowDown.style.animation = 'moveDown 2s forwards';
        setTimeout(() => {
            arrowDown.style.display = 'none';
            arrowDown.style.animation = '';
        }, 2000);
        document.querySelector('.message').textContent = '📉 Too Low!';
        score--;
        document.querySelector('#score').textContent = score;
        // Ensure trophy is not accidentally shown
        trophyIcon.style.display = 'none';
        trophyIcon.style.animation = '';
        midElement.style.display = 'block';
    }
});

document.querySelector('.btn').addEventListener('click', function(){ // Again button
    window.secnumber = Math.trunc(Math.random()*30)+1;
    score = 20;
    document.querySelector('.message').textContent = 'Start Guessing....';
    document.querySelector('#score').textContent = score;

    midElement.textContent = '?' ; // Reset mid text
    midElement.style.display = 'block'; // Ensure mid is visible

    document.querySelector('body').style.backgroundColor =  '#151515' ;

    arrowUp.style.display = 'none';
    arrowUp.style.animation = '';
    arrowDown.style.display = 'none';
    arrowDown.style.animation = '';

    trophyIcon.style.display = 'none'; // Hide trophy
    trophyIcon.style.animation = '';

    document.querySelector('.number').value = ''; // Clear input field
});
