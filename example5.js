/*import * as ac from './asciiConverter.js';
import { abacus } from './abacusClass.js';*/

import {abacus, flipBook} from './dataModel.js';

// --- State variables ---
let currentIndex = 0;

const aba = new abacus(3);
aba.set("TTT");
let codes = [];
let currentData = [];
let cd = [];
let l = 0;

let isPlaying = false;

let outputIndex = 0;
let outputList = [];

// --- Initialization ---
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

cd.push(['T', 'T', 'T']);
for (let i = 0; i <= 1110; i++) {
    outputList.push((1110 - i).toString());
    codes = aba.subt("1");
    
    for (const c of codes) {
        cd.push(c);
    }
}
outputList[1110] = outputList[1110] + " congratulations!";
l = cd.length;

currentData = flipBook(cd);
document.getElementById("scroll_container").innerText = currentData[0];

document.getElementById("output_label").innerText = `${outputList[0]}`;
enableControls();

function updateDisplay() {
    if (currentData.length > 0) {
        document.getElementById("scroll_container").innerText = currentData[currentIndex];
    }
}

const clears = [110, 210, 310, 410, 510, 610, 710, 810, 910, 1010];

// Helper function to replace asyncio.sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- PLAYBACK CONTROLS ---
async function playFrames(flag) {
    isPlaying = true;
    
    document.getElementById("sf").disabled = true;
    document.getElementById("sb").disabled = true;

    if (clears.includes(outputIndex)) {
        if (flag === "b") {
            await sleep(100);
            currentIndex = (currentIndex + 1); 
            updateDisplay();
            await sleep(100);
            currentIndex = (currentIndex + 1); 
            updateDisplay();
            await sleep(100);
            currentIndex = (currentIndex + 1); 
            updateDisplay();
            await sleep(100);
            currentIndex = (currentIndex + 1); 
            updateDisplay();

            document.getElementById("output_label").innerText = outputList[outputIndex + 1];
            outputIndex = outputIndex + 1;
            enableControls();   
            isPlaying = false;
            
        } else if (false) { // Directly translating 'elif False:'
            await sleep(300);
            currentIndex = (currentIndex - 1); 
            updateDisplay();
            await sleep(300);
            currentIndex = (currentIndex - 1); 
            updateDisplay();
            await sleep(300);
            currentIndex = (currentIndex - 1); 
            updateDisplay();
            await sleep(300);
            currentIndex = (currentIndex - 1); 
            updateDisplay();
            
            document.getElementById("output_label").innerText = outputList[109];
            enableControls();   
            isPlaying = false;
        }
        return;
    }
            
    if (flag === "b") {
        currentIndex = (currentIndex + 1); 
        outputIndex = (outputIndex + 1); 
        updateDisplay();
        await sleep(100);
            
    } else if (false) { // Directly translating 'elif False:'
        currentIndex = (currentIndex - 1); 
        outputIndex = (outputIndex - 1);     
        updateDisplay();
        await sleep(300);
    }
    
    document.getElementById("output_label").innerText = outputList[outputIndex];
    enableControls();   
    isPlaying = false;
}

// --- EVENT LISTENERS ---
document.getElementById("sf").addEventListener("click", (event) => {
    if (!isPlaying && currentData.length > 0) {
        // Fire and forget (like asyncio.ensure_future)
        playFrames("b");
    }
});

document.getElementById("sb").addEventListener("click", (event) => {
    outputIndex = 0;
    currentIndex = 0;
    updateDisplay();
    enableControls();
    document.getElementById("output_label").innerText = outputList[0];
});

document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './example6.html';
});