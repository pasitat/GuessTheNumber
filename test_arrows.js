const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Load the HTML file content
const htmlContent = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
// Load the game script content
// Make sure to load the LATEST version of guess.js if it was modified
const gameScriptContent = fs.readFileSync(path.resolve(__dirname, 'guess.js'), 'utf-8');

const delay = ms => new Promise(res => setTimeout(res, ms));

// Helper to set up a new JSDOM instance for each test
function createDOM() {
    const dom = new JSDOM(htmlContent, { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true });
    const window = dom.window;
    const document = window.document;

    // Inject the game script
    // This will execute guess.js, including its own window.secnumber initialization
    const scriptEl = window.document.createElement("script");
    scriptEl.textContent = gameScriptContent;
    window.document.body.appendChild(scriptEl);

    return { window, document, dom };
}

async function testGuessTooHigh(secNumToSet = 5) {
    console.log("\n--- Test Case: Guess Too High ---");
    const { window, document } = createDOM();
    await delay(50); // Allow script init from createDOM
    window.secnumber = secNumToSet; // Override secnumber for this test

    const guessInput = document.querySelector('.number');
    const checkButton = document.querySelector('.btnCheck');
    const message = document.querySelector('.message');
    const arrowUp = document.querySelector('#arrow-up');

    guessInput.value = (secNumToSet + 20).toString(); // Guess high, e.g., 25 if secNum is 5
    checkButton.click();
    await delay(50);

    console.log(`(Secret number was set to: ${window.secnumber})`);
    console.log("Message:", message.textContent);
    console.log("arrowUp display:", arrowUp.style.display);
    console.log("arrowUp animation:", arrowUp.style.animation);

    if (message.textContent === '📈 Too High!' && arrowUp.style.display === 'block' && arrowUp.style.animation.includes('moveUp')) {
        console.log("Result: PASSED - Initial state correct.");
    } else {
        console.log("Result: FAILED - Initial state incorrect. SecNum:", window.secnumber, "Guess:", guessInput.value);
        return;
    }

    await delay(2100);
    console.log("arrowUp display after 2s:", arrowUp.style.display);
    if (arrowUp.style.display === 'none') {
        console.log("Result: PASSED - Arrow hidden after animation.");
    } else {
        console.log("Result: FAILED - Arrow not hidden after animation.");
    }
}

async function testGuessTooLow(secNumToSet = 25) {
    console.log("\n--- Test Case: Guess Too Low ---");
    const { window, document } = createDOM();
    await delay(50);
    window.secnumber = secNumToSet;

    const guessInput = document.querySelector('.number');
    const checkButton = document.querySelector('.btnCheck');
    const message = document.querySelector('.message');
    const arrowDown = document.querySelector('#arrow-down');

    guessInput.value = (secNumToSet - 20).toString(); // Guess low, e.g., 5 if secNum is 25
    checkButton.click();
    await delay(50);

    console.log(`(Secret number was set to: ${window.secnumber})`);
    console.log("Message:", message.textContent);
    console.log("arrowDown display:", arrowDown.style.display);
    console.log("arrowDown animation:", arrowDown.style.animation);

    if (message.textContent === '📉 Too Low!' && arrowDown.style.display === 'block' && arrowDown.style.animation.includes('moveDown')) {
        console.log("Result: PASSED - Initial state correct.");
    } else {
        console.log("Result: FAILED - Initial state incorrect. SecNum:", window.secnumber, "Guess:", guessInput.value);
        return;
    }

    await delay(2100);
    console.log("arrowDown display after 2s:", arrowDown.style.display);
    if (arrowDown.style.display === 'none') {
        console.log("Result: PASSED - Arrow hidden after animation.");
    } else {
        console.log("Result: FAILED - Arrow not hidden after animation.");
    }
}

async function testRapidAlternatingGuesses() {
    console.log("\n--- Test Case: Rapid Alternating Guesses ---");
    const { window, document } = createDOM();
    await delay(50);
    window.secnumber = 15; // Mid-range secret number

    const guessInput = document.querySelector('.number');
    const checkButton = document.querySelector('.btnCheck');
    const arrowUp = document.querySelector('#arrow-up');
    const arrowDown = document.querySelector('#arrow-down');

    console.log("Sub-case: High then Low. Secret:", window.secnumber);
    guessInput.value = '20'; // Too high
    checkButton.click();
    await delay(50);

    console.log("After high guess: arrowUp display:", arrowUp.style.display, "arrowDown display:", arrowDown.style.display);
    if (arrowUp.style.display !== 'block') console.log("FAIL: Up arrow didn't show on high guess.");

    guessInput.value = '10'; // Too low
    checkButton.click();
    await delay(50);

    console.log("After low guess: arrowUp display:", arrowUp.style.display, "arrowDown display:", arrowDown.style.display);
    console.log("arrowDown animation:", arrowDown.style.animation);

    if (arrowUp.style.display === 'none' && arrowDown.style.display === 'block' && arrowDown.style.animation.includes('moveDown')) {
        console.log("Result: PASSED - High->Low sequence correct.");
    } else {
        console.log("Result: FAILED - High->Low sequence incorrect.");
    }
    await delay(2100);
    if (arrowDown.style.display !== 'none') console.log("FAIL: Down arrow didn't hide after High->Low.");

    // Reset for next sub-case (game state is preserved in this DOM, so score might be lower)
    // window.secnumber remains 15, score is now lower. That's fine.
    console.log("Sub-case: Low then High. Secret:", window.secnumber);
    guessInput.value = '10'; // Too low
    checkButton.click();
    await delay(50);

    console.log("After low guess: arrowUp display:", arrowUp.style.display, "arrowDown display:", arrowDown.style.display);
    if (arrowDown.style.display !== 'block') console.log("FAIL: Down arrow didn't show on low guess.");

    guessInput.value = '20'; // Too high
    checkButton.click();
    await delay(50);

    console.log("After high guess: arrowUp display:", arrowUp.style.display, "arrowDown display:", arrowDown.style.display);
    console.log("arrowUp animation:", arrowUp.style.animation);

    if (arrowDown.style.display === 'none' && arrowUp.style.display === 'block' && arrowUp.style.animation.includes('moveUp')) {
        console.log("Result: PASSED - Low->High sequence correct.");
    } else {
        console.log("Result: FAILED - Low->High sequence incorrect.");
    }
    await delay(2100);
    if (arrowUp.style.display !== 'none') console.log("FAIL: Up arrow didn't hide after Low->High.");
}

