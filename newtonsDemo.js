
/*import * as ac from './asciiConverter.js';
import * as n from './abacusNewtons.js';
import * as m from './TDDataModel.js';*/

import { cubeRoot, flipBook } from "./dataModel.js";

function flipTester1(box) {
    if (typeof box[0] === 'string') {
        box = [box];
    }
    const flip = flipBook(box);
    return flip;
}

// State variables
let currentIndex = 0;
// page
let currentData = [];
// book
let isPlaying = false;

let roots = cubeRoot("4", "27", 5, 1);

for (let c of roots[1]) {
    if (c[0] === "%") {
        currentData.push(c);
        continue;
    }
    
    let book = flipTester1(c);

    for (let d of book) {
        currentData.push(d);
    }
}

currentData.push(["%", roots[0]]);
roots = cubeRoot("3.2", "27", 5, 1);

for (let c of roots[1]) {
    if (c[0] === "%") {
        currentData.push(c);
        continue;
    }
    
    let book = flipTester1(c);

    for (let d of book) {
        currentData.push(d);
    }
}

document.getElementById("output_label").innerText = "final " + roots[0];

function enableControls() {
    document.getElementById("prev_button").disabled = false;
    document.getElementById("next_button").disabled = false;
    document.getElementById("clear_button").disabled = false;
    document.getElementById("play_button").disabled = false;
    document.getElementById("stop_button").disabled = false;
}

function updateDisplay() {
    if (currentData && currentData.length > 0) {
        if (currentData[currentIndex][0] === "%") {
            document.getElementById("scroll_container").innerText = currentData[currentIndex][1];
        } else {
            document.getElementById("scroll_container").innerText = currentData[currentIndex];
        }
    }
}

enableControls();

// --- PLAYBACK CONTROLS ---

async function playFrames() {
    isPlaying = true;
    
    // Disable interaction during play
    document.getElementById("next_button").disabled = true;
    document.getElementById("play_button").disabled = true;
    document.getElementById("prev_button").disabled = true;
    
    while (isPlaying && currentIndex < currentData.length - 1) {
        currentIndex++;
        updateDisplay();
        // Equivalent of await asyncio.sleep(0.3)
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    isPlaying = false;
    enableControls();
}

document.getElementById("play_button").addEventListener("click", (event) => {
    if (!isPlaying && currentData.length > 0) {
        playFrames();
    }
});

document.getElementById("stop_button").addEventListener("click", (event) => {
    isPlaying = false;
});

// for division: if currentData[currentIndex][0] == '$'
// then increment currentIndex and run updateNbDisplay
document.getElementById("next_button").addEventListener("click", (event) => {
    if (currentData.length > 0) {
        currentIndex = (currentIndex + 1) % currentData.length;
        updateDisplay();
    }
});

document.getElementById("clear_button").addEventListener("click", (event) => {
    isPlaying = false;
    if (currentData.length > 0) {
        currentIndex = 0;
        updateDisplay();
    }
});

document.getElementById("prev_button").addEventListener("click", (event) => {
    if (currentData.length > 0) {
        // Adjusted to handle negative modulo correctly in JS
        currentIndex = (currentIndex - 1 + currentData.length) % currentData.length;
        updateDisplay();
    }
});

document.getElementById("btn_back").addEventListener("click", (event) => {
    window.alert("Congratulations! You have hopefully seen every interactive page. Make sure to check out the articles.");
    window.location.href = './index.html';
});