/*import * as ac from './asciiConverter.js';*/
//import * as m from './integerDataModel.js';

import { flipBook, sqrt } from "./dataModel.js";

// --- State variables ---
let currentIndex = 0;
let page = 0;
let currentData = [];
let book = [];
let chunks = "";
let isPlaying = false;

// Helper function to replace asyncio.sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function checkInput(inp) {
    if (!inp) return false;
    
    // Check if it starts with '0' and length > 1
    if (inp.charCodeAt(0) === 48 && inp.length > 1) {
        return false;
    }
    
    // Check if all characters are valid digits (0-9)
    for (let i = 0; i < inp.length; i++) {
        let code = inp.charCodeAt(i);
        if (code < 48 || code > 57) {
            return false;
        }
    }
    return true;
}

function enableControls() {
    document.getElementById("next_button").disabled = false;
    document.getElementById("clear_button").disabled = false;
    document.getElementById("play_button").disabled = false;
    document.getElementById("stop_button").disabled = false;
}

function updateAbDisplay() {
    if (book.length > 0) {
        // Prevent 'page' from exceeding the length of the book
        let safePage = Math.min(page, book.length - 1);
        document.getElementById("ab_scroll_container").innerText = book[safePage];
    }
}

function updateNbDisplay() {
    // 1. Safety Check: If data is empty or None, abort
    if (!currentData || currentData.length === 0) {
        return;
    }

    // 2. Find the most recent '$' state.
    // This guarantees the rods "stick around" perfectly even if you 
    // step through normal math frames or jump around the array.
    let targetIdx = currentIndex;
    while (targetIdx > 0 && (currentData[targetIdx].length === 0 || currentData[targetIdx][0] !== "$")) {
        targetIdx -= 1;
    }
        
    // 3. Extract the indicator digit and the rod string
    let indicatorVal = "0";
    let rodString = "";
    
    if (currentData[targetIdx].length > 0 && currentData[targetIdx][0] === "$") {
        if (currentData[targetIdx].length > 2) {
            indicatorVal = String(currentData[targetIdx][2]); // e.g., '3'
        }
        if (currentData[targetIdx].length > 3) {
            rodString = String(currentData[targetIdx][3]);    // e.g., '282842'
        }
    }

    let container = document.getElementById("nb_scroll_container");
    let images = container.getElementsByTagName('img');
    
    // 4. Calculate total required images: 
    // Indicator (1) + Base (1) + Intermediate Rods (variable) + Root (1)
    let requiredImages = 3 + rodString.length;
    
    // 5. Dynamically append or remove <img> elements to match the required count.
    // When looping back to the start, this shrinks it back down.
    while (images.length < requiredImages) {
        container.appendChild(document.createElement('img'));
    }
    while (images.length > requiredImages) {
        container.removeChild(container.lastChild);
    }

    // 6. Apply images to the DOM in strict left-to-right order
    
    // Position 0: Indicator Rod
    images[0].src = `./assets/${indicatorVal}d.png`;
    images[0].alt = `indicator ${indicatorVal}`;

    // Position 1: Base Rod
    images[1].src = "./assets/b.png";
    images[1].alt = "base";
    
    // Position 2 to (2 + length - 1): Intermediate Numbered Rods
    for (let i = 0; i < rodString.length; i++) {
        images[i + 2].src = `./assets/${rodString[i]}c.png`;
        images[i + 2].alt = `Rod ${rodString[i]}`;
    }

    // Last Position: Square Root Rod
    let rootIndex = rodString.length + 2;
    images[rootIndex].src = "./assets/s.png";
    images[rootIndex].alt = "root";
}

function updateSoFar() {
    document.getElementById("output_sofar").innerText = `output so far = ${currentData[currentIndex][1]}`;
    
}

function getInput() {
    let v1 = document.getElementById("input_field1").value;
    
    if (!checkInput(v1)) {
        window.alert("Please enter valid positive integers.");
        return null;
    }
    return v1;
}

function processResult(dub, opChar) {
    isPlaying = false;
    
    book = flipBook(dub[2]);
    page = 0;
    currentData = dub[2];
    currentIndex = 0;
    chunks = dub[5];

    document.getElementById("rods_label").innerText = `unit rod: ${dub[4]} from leftmost`;

    updateAbDisplay();
    enableControls();
}

// --- MATH OPERATIONS ---

document.getElementById("process_button").addEventListener("click", (event) => {
    let v = getInput();
    if (v) {
        processResult(sqrt(v), "√");
    }
});

// --- PLAYBACK CONTROLS ---

async function playFrames() {
    isPlaying = true;
    
    document.getElementById("next_button").disabled = true;
    document.getElementById("play_button").disabled = true;
    
    while (isPlaying && currentIndex < currentData.length) {
        
        // Check if the inner list actually has items before checking index [0]
        if (currentData[currentIndex].length > 0 && currentData[currentIndex][0] === "$") {
            updateNbDisplay();
            updateSoFar();
            currentIndex += 1;
        } else {
            currentIndex += 1;
            page += 1;
            updateAbDisplay();
        }

        await sleep(300); // 0.3 seconds
    }
        
    isPlaying = false;
    enableControls();
}

document.getElementById("play_button").addEventListener("click", (event) => {
    if (!isPlaying && book.length > 0 && currentData.length > 0) {
        playFrames();
    }
});

document.getElementById("stop_button").addEventListener("click", (event) => {
    isPlaying = false;
});

document.getElementById("next_button").addEventListener("click", (event) => {
    // 1. Safety Check: Ensure data exists
    if (!currentData || currentData.length === 0 || !book || book.length === 0) {
        return;
    }

    // 2. Wrapping Logic: If we are at the very last frame, reset to the start
    if (currentIndex >= currentData.length - 1) {
        currentIndex = 0;
        page = 0;
        updateNbDisplay();
        updateAbDisplay();
        return;
    }

    // 3. STEP FORWARD FIRST!
    currentIndex += 1;

    // 4. Now look at the frame we just stepped onto
    if (currentData[currentIndex].length > 0 && currentData[currentIndex][0] === "$") {
        // It's a bead mode frame, update the bead display
        updateNbDisplay();
        updateSoFar(); 
    } else {
        // It's a normal math frame, increment page
        page += 1;
        // Prevent page from exceeding the book length
        if (page >= book.length) {
            page = 0;
        }
            
        updateAbDisplay();
    }
});

document.getElementById("clear_button").addEventListener("click", (event) => {
    isPlaying = false;
    if (book.length > 0 && currentData.length > 0) {
        page = 0;
        currentIndex = 0;
        updateNbDisplay();
        updateAbDisplay();
        
        // Failsafe check in case currentData is short
        if (currentData.length > 1 && currentData[1].length > 1) {
            document.getElementById("output_sofar").innerText = `output so far = ${currentData[1][1]}`;
        }
    }
});

document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './fib1.html';
});