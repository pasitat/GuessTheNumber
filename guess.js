'use strict';

const arrowUp = document.querySelector('#arrow-up');
const arrowDown = document.querySelector('#arrow-down');

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
    }
    else if( score === 1){
        document.querySelector('.message').textContent = '😭 You lost the game!';
        document.querySelector('#score').textContent = score - 1;
        arrowUp.style.display = 'none';
        arrowUp.style.animation = '';
        arrowDown.style.display = 'none';
        arrowDown.style.animation = '';
    }
    else if (guess === window.secnumber) { // Use window.secnumber
        document.querySelector('.message').textContent = '🎉 Correct Number';
        document.querySelector('.mid').textContent = window.secnumber; // Use window.secnumber
        document.querySelector('body').style.backgroundColor =  '#52006A';
        console.log(highscore);
        if (score > highscore) {
            highscore = score;
            document.querySelector('#highscore').textContent = highscore;
        }
        arrowUp.style.display = 'none';
        arrowUp.style.animation = '';
        arrowDown.style.display = 'none';
        arrowDown.style.animation = '';
    }
    else if (guess > window.secnumber) { // Use window.secnumber
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
    }
    else if (guess < window.secnumber) { // Use window.secnumber
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
    }
});

document.querySelector('.btn').addEventListener('click', function(){
    window.secnumber = Math.trunc(Math.random()*30)+1; // Use window.secnumber
    score = 20;
    document.querySelector('.message').textContent = 'Start Guessing....';
    document.querySelector('#score').textContent = score;
    document.querySelector('.mid').textContent = '?' ;
    document.querySelector('body').style.backgroundColor =  '#151515' ;
    arrowUp.style.display = 'none';
    arrowUp.style.animation = '';
    arrowDown.style.display = 'none';
    arrowDown.style.animation = '';
});
