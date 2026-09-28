/*import * as ac from './asciiConverter.js';
import * as m from './integerDataModel.js';*/

import { stringize, flipBook, division } from './dataModel.js';

// --- State variables ---
let currentIndex = 0;
let page = 0;
let currentData = [];
let book = [];
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
        let safePage = Math.min(page, book.length - 1);
        document.getElementById("ab_scroll_container").innerText = book[safePage]; 
    }
}

function updateNbDisplay() {
    // 1. Safety Check: If data is empty or None, abort
    if (!currentData || currentData.length === 0) {
        return;
    }

    let val2 = document.getElementById("input_field2").value;
    let container = document.getElementById("nb_scroll_container");
    let images = container.getElementsByTagName('img');
    
    let requiredImages = 2 + val2.length;
    
    while (images.length < requiredImages) {
        container.appendChild(document.createElement('img'));
    }
    while (images.length > requiredImages) {
        container.removeChild(container.lastChild);
    }

    // 2. Safety Bounds Check
    let safeIdx = Math.min(currentIndex, currentData.length - 1);
    
    let lookaheadIdx;
    if (safeIdx + 1 < currentData.length) {
        lookaheadIdx = safeIdx + 1;
    } else {
        lookaheadIdx = safeIdx;
    }

    // 3. Safely get img_id (Protects against short '$' sublists)
    let targetIdx = (safeIdx === 0) ? lookaheadIdx : safeIdx;
    
    let imgId;
    // Verify the inner list actually has at least 3 items before reading index [2]
    if (currentData[targetIdx].length > 2) {
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
        images[i + 2].src = `./assets/${val2[i]}c.png`;
        images[i + 2].alt = `Image ${i}`;
    }
}

function updateSoFar() {
    document.getElementById("output_sofar").innerText = `output so far = ${currentData[currentIndex][1]}`;
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
    
    book = flipBook(dub[2]);
    page = 0;
    currentData = dub[2];
    currentIndex = 0;
    
    let val1 = document.getElementById("input_field1").value;
    let val2 = document.getElementById("input_field2").value;
    
    document.getElementById("output_label").innerText = `${val1} ${opChar} ${val2} = ${dub[1]}`;
    document.getElementById("rods_label").innerText = `rods: ${dub[2][0].length}`;
    
    // Build your chunks string
    let ls = [];
    let st = "\n";
    for (let c of dub[5]) {
        ls.push(c);
    }
    for (let c of ls) {
        st = st + stringize(c) + "\n";
    }
        
    // Get the label and update the text
    let chunksElem = document.getElementById("chunks_label");
    chunksElem.innerText = `chunks: ${st}`;
    
    // Explicitly grab the nb_scroll_container and put the label inside it
    let nbContainer = document.getElementById("nb_scroll_container");
    if (nbContainer) {
        // This puts it at the very top of the container, before the images. 
        // If you'd rather put it at the bottom, change this to: nbContainer.appendChild(chunksElem);
        nbContainer.insertBefore(chunksElem, nbContainer.firstChild);
    }
    
    updateAbDisplay();
    updateNbDisplay();
    enableControls();
}

// --- MATH OPERATIONS ---

document.getElementById("process_button").addEventListener("click", (event) => {
    let [v1, v2] = getInputs();
    if (v2 === "0") {
        window.alert("divide by 0 error.");
        return;
    }
    if (v1) {

        processResult(division(v1, v2), "÷");
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
        if (currentData[currentIndex].length > 0 && currentData[currentIndex][0] === "$") {
            updateNbDisplay();
            updateSoFar();
            currentIndex += 1;
        } else {
            currentIndex += 1;
            page += 1;
            updateAbDisplay();
        }

        await sleep(300);
    }
        
    isPlaying = false;
    enableControls();
}

document.getElementById("play_button").addEventListener("click", (event) => {
    if (!isPlaying && book.length > 0 && currentData.length > 0) {
        // Fire and forget, similar to asyncio.ensure_future
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
        document.getElementById("output_sofar").innerText = `output so far = ${currentData[1][1]}`;
    }
});

document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './squareRoot.html';
});