/*import * as ac from './asciiConverterBinary.js';
import * as a from './binAbac.js';*/

import { flipBookBin, binAdd, decToBin  } from "./dataModel.js";

// --- Helper function for asyncio.sleep ---
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- State Variables ---
let currentIndex = 0;
let isPlaying = false;
let outputIndex = 0;

let currentData = [];
let cd = [];
let outputList = [];
let subnList = [];

// --- String Formatting ---
function spaceOut(strin) {
    let built = " ";
    for (let c of strin) {
        built = built + c + " ";
    }
    return built;
}

// --- Initialization ---

// 1. Establish the "Zero" Baseline (Index 0)
outputList.push("0");
subnList.push(spaceOut("00"));
cd.push([["0", "0"]]); // Static empty abacus frame

// 2. Loop to build the math steps (Index 1 to 110)
for (let i = 0; i < 110; i++) {
    outputList.push(String(i + 1));

    let dub = binAdd(decToBin(i), "1");
    subnList.push(spaceOut(dub[0]));
    
    let codes = dub[1];
    let junk = [];
    for (let c of codes) {
        junk.push(c);
    }
    cd.push(junk);
}

outputList[110] = outputList[110] + " congratulations!";

for (let sl of cd) {
    currentData.push(flipBookBin(sl));
}

// --- DOM Initial Setup ---
document.addEventListener("DOMContentLoaded", () => {
    // Display the final frame of the current state (which for index 0 is the static frame)
    let initialFrame = currentData[0][currentData[0].length - 1];
    document.getElementById("scroll_container").innerText = initialFrame + subnList[0];
    document.getElementById("output_label").innerText = `${outputList[0]}`;
    enableControls();
});

// --- UI Logic ---
function enableControls() {
    if (currentIndex === 0) {
        document.getElementById("sf").disabled = false;
        document.getElementById("sb").disabled = true;
    } else if (currentIndex === currentData.length - 1) {
        document.getElementById("sf").disabled = true;
        document.getElementById("sb").disabled = false;
    } else {
        document.getElementById("sf").disabled = false;
        document.getElementById("sb").disabled = false;
    }
}

function updateDisplay(st, sn) {
    if (currentData.length > 0) {
        document.getElementById("scroll_container").innerText = st +  sn;
    }
}

// --- Playback Controls ---
async function playFrames(flag) {
    isPlaying = true;

    document.getElementById("sf").disabled = true;
    document.getElementById("sb").disabled = true;

    if (flag === "f") {
        // Increment indices FIRST so we grab the animation meant for this step
        currentIndex = currentIndex + 1;
        outputIndex = outputIndex + 1;

        // Now animate through the currentData frames for this new step
        for (let i = 0; i < currentData[currentIndex].length; i++) {
            let st = currentData[currentIndex][i];
            let sn = subnList[outputIndex];

            // 1. Find the actual visual width of the ASCII frame. 
            // We do this by measuring the length of the first line up to the newline character.
            let stWidth = st.indexOf('\n') !== -1 ? st.indexOf('\n') : st.length;

            // 2. Pad 'sn' with leading spaces so it matches the exact width of the abacus above it
            if (stWidth > sn.length) {
                let paddingNeeded = stWidth - sn.length+1;
                sn = " ".repeat(paddingNeeded) + sn;
            }

            updateDisplay(st, sn);
            await sleep(100); 
        }

    } else if (flag === "b") {
        currentIndex = currentIndex - 1;
        outputIndex = outputIndex - 1;
        
        // When going backward, we just jump straight to the finished frame of the previous state
        let lastFrameOfTarget = currentData[currentIndex][currentData[currentIndex].length - 1];
        let sn = subnList[outputIndex];
        
        // Apply the same alignment logic for the backward step
        let stWidth = lastFrameOfTarget.indexOf('\n') !== -1 ? lastFrameOfTarget.indexOf('\n') : lastFrameOfTarget.length;
        if (stWidth > sn.length) {
            let paddingNeeded = stWidth - sn.length;
            sn = " ".repeat(paddingNeeded) + sn;
        }

        updateDisplay(lastFrameOfTarget, sn);
        await sleep(100);
    }

    document.getElementById("output_label").innerText = outputList[outputIndex];
    enableControls();
    isPlaying = false;
}

// --- Event Listeners ---
// These replace the @when decorators from PyScript
document.getElementById("sf").addEventListener("click", (event) => {
    if (!isPlaying && currentData.length > 0) {
        // Calling playFrames triggers the async execution immediately (no await needed for UI events)
        playFrames("f");
    }
});

document.getElementById("sb").addEventListener("click", (event) => {
    // In the python logic, 'sb' resets to 0 rather than stepping backward
    currentIndex = 0;
    outputIndex = 0;
    document.getElementById("output_label").innerText = outputList[0];
    updateDisplay(currentData[0][0], subnList[0]);
    enableControls();
});
document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './example5Binary.html';
});