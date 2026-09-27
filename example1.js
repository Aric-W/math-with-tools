/*import * as ac from './asciiConverter.js';
import { abacus } from './abacusClass.js';*/

import {abacus, flipBook} from './dataModel.js';

// --- State variables ---
let currentIndex = 0;
const aba = new abacus(9);
let codes = [];
let currentData = [];
let cd = [];
let l = 0;
let isPlaying = false;
let outputIndex = 0;
let outputList = [];

// --- Controls & Display Functions ---
function enableControls() {
    if (currentIndex < l - 1) {
        document.getElementById("sf").disabled = false;
        document.getElementById("sb").disabled = true;
    } else if (currentIndex >= l - 1) {
        document.getElementById("sf").disabled = true;
        document.getElementById("sb").disabled = false;
    }
}

document.getElementById("sf").disabled = false;
document.getElementById("sb").disabled = true;

// Initialize Abacus State
cd.push(['0', '0', '0', '0', '0', '0', '0', '0', '0']);

for (let i = 0; i < 9; i++) {
    codes = aba.add("123456789");
    outputList.push(aba.value(0, 9)[1]);
    for (const c of codes) {
        cd.push(c);
    }
}

l = cd.length;

for (let i = 0; i < 9; i++) {
    codes = aba.subt("123456789");
    outputList.push(aba.value(0, 9)[1]);
    for (const c of codes) {
        cd.push(c);
    }
}

currentData = flipBook(cd);
document.getElementById("scroll_container").innerText = currentData[0];

const finArithSeries = [
    "0",
    "0 + 123456789 = 123456789",
    "0 + 123456789 + 123456789 = 246913578",
    "0 + 123456789 + 123456789 + 123456789 = 370370367",
    "0 + 123456789 + 123456789 + 123456789 + 123456789 = 493827156",
    "0 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 = 617283945",
    "0 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 = 740740734",
    "0 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 = 864197523",
    "0 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 = 987654312",
    "0 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 + 123456789 = 1111111101",
    "1111111101 - 123456789 = 987654312",
    "1111111101 - 123456789 - 123456789 = 864197523",
    "1111111101 - 123456789 - 123456789 - 123456789 = 740740734",
    "1111111101 - 123456789 - 123456789 - 123456789 - 123456789 = 617283945",
    "1111111101 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 = 493827156",
    "1111111101 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 = 370370367",
    "1111111101 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 = 246913578",
    "1111111101 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 = 123456789",
    "1111111101 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 - 123456789 = 0"
];

document.getElementById("output_label").innerText = finArithSeries[0];

function updateDisplay() {
    if (currentData.length > 0) {
        document.getElementById("scroll_container").innerText = currentData[currentIndex];
    }
}

// Helper function to replace asyncio.sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- PLAYBACK CONTROLS ---
async function playFrames(flag) {
    isPlaying = true;
    
    // Disable interaction during play
    document.getElementById("sf").disabled = true;
    document.getElementById("sb").disabled = true;

    let nextNine = 0;
    while (isPlaying && nextNine < 9) {
        if (flag === "f") {
            currentIndex = (currentIndex + 1) % (currentData.length - 1);
            updateDisplay();
            await sleep(300);
        } else if (flag === "b") {
            currentIndex = (currentIndex + 1) % (currentData.length - 1);
            updateDisplay();
            await sleep(300);
        }
        nextNine += 1;
    }
    
    outputIndex = (outputIndex + 1) % outputList.length;
    document.getElementById("output_label").innerText = finArithSeries[outputIndex];
    enableControls();   
    isPlaying = false;
}

// --- EVENT LISTENERS ---
document.getElementById("sf").addEventListener("click", (event) => {
    if (!isPlaying && currentData.length > 0) {
        // Fire and forget (like asyncio.ensure_future)
        playFrames("f");
    }
});

document.getElementById("sb").addEventListener("click", (event) => {
    if (!isPlaying && currentData.length > 0) {
        playFrames("b");
    }
});
document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './basicAddAndSubt.html';
});