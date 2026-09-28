/*import * as ac from './asciiConverterBinary.js';
import * as a from './binAbac.js';*/

import {binSubt,flipBookBin,decToBin} from './dataModel.js'

// --- Helper function to prevent UI freezing ---
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- State Variables ---
let currentIndex = 0;
let isPlaying = false;
let outputIndex = 0;

let currentData = [];
let cd = [];
let outputList = [];

// --- UI Logic ---
function enableControls() {
    if (currentIndex === 0) {
        document.getElementById("sf").disabled = false;
        document.getElementById("sb").disabled = true;
    } else if (currentIndex === currentData.length - 1) {
        document.getElementById("sf").disabled = true;
        document.getElementById("sb").disabled = false;
    } else {
        document.getElementById("sf").disabled = false;
        document.getElementById("sb").disabled = false;
    }
}

function updateDisplay(st) {
    if (currentData.length > 0) {
        document.getElementById("scroll_container").innerText = st;
    }
}

// --- Initialization & Processing (Async so it doesn't freeze the page) ---
async function initializeData() {
    // Generate subtraction data
    for (let i = 0; i <= 110; i++) {
        let val = 110 - i;
        outputList.push(String(val));

        let dub = binSubt(decToBin(val), "1");
        let codes = dub[1];

        let junk = [];
        for (let c of codes) {
            junk.push(c);
        }
        cd.push(junk);
        
        // Yield to the browser every 10 iterations so the page doesn't freeze
        if (i % 10 === 0) await sleep(1); 
    }

    outputList[110] = outputList[110] + " congratulations!";

    // Generate flipbooks
    for (let i = 0; i < cd.length; i++) {
        currentData.push(flipBookBin(cd[i]));
        
        // Yield to the browser every 10 iterations
        if (i % 10 === 0) await sleep(1);
    }

    // Apply the initial state to the DOM immediately
    document.getElementById("scroll_container").innerText = currentData[0][0];
    document.getElementById("output_label").innerText = `${outputList[0]}`;
    enableControls();
}

// --- Playback Controls ---
async function playFrames(flag) {
    isPlaying = true;
    
    // Disable interaction during play
    document.getElementById("sf").disabled = true;
    document.getElementById("sb").disabled = true;

    if (flag === "f") {
        outputIndex = outputIndex + 1;

        // Animate the frames
        for (let i = 0; i < currentData[currentIndex].length; i++) {
            updateDisplay(currentData[currentIndex][i]);
            await sleep(100); // 0.1 seconds
        }

        currentIndex = currentIndex + 1;
        
    } else if (flag === "b") {
        currentIndex = currentIndex - 1;
        outputIndex = outputIndex - 1;
        
        updateDisplay(currentData[currentIndex][0]);
        await sleep(100);
    }

    document.getElementById("output_label").innerText = outputList[outputIndex];
    enableControls();
    isPlaying = false;
}

// --- Event Listeners ---
document.getElementById("sf").addEventListener("click", (event) => {
    if (!isPlaying && currentData.length > 0) {
        playFrames("f");
    }
});

// The '#sb' button entirely resets the sequence back to 110
document.getElementById("sb").addEventListener("click", (event) => {
    currentIndex = 0;
    outputIndex = 0;
    
    document.getElementById("output_label").innerText = outputList[0];
    updateDisplay(currentData[0][0]);
    enableControls();
});

// Start the data generation as soon as the script runs
initializeData();

document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './binaryAddAndSubt.html';
});