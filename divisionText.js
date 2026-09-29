//import * as ld from './longDiv.js';
//module.exports = ld.longDiv;
import { longDiv } from "./dataModel.js";


let currentIndex = 0;
let currentData = [];
let isPlaying = false;

function enable_controls(){
    document.getElementById("prev_button").disabled = False
    document.getElementById("next_button").disabled = False
    document.getElementById("clear_button").disabled = False
    document.getElementById("play_button").disabled = False
    document.getElementById("stop_button").disabled = False
}

function checkInput(inp) {
    if (!inp) return false;
    
    // Check for leading zero (unless it's exactly just "0")
    // 48 is the char code for '0'
    if (inp.charCodeAt(0) === 48 && inp.length > 1) {
        return false;
    }
    
    // Ensure all characters are digits between '0' (48) and '9' (57)
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

function getInputs() {
    let v1 = document.getElementById("input_field1").value;
    let v2 = document.getElementById("input_field2").value;
    
    if (!(checkInput(v1) && checkInput(v2))) {
        window.alert("Please enter valid positive integers.");
        return [null, null];
    }
    return [v1, v2];
}

function update_display(){
    if (currentData && currentData.length > 0) {
        document.getElementById("scroll_container").innerText = currentData[currentIndex];
    }
        
}
    

function processResult(dub, opChar) {
    isPlaying = false;
    
    // dub[0] is the matrix/data, dub[1] is the final string result
    currentData = dub[0];
    currentIndex = 0;
    
    let val1 = document.getElementById("input_field1").value;
    let val2 = document.getElementById("input_field2").value;
    
    document.getElementById("output_label").innerText = `${val1} ${opChar} ${val2} = ${dub[1]}`;
    
    
    //console.log(currentData)
    update_display();
    enableControls();
}

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
        update_display();
        await sleep(300); // 0.3 seconds (300 ms)
    }
    
    isPlaying = false;
    enableControls();
}

document.addEventListener("DOMContentLoaded", () => {
    
    // Listen for clicks on the entire document body
    document.body.addEventListener("click", (event) => {
        
        // event.target is the exact HTML element that was clicked
        const clickedId = event.target.id;
        
        let v1, v2, dub; // Variables used in process buttons

        // Route the click to the right logic based on the button's ID
        switch (clickedId) {
            
            case "process_button":
                [v1, v2] = getInputs();
                if (v1 !== null) {
                    dub = longDiv(v1,v2)
                    //console.log(dub[1])
                    // Match Python: process_result((dub[1], dub[0]), "×")
                    processResult([dub[1], dub[0]], "÷");
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
                    update_display();
                }
                break;

            case "prev_button":
                if (currentData && currentData.length > 0) {
                    // + currentData.length fixes Javascript's negative modulo bug
                    currentIndex = (currentIndex - 1 + currentData.length) % currentData.length;
                    update_display();
                }
                break;

            case "clear_button":
                isPlaying = false;
                if (currentData && currentData.length > 0) {
                    currentIndex = 0;
                    update_display();
                }
                break;

            case "btn_back":
                window.location.href = './division.html';
                break;
        }
    });
});