/*
import * as ac from './asciiConverter.js';
import * as m from './integerDataModel.js';
*/

import { flipBook, multCNS, multJPS } from "./dataModel.js";



let currentIndex = 0;
let currentData = [];
let isPlaying = false;

function checkInput(inp) {
    if (!inp) return false;
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
    if (currentData && currentData.length > 0) {
        document.getElementById("scroll_container").innerText = currentData[currentIndex];
    }
}

function getInputs() {
    let v1 = document.getElementById("input_field1").value;
    let v2 = document.getElementById("input_field2").value;
    
    if (!(checkInput(v1) && checkInput(v2))) {
        window.alert("Please enter valid positive integers.");
        return [null, null];
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
    
    updateDisplay();
    enableControls();
}

// Javascript replacement for asyncio.sleep()
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function playFrames() {
    isPlaying = true;
    
    // Disable interaction during play
    document.getElementById("prev_button").disabled = true;
    document.getElementById("next_button").disabled = true;
    document.getElementById("play_button").disabled = true;
    
    while (isPlaying && currentIndex < currentData.length - 1) {
        currentIndex += 1;
        updateDisplay();
        await sleep(300); // 0.3 seconds (300 ms)
    }
    
    isPlaying = false;
    enableControls();
}

// --- EVENT DELEGATION (One Listener For All Buttons) ---
document.addEventListener("DOMContentLoaded", () => {
    
    // Listen for clicks on the entire document body
    document.body.addEventListener("click", (event) => {
        
        // event.target is the exact HTML element that was clicked
        const clickedId = event.target.id;
        
        let v1, v2, dub; // Variables used in process buttons

        // Route the click to the right logic based on the button's ID
        switch (clickedId) {
            
            case "process_button5":
                [v1, v2] = getInputs();
                if (v1 !== null) {
                    dub = multCNS(v1, v2);
                    // Match Python: process_result((dub[1], dub[0]), "×")
                    processResult([dub[1], dub[0]], "×");
                }
                break;

            case "process_button6":
                [v1, v2] = getInputs();
                if (v1 !== null) {
                    dub = multJPS(v1, v2);
                    processResult([dub[1], dub[0]], "×");
                }
                break;

            case "play_button":
                if (!isPlaying && currentData && currentData.length > 0) {
                    // Calling an async function without 'await' acts like asyncio.ensure_future()
                    playFrames(); 
                }
                break;

            case "stop_button":
                isPlaying = false;
                break;

            case "next_button":
                if (currentData && currentData.length > 0) {
                    currentIndex = (currentIndex + 1) % currentData.length;
                    updateDisplay();
                }
                break;

            case "prev_button":
                if (currentData && currentData.length > 0) {
                    // + currentData.length fixes Javascript's negative modulo bug
                    currentIndex = (currentIndex - 1 + currentData.length) % currentData.length;
                    updateDisplay();
                }
                break;

            case "clear_button":
                isPlaying = false;
                if (currentData && currentData.length > 0) {
                    currentIndex = 0;
                    updateDisplay();
                }
                break;
            case "btn_back":
                window.location.href = './divisionText.html';
                break;
        }
    });
});