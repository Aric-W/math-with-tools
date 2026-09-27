/*import * as ac from './asciiConverter.js';
import { abacus } from './abacusClass.js';*/

import {abacus, display} from './dataModel.js'


const aba = new abacus(3);
// aba.set("TT", 1);
aba.set("FF", 0);

let isPlaying = false;

function enableControls() {
    const currentValue = parseInt(aba.value(0, 3)[1], 10);
    
    if (currentValue === 0) {
        document.getElementById("sf").disabled = false;
        document.getElementById("sb").disabled = true;
    } else if (currentValue === 1110) {
        document.getElementById("sf").disabled = true;
        document.getElementById("sb").disabled = false;
    } else {
        document.getElementById("sf").disabled = false;
        document.getElementById("sb").disabled = false;
    }
}

// Initial DOM updates
document.getElementById("scroll_container").innerText = display(aba.backingList);
document.getElementById("output_label").innerText = aba.value(0, 3)[1];
enableControls();

function updateDisplay() {
    // if (currentData.length > 0) {
    //     document.getElementById("scroll_container").innerText = currentData[currentIndex];
    // }
    document.getElementById("scroll_container").innerText = display(aba.backingList);
    document.getElementById("output_label").innerText = aba.value(0, 3)[1];
}

const clears = [110, 210, 310, 410, 510, 610, 710, 810, 910];

// Helper function to replace asyncio.sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- PLAYBACK CONTROLS ---
async function playFrames(flag) {
    isPlaying = true;
    
    // Disable interaction during play
    document.getElementById("sf").disabled = true;
    document.getElementById("sb").disabled = true;
    
    if (flag === "f") {
        aba.add("1");
        await sleep(300); // 0.3 seconds
        updateDisplay();
        enableControls();
    } else if (flag === "b") {
        aba.subt("1");
        await sleep(300);
        updateDisplay();
        enableControls();
    }
    
    isPlaying = false;
}

// --- EVENT LISTENERS ---
document.getElementById("sf").addEventListener("click", (event) => {
    if (!isPlaying) {
        // Fire and forget (like asyncio.ensure_future)
        playFrames("f");
    }
});

document.getElementById("sb").addEventListener("click", (event) => {
    if (!isPlaying) {
        playFrames("b");
    }
});
document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './example1.html';
});