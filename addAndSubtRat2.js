/*import * as ac from './asciiConverter.js';
import * as m from './TDDataModel.js';
import * as cr from './checkTDFormat.js';*/

import { checkTD, flipBook, unitRod, addRatBothSigns } from "./dataModel.js";

// State variables
let currentIndex = 0;
// page
let currentData = [];
// book
let isPlaying = false;
let a2 = ""


function checkInput(inp) {
    if (!inp) return false; //the empty string is falsy
    if (inp[0] == "-" && inp.length > 1){
        inp = inp.slice(1,inp.length)
    }
    if(inp.includes("-")) return false;
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

// def update_ab_display, and def update_nb_display for division

function updateDisplay() {
    if (currentData && currentData.length > 0) {
        document.getElementById("scroll_container").innerText = currentData[currentIndex];
    }
}

function getInputs() {
    const v1 = document.getElementById("input_field1").value;
    const v2 = document.getElementById("input_field2").value;
    
    const validCondition = 
        (checkTD(v1) && checkTD(v2)) || 
        (checkInput(v1) && checkTD(v2)) || 
        (checkInput(v2) && checkTD(v1)) || 
        (checkInput(v2) && checkInput(v1));

    if (!validCondition) {
        window.alert("Please enter valid rationals.");
        return [null, null];
    }
    return [v1, v2];
}

function processResult(dub, opChar) {
    isPlaying = false;
    
    // dub[0] is the final string result/matrix, dub[1] is the data (based on Python logic provided)
    currentData = flipBook(dub[1]);
    currentIndex = 0;
    
    const val1 = document.getElementById("input_field1").value;
    const val2 = document.getElementById("input_field2").value;
    
    document.getElementById("output_label").innerText = `${val1} ${opChar} ${val2} = ${dub[0]}`;
    document.getElementById("rods_label").innerText = `Unit rod: ${unitRod} rods from leftmost`;

    updateDisplay();
    enableControls();
}

// --- MATH OPERATIONS ---

document.getElementById("process_button").addEventListener("click", (event) => {
    const [v1, v2] = getInputs();
    a2 = v2;
    if (v1 !== null) {
        processResult(addRatBothSigns(v1, v2), "+");
    }
});

document.getElementById("process_button3").addEventListener("click", (event) => {
    const [v1, v2] = getInputs();
    let revisedv2 = ""
    if (v1 !== null) {
        if(v2[0] != "-"){
            revisedv2 = "-" + v2
        }
        else{
            revisedv2 = v2.slice(1,v2.length)
        }
        const stuff = addRatBothSigns(v1, revisedv2);
        
        if (stuff[1][0] === "-") {
            a2 = v1;
        } else {
            a2 = v2;
        }
        processResult(stuff, "-");
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
        currentIndex++;
        updateDisplay();
        // JavaScript equivalent to asyncio.sleep(0.3)
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
// then increment currentIndex and run update_nb_display
document.getElementById("next_button").addEventListener("click", (event) => {
    if (currentData.length > 0) {
        currentIndex = (currentIndex + 1) % currentData.length;
        updateDisplay();
    }
});

document.getElementById("prev_button").addEventListener("click", (event) => {
    if (currentData.length > 0) {
        // Adjusted to handle negative modulo correctly in Javascript
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
    window.location.href = './sqrtRational.html';
});