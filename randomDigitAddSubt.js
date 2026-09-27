/*import * as ac from './asciiConverter.js';
import * as m from './integerDataModel.js';*/
import { flipBook, adiro, sudiro } from "./dataModel.js";

function grs(m, n) {
    // 1. Generate the sequence from m to n
    const length = n - m + 1;
    const array = Array.from({ length: length }, (_, index) => m + index);
    
    // 2. Shuffle the array in-place (Fisher-Yates Algorithm)
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    
    return array;
}

// --- State variables ---
let currentIndex = 0;
let currentData = [];
let isPlaying = false;

// Helper function to replace asyncio.sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function checkInput(inp) {
    if (!inp) return false;
    
    // ord(inp[0]) == 48 is checking for '0'
    if (inp.charCodeAt(0) === 48 && inp.length > 1) {
        return false;
    }
    
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
        document.getElementById("scroll_container").innerText = currentData[currentIndex];
    }
}

function getInputs() {
    let v1 = document.getElementById("input_field1").value;
    let v2 = document.getElementById("input_field2").value;
    
    if (!(checkInput(v1) && checkInput(v2))) {
        window.alert("Please enter valid positive integers.");
        return [null, null]; // Replicates returning None, None
    }
    return [v1, v2];
}

function processResult(dub, opChar) {
    isPlaying = false;
    
    currentData = flipBook(dub[0]);
    currentIndex = 0;
    
    let val1 = document.getElementById("input_field1").value;
    let val2 = document.getElementById("input_field2").value;
    
    document.getElementById("output_label").innerText = `${val1} ${opChar} ${val2} = ${dub[1]}`;
    document.getElementById("rods_label").innerText = `rods: ${dub[0][0].length}`;
    
    updateDisplay();
    enableControls();
}

// --- MATH OPERATIONS (Event Listeners) ---

document.getElementById("process_button2").addEventListener("click", (event) => {
    let [v1, v2] = getInputs();
    if (v1) {
        // Fixed the missing closing parentheses from the Python version
        processResult(adiro(v1, v2, grs(0, v2.length - 1)), "+");
    }
});

document.getElementById("process_button4").addEventListener("click", (event) => {
    let [v1, v2] = getInputs();
    if (v1) {
        // Fixed the missing closing parentheses
        let dub = sudiro(v1, v2, grs(0, v2.length - 1));
        
        if (dub.length === 1) {
            window.alert("For sudiro the first number must be larger than the second.");
            return;
        }
        processResult(dub, "-");
    }
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
        // Fire and forget (like asyncio.ensure_future)
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
        // Adding currentData.length prevents JavaScript's negative modulo bug
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
    window.location.href = './multiplication.html';
});