/*import * as ac from './asciiConverter.js';

import * as m from './integerDataModel.js';
import * as s from './subnumber.js';*/

import { flipBook, regAdd, minus, stringize, prepend0s, sn, produceProperSubnum } from './dataModel.js';

// --- State variables ---
let currentIndex = 0;
let currentData = [];
let isPlaying = false;
let subnum = [];
let a2 = "";

// Helper function to replace asyncio.sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function checkInput(inp) {
    if (!inp) return false;
    // Check if it starts with '0' and has a length > 1
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
    document.getElementById("prev_button").disabled = false;
    document.getElementById("next_button").disabled = false;
    document.getElementById("clear_button").disabled = false;
    document.getElementById("play_button").disabled = false;
    document.getElementById("stop_button").disabled = false;
}

function updateDisplay() {
    if (currentData.length > 0) {
        document.getElementById("scroll_container").innerText = currentData[currentIndex] + "\n" + subnum[currentIndex];
    }
}

function getInputs() {
    let v1 = document.getElementById("input_field1").value;
    let v2 = document.getElementById("input_field2").value;
    
    if (!(checkInput(v1) && checkInput(v2))) {
        window.alert("Please enter valid positive integers.");
        return [null, null]; // Replicating None, None
    }
    return [v1, v2];
}

function processResult(dub, opChar) {
    isPlaying = false;
    
    // dub[0] is the matrix/data, dub[1] is the final string result
    currentData = flipBook(dub[0]);
    currentIndex = 0;
    
    let val1 = document.getElementById("input_field1").value;
    let val2 = document.getElementById("input_field2").value;
    
    document.getElementById("output_label").innerText = `${val1} ${opChar} ${val2} = ${dub[1]}`;
    document.getElementById("rods_label").innerText = `rods: ${dub[0][0].length}`;
    
    let off = stringize(dub[0][0]).length - a2.length;
    let pz = prepend0s(a2, off);
    let base = sn(pz);
    subnum = produceProperSubnum(base, currentData.length);
    
    updateDisplay();
    enableControls();
}

// --- MATH OPERATIONS (Event Listeners) ---

document.getElementById("process_button").addEventListener("click", (event) => {
    let [v1, v2] = getInputs();
    a2 = v2;
    if (v1) {
        processResult(regAdd(v1, v2), "+");
    }
});

document.getElementById("process_button3").addEventListener("click", (event) => {
    let [v1, v2] = getInputs();
    
    if (!v1) return; // Prevent execution if inputs are invalid
    
    let stuff = minus(v1, v2);
    
    if (stuff[1][0] === "-") {
        a2 = v1;
    } else {
        a2 = v2;
    }
    
    processResult(stuff, "-");
});

// --- PLAYBACK CONTROLS ---

async function playFrames() {
    isPlaying = true;
    
    // Disable interaction during play
    document.getElementById("prev_button").disabled = true;
    document.getElementById("next_button").disabled = true;
    document.getElementById("play_button").disabled = true;
    
    while (isPlaying && currentIndex < currentData.length - 1) {
        currentIndex += 1;
        updateDisplay();
        await sleep(300); // 0.3 seconds
    }
    
    isPlaying = false;
    enableControls();
}

document.getElementById("play_button").addEventListener("click", (event) => {
    if (!isPlaying && currentData.length > 0) {
        // Fire and forget, similar to asyncio.ensure_future
        playFrames();
    }
});

document.getElementById("stop_button").addEventListener("click", (event) => {
    isPlaying = false;
});

document.getElementById("next_button").addEventListener("click", (event) => {
    if (currentData.length > 0) {
        currentIndex = (currentIndex + 1) % currentData.length;
        updateDisplay();
    }
});

document.getElementById("prev_button").addEventListener("click", (event) => {
    if (currentData.length > 0) {
        // Adding currentData.length prevents JS negative modulo bug
        currentIndex = (currentIndex - 1 + currentData.length) % currentData.length;
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

document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './randomDigitAddSubt.html';
});