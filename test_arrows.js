const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Load the HTML file content
const htmlContent = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
// Load the game script content
const gameScriptContent = fs.readFileSync(path.resolve(__dirname, 'guess.js'), 'utf-8');

const delay = ms => new Promise(res => setTimeout(res, ms));

// Helper to set up a new JSDOM instance for each test
function createDOM() {
    const dom = new JSDOM(htmlContent, { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true });
    const window = dom.window;
    const document = window.document;

    const scriptEl = window.document.createElement("script");
    scriptEl.textContent = gameScriptContent;
    window.document.body.appendChild(scriptEl);

    return { window, document, dom };
}

async function testArrowColors() {
    console.log("\n--- Test Case: Arrow Colors (Revised JSDOM Check) ---");
    // Test Too High for Green Arrow
    console.log("Sub-case: Guess Too High (Green Arrow)");
    let dom = createDOM();
    let window = dom.window;
    let document = dom.document;
    await delay(100);
    window.secnumber = 10;

    let guessInput = document.querySelector('.number');
    let checkButton = document.querySelector('.btnCheck');
    let arrowUp = document.querySelector('#arrow-up');

    guessInput.value = '20';
    checkButton.click();
    await delay(100);

    // JSDOM limitations: getComputedStyle may not return stylesheet colors reliably.
    // We check that JS isn't setting an inline color, implying CSS should rule.
    const arrowUpInlineColor = arrowUp.style.color;
    console.log(`arrow-up display: ${arrowUp.style.display}, inline color: '${arrowUpInlineColor}', animation: ${arrowUp.style.animation}`);
    if (arrowUp.style.display === 'block' && arrowUpInlineColor === '' && arrowUp.style.animation.includes('moveUp')) {
        console.log("Result: PASSED - Too High, arrow-up displayed/animated, inline color not set by JS (CSS should apply green).");
    } else {
        console.log("Result: FAILED - Too High, arrow-up state incorrect or JS set an inline color.");
    }
    await delay(2100);
    if (arrowUp.style.display !== 'none') console.log("FAIL Detail: arrow-up not hidden after 2s");


    // Test Too Low for Red Arrow
    console.log("Sub-case: Guess Too Low (Red Arrow)");
    dom = createDOM();
    window = dom.window;
    document = dom.document;
    await delay(100);
    window.secnumber = 20;

    guessInput = document.querySelector('.number');
    checkButton = document.querySelector('.btnCheck');
    let arrowDown = document.querySelector('#arrow-down');

    guessInput.value = '10';
    checkButton.click();
    await delay(100);

    const arrowDownInlineColor = arrowDown.style.color;
    console.log(`arrow-down display: ${arrowDown.style.display}, inline color: '${arrowDownInlineColor}', animation: ${arrowDown.style.animation}`);
    if (arrowDown.style.display === 'block' && arrowDownInlineColor === '' && arrowDown.style.animation.includes('moveDown')) {
        console.log("Result: PASSED - Too Low, arrow-down displayed/animated, inline color not set by JS (CSS should apply red).");
    } else {
        console.log("Result: FAILED - Too Low, arrow-down state incorrect or JS set an inline color.");
    }
    await delay(2100);
     if (arrowDown.style.display !== 'none') console.log("FAIL Detail: arrow-down not hidden after 2s");
}

async function testTrophyAnimationCorrectGuess() {
    console.log("\n--- Test Case: Trophy Animation (Correct Guess) ---");
    const { window, document } = createDOM();
    await delay(100);
    window.secnumber = 15;

    const guessInput = document.querySelector('.number');
    const checkButton = document.querySelector('.btnCheck');
    const midElement = document.querySelector('.mid');
    const trophyIcon = document.querySelector('#trophy-icon');
    const arrowUp = document.querySelector('#arrow-up');
    const arrowDown = document.querySelector('#arrow-down');

    guessInput.value = '15';
    checkButton.click();
    await delay(100);

    console.log(`Arrows display: up=${arrowUp.style.display}, down=${arrowDown.style.display}`);
    console.log(`Mid display: ${midElement.style.display}`);
    console.log(`Trophy display: ${trophyIcon.style.display}, animation: ${trophyIcon.style.animation}`);

    let pass = true;
    if (arrowUp.style.display !== 'none' || arrowDown.style.display !== 'none') { console.log("FAIL Detail: Arrows not hidden."); pass = false; }
    if (midElement.style.display !== 'none') { console.log("FAIL Detail: Mid element not hidden."); pass = false; }
    if (trophyIcon.style.display !== 'block' || !trophyIcon.style.animation.includes('scaleUpAndFade')) {
        console.log("FAIL Detail: Trophy not shown or animated correctly."); pass = false;
    }

    if(pass) console.log("Result: PASSED - Initial trophy animation state correct.");
    else console.log("Result: FAILED - Initial trophy animation state incorrect.");

    await delay(2100);

    console.log(`After 2s: Trophy display: ${trophyIcon.style.display}, Mid display: ${midElement.style.display}, Mid text: ${midElement.textContent}`);
    if (trophyIcon.style.display === 'none' && midElement.style.display === 'block' && midElement.textContent === '15') {
        console.log("Result: PASSED - Trophy hidden, mid restored correctly.");
    } else {
        console.log("Result: FAILED - Trophy/mid restoration incorrect.");
    }
}

