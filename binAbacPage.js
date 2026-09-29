/*import * as ac from './asciiConverterBinary.js';
import * as b from './binAbac.js';*/
import { flipBookBin, BLD } from "./dataModel.js";

// --- Helper function for async delays ---
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- State Variables ---
let currentIndex = 0;
let currentData = [];
let isPlaying = false;
let a2 = "";

// --- Helper & UI Functions ---
function checkInput(inp) {
    if (!inp) return false;
    // 48 = ASCII '0', 49 = ASCII '1'
    if (inp.charCodeAt(0) === 48 && inp.length > 1) {
        return false;
    }
    for (let i = 0; i < inp.length; i++) {
        let code = inp.charCodeAt(i);
        if (code < 48 || code > 49) {
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
    if (currentData && currentData.length > 0) {
        document.getElementById("scroll_container").innerText = currentData[currentIndex];
    }
}

function getInputs() {
    let v1 = document.getElementById("input_field1").value;
    let v2 = document.getElementById("input_field2").value;
    
    if (!(checkInput(v1) && checkInput(v2))) {
        window.alert("Please enter valid positive binary integers.");
        return [null, null];
    }
    return [v1, v2];
}

function processResult(dub, opChar) {
    isPlaying = false;
    
    // dub[0] is the matrix/data, dub[1] is the final string result
    currentData = flipBookBin(dub[1]);
    currentIndex = 0;
    
    let val1 = document.getElementById("input_field1").value;
    let val2 = document.getElementById("input_field2").value;
    
    document.getElementById("output_label").innerText = `${val1} ${opChar} ${val2} = ${dub[0]}`;
    

    updateDisplay();
    enableControls();
}

// --- Math Operations ---
document.getElementById("process_button").addEventListener("click", () => {
    let [v1, v2] = getInputs();
    a2 = v2;
    if (v1) {
        processResult(BLD(v1, v2), "÷");
    }
});

// --- Playback Controls ---
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

document.getElementById("play_button").addEventListener("click", () => {
    if (!isPlaying && currentData && currentData.length > 0) {
        playFrames();
    }
});

document.getElementById("stop_button").addEventListener("click", () => {
    isPlaying = false;
});

document.getElementById("next_button").addEventListener("click", () => {
    if (currentData && currentData.length > 0) {
        currentIndex = (currentIndex + 1) % currentData.length;
        updateDisplay();
    }
});

document.getElementById("prev_button").addEventListener("click", () => {
    if (currentData && currentData.length > 0) {
        // Prevent negative results from JavaScript's % modulo operator
        currentIndex = (currentIndex - 1 + currentData.length) % currentData.length;
        updateDisplay();
    }
});

document.getElementById("clear_button").addEventListener("click", () => {
    isPlaying = false;
    if (currentData && currentData.length > 0) {
        currentIndex = 0;
        updateDisplay();
    }
});

document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './ratMult.html';
});