async function testCorrectGuess() {
    console.log("\n--- Test Case: Correct Guess ---");
    const { window, document } = createDOM();
    await delay(50);
    const secret = 17;
    window.secnumber = secret;

    const guessInput = document.querySelector('.number');
    const checkButton = document.querySelector('.btnCheck');
    const message = document.querySelector('.message');
    const arrowUp = document.querySelector('#arrow-up');
    const arrowDown = document.querySelector('#arrow-down');

    guessInput.value = (secret + 5).toString();
    checkButton.click();
    await delay(50);
    console.log("After wrong guess (high): arrowUp display:", arrowUp.style.display);
    if (arrowUp.style.display !== 'block') console.log("Warning: Up arrow didn't show on initial high guess for this test. Secret:", window.secnumber);


    guessInput.value = secret.toString();
    checkButton.click();
    await delay(50);

    console.log("Message:", message.textContent);
    console.log("arrowUp display:", arrowUp.style.display);
    console.log("arrowDown display:", arrowDown.style.display);

    if (message.textContent === '🎉 Correct Number' && arrowUp.style.display === 'none' && arrowDown.style.display === 'none') {
        console.log("Result: PASSED - Arrows hidden on correct guess.");
    } else {
        console.log("Result: FAILED - Arrows not hidden or message incorrect. Secret:", window.secnumber, "Guess:", secret.toString());
    }
}

async function testNoInput() {
    console.log("\n--- Test Case: No Input ---");
    const { window, document } = createDOM();
    await delay(50);
    window.secnumber = 10;

    const guessInput = document.querySelector('.number');
    const checkButton = document.querySelector('.btnCheck');
    const message = document.querySelector('.message');
    const arrowUp = document.querySelector('#arrow-up');
    const arrowDown = document.querySelector('#arrow-down');

    guessInput.value = '15';
    checkButton.click();
    await delay(50);
    console.log("After wrong guess (high): arrowUp display:", arrowUp.style.display);
    if (arrowUp.style.display !== 'block') console.log("Warning: Up arrow didn't show on initial high guess. Secret:", window.secnumber);

    guessInput.value = '';
    checkButton.click();
    await delay(50);

    console.log("Message:", message.textContent);
    console.log("arrowUp display:", arrowUp.style.display);
    console.log("arrowDown display:", arrowDown.style.display);

    if (message.textContent === '🚫 No Number' && arrowUp.style.display === 'none' && arrowDown.style.display === 'none') {
        console.log("Result: PASSED - Arrows hidden on no input.");
    } else {
        console.log("Result: FAILED - Arrows not hidden or message incorrect. Secret:", window.secnumber);
    }
}

async function testGameReset() {
    console.log("\n--- Test Case: Game Reset ('Again!' button) ---");
    const { window, document } = createDOM();
    await delay(50);
    window.secnumber = 10; // Initial secret number

    const guessInput = document.querySelector('.number');
    const checkButton = document.querySelector('.btnCheck');
    const againButton = document.querySelector('.btn');
    const arrowUp = document.querySelector('#arrow-up');
    const arrowDown = document.querySelector('#arrow-down');

    guessInput.value = '15';
    checkButton.click();
    await delay(50);
    console.log("After wrong guess (high): arrowUp display:", arrowUp.style.display, "Secret:", window.secnumber);
     if (arrowUp.style.display !== 'block') console.log("Warning: Up arrow didn't show on initial high guess.");

    const oldSecNumber = window.secnumber;
    againButton.click();
    await delay(50); // Allow reset logic to run, including new random secnumber

    console.log("arrowUp display after reset:", arrowUp.style.display);
    console.log("arrowDown display after reset:", arrowDown.style.display);
    console.log("New secNumber after reset (should be different):", window.secnumber, "Old was:", oldSecNumber);

    if (arrowUp.style.display === 'none' && arrowDown.style.display === 'none') {
        console.log("Result: PASSED - Arrows hidden on game reset.");
    } else {
        console.log("Result: FAILED - Arrows not hidden on game reset.");
    }
    if (window.secnumber === oldSecNumber && oldSecNumber !== undefined) { // Check if secnumber actually changed, unless it randomly became the same
         // This could randomly happen, so it's a soft check.
        console.log("Warning: Secret number might not have changed on reset, or it randomly became the same value.");
    }
}

async function runAllTests() {
    console.log("--- Starting Arrow Animation Tests (with controllable secnumber) ---");
    await testGuessTooHigh(5);
    await testGuessTooLow(25);
    await testRapidAlternatingGuesses();
    await testCorrectGuess();
    await testNoInput();
    await testGameReset();
    console.log("\n--- Arrow Animation Tests Finished ---");
}

runAllTests();