async function testGameResetAfterTrophy() {
    console.log("\n--- Test Case: Game Reset After Trophy ---");
    const { window, document } = createDOM();
    await delay(100);
    window.secnumber = 15;

    const guessInput = document.querySelector('.number');
    const checkButton = document.querySelector('.btnCheck');
    const againButton = document.querySelector('.btn');
    const midElement = document.querySelector('.mid');
    const trophyIcon = document.querySelector('#trophy-icon');

    guessInput.value = '15';
    checkButton.click();
    await delay(100);

    console.log("Trophy shown, waiting for its animation to complete...");
    await delay(2500);

    console.log(`Before Reset: Trophy display: ${trophyIcon.style.display}, Mid display: ${midElement.style.display}`);
    if (trophyIcon.style.display !== 'none') console.log("Warning: Trophy should be hidden by its own timeout before reset.");
    if (midElement.style.display !== 'block') console.log("Warning: Mid should be visible by trophy's timeout before reset.");


    againButton.click();
    await delay(100);

    console.log(`After Reset: Trophy display: ${trophyIcon.style.display}, Mid display: ${midElement.style.display}, Mid text: ${midElement.textContent}, Input: '${guessInput.value}'`);
    if (trophyIcon.style.display === 'none' && midElement.style.display === 'block' && midElement.textContent === '?' && guessInput.value === '') {
        console.log("Result: PASSED - Game reset correctly after trophy display.");
    } else {
        console.log("Result: FAILED - Game reset incorrect after trophy display.");
    }
}

async function testNoInterferenceArrowAfterTrophyReset() {
    console.log("\n--- Test Case: No Interference - Arrow after Trophy game reset (Revised JSDOM Color Check) ---");
    const { window, document } = createDOM();
    await delay(100);
    window.secnumber = 15;

    const guessInput = document.querySelector('.number');
    const checkButton = document.querySelector('.btnCheck');
    const againButton = document.querySelector('.btn');
    const arrowUp = document.querySelector('#arrow-up');
    const trophyIcon = document.querySelector('#trophy-icon');

    guessInput.value = '15';
    checkButton.click();
    await delay(2500);

    againButton.click();
    await delay(100);

    window.secnumber = 10;
    guessInput.value = '20';
    checkButton.click();
    await delay(100);

    const arrowUpInlineColor = arrowUp.style.color;
    console.log(`Arrow-up display: ${arrowUp.style.display}, inline color: '${arrowUpInlineColor}', animation: ${arrowUp.style.animation}`);
    console.log(`Trophy display: ${trophyIcon.style.display}`);

    if (arrowUp.style.display === 'block' && arrowUpInlineColor === '' && arrowUp.style.animation.includes('moveUp') && trophyIcon.style.display === 'none') {
        console.log("Result: PASSED - Arrow shows correctly (CSS color assumed green), trophy remains hidden.");
    } else {
        console.log("Result: FAILED - Interference or incorrect display.");
    }
    await delay(2100);
}

async function testNoInterferenceTrophyAfterArrow() {
    console.log("\n--- Test Case: No Interference - Trophy after Arrow ---");
    const { window, document } = createDOM();
    await delay(100);
    window.secnumber = 10;

    const guessInput = document.querySelector('.number');
    const checkButton = document.querySelector('.btnCheck');
    const arrowUp = document.querySelector('#arrow-up');
    const midElement = document.querySelector('.mid');
    const trophyIcon = document.querySelector('#trophy-icon');

    guessInput.value = '20';
    checkButton.click();
    await delay(100);
    console.log(`After high guess: Arrow-up display: ${arrowUp.style.display}`);
    if (arrowUp.style.display !== 'block') console.log("Warning: Arrow-up did not display as expected.");

    await delay(2100);

    console.log(`After arrow timeout: Arrow-up display: ${arrowUp.style.display}`);
    if (arrowUp.style.display !== 'none') console.log("Warning: Arrow-up did not hide as expected.");

    guessInput.value = '10';
    checkButton.click();
    await delay(100);

    console.log(`After correct guess: Arrow-up display: ${arrowUp.style.display}`);
    console.log(`Mid display: ${midElement.style.display}`);
    console.log(`Trophy display: ${trophyIcon.style.display}, animation: ${trophyIcon.style.animation}`);

    let pass = true;
    if (arrowUp.style.display !== 'none') { console.log("FAIL Detail: Arrow-up not hidden on correct guess."); pass = false; }
    if (midElement.style.display !== 'none') { console.log("FAIL Detail: Mid element not hidden for trophy."); pass = false; }
    if (trophyIcon.style.display !== 'block' || !trophyIcon.style.animation.includes('scaleUpAndFade')) {
        console.log("FAIL Detail: Trophy not shown or animated correctly."); pass = false;
    }

    if(pass) console.log("Result: PASSED - Trophy sequence correct after arrow display.");
    else console.log("Result: FAILED - Trophy sequence incorrect after arrow display.");

    await delay(2100);
    if (trophyIcon.style.display !== 'none') console.log("FAIL Detail: Trophy not hidden after its animation.");
    if (midElement.style.display !== 'block') console.log("FAIL Detail: Mid element not restored after trophy.");

}

async function runAllTests() {
    console.log("--- Starting Updated Arrow Color & Trophy Animation Tests ---");
    await testArrowColors();
    await testTrophyAnimationCorrectGuess();
    await testGameResetAfterTrophy();
    await testNoInterferenceArrowAfterTrophyReset();
    await testNoInterferenceTrophyAfterArrow();
    console.log("\n--- All Tests Finished ---");
}

runAllTests();
