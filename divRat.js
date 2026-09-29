/*import * as ac from './asciiConverter.js';
import * as m from './TDDataModel.js';
import * as cr from './checkTDFormat.js';*/

import { flipBook, divRat, checkTD, ratToDub, unitRod} from "./dataModel.js";

// --- Helper function for asyncio.sleep ---
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- State Variables ---
let currentIndex = 0;
let page = 0;
let currentData = [];
let book = [];
let isPlaying = false;

// --- Input & Validation ---
function checkInput(inp) {
    if (!inp) return false;
    // 48 is ASCII '0', 57 is ASCII '9'
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

function getInputs() {
    let v1 = document.getElementById("input_field1").value;
    let v2 = document.getElementById("input_field2").value;
    
    let valid = (checkTD(v1) && checkTD(v2)) || 
                (checkInput(v1) && checkTD(v2)) || 
                (checkInput(v2) && checkTD(v1)) || 
                (checkInput(v2) && checkInput(v1));
                
    if (!valid) {
        window.alert("Please enter valid rationals.");
        return [null, null];
    }
    return [v1, v2];
}

// --- UI Controls ---
function enableControls() {
    // document.getElementById("prev_button").disabled = false;
    document.getElementById("next_button").disabled = false;
    document.getElementById("clear_button").disabled = false;
    document.getElementById("play_button").disabled = false;
    document.getElementById("stop_button").disabled = false;
}

function updateAbDisplay() {
    if (book && book.length > 0) {
        // Prevent 'page' from exceeding the length of the book
        let safePage = Math.min(page, book.length - 1);
        document.getElementById("ab_scroll_container").innerText = book[safePage]; 
    }
}

function updateNbDisplay() {
    // 1. Safety Check: If data is empty or null, abort
    if (!currentData || currentData.length === 0) {
        return;
    }

    let val2 = document.getElementById("input_field2").value;
    let val2Corr = ratToDub(val2)
    val2 = val2Corr[0]
    let container = document.getElementById("nb_scroll_container");
    let images = container.getElementsByTagName('img');
    
    let requiredImages = 2 + val2.length;
    
    // Add images if too few
    while (images.length < requiredImages) {
        container.appendChild(document.createElement('img'));
    }
    // Remove images if too many
    while (images.length > requiredImages) {
        container.removeChild(container.lastChild);
    }

    // 2. Safety Bounds Check
    let safeIdx = Math.min(currentIndex, currentData.length - 1);
    
    let lookaheadIdx = (safeIdx + 1 < currentData.length) ? safeIdx + 1 : safeIdx;

    // 3. Safely get img_id (Protects against short '$' sublists)
    let targetIdx = (safeIdx === 0) ? lookaheadIdx : safeIdx;
    
    let imgId;
    // Verify the inner list actually has at least 3 items before reading index [2]
    if (currentData[targetIdx] && currentData[targetIdx].length > 2) {
        imgId = currentData[targetIdx][2];
    } else {
        imgId = "0"; // Fallback image ID if the list is too short
    }
        
    // 4. Apply images to DOM
    images[0].src = `./assets/${imgId}d.png`;
    images[0].alt = "indicator";
    
    images[1].src = "./assets/b.png";
    images[1].alt = "base";
    
    for (let i = 0; i < val2.length; i++) {
        if (val2[i] === ".") {
            continue;
        }
        images[i + 2].src = `./assets/${val2[i]}c.png`;
        images[i + 2].alt = `Image ${i}`;
    }
}

function processResult(dub, opChar) {
    isPlaying = false;
    
    book = flipBook(dub[1]);
    page = 0;
    currentData = dub[1];
    currentIndex = 0;
    
    let val1 = document.getElementById("input_field1").value;
    let val2 = document.getElementById("input_field2").value;
    
    document.getElementById("output_label").innerText = `${val1} ${opChar} ${val2} = ${dub[0]}`;
    
    
    updateAbDisplay();
    updateNbDisplay();
    enableControls();
}

// --- MATH OPERATIONS ---
document.getElementById("process_button").addEventListener("click", () => {
    let [v1, v2] = getInputs();
    if (v2 === "0") {
        window.alert("divide by 0 error.");
        return;
    }
    if (v1) {
        processResult(divRat(v1, v2), "÷");
    }
});

// --- PLAYBACK CONTROLS ---
async function playFrames() {
    isPlaying = true;
    
    // Disable interaction during play
    document.getElementById("next_button").disabled = true;
    document.getElementById("play_button").disabled = true;
    
    while (isPlaying && currentIndex < currentData.length) {
        
        // Check if the inner list actually has items before checking index [0]
        if (currentData[currentIndex] && currentData[currentIndex].length > 0 && currentData[currentIndex][0] === "$") {
            updateNbDisplay();
            // update_soFar();
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

document.getElementById("play_button").addEventListener("click", () => {
    if (!isPlaying && book && book.length > 0 && currentData && currentData.length > 0) {
        playFrames();
    }
});

document.getElementById("stop_button").addEventListener("click", () => {
    isPlaying = false;
});

document.getElementById("next_button").addEventListener("click", () => {
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
    if (currentData[currentIndex] && currentData[currentIndex].length > 0 && currentData[currentIndex][0] === "$") {
        // It's a bead mode frame, update the bead display
        updateNbDisplay();
        // update_soFar();
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

document.getElementById("clear_button").addEventListener("click", () => {
    isPlaying = false;
    if (book && book.length > 0 && currentData && currentData.length > 0) {
        page = 0;
        currentIndex = 0;
        updateNbDisplay();
        updateAbDisplay();
        // document.getElementById("output_sofar").innerText = `output so far = ${currentData[1][1]}`;
    }
});

document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './addAndSubtRat.html';
});