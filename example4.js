
/*import * as ac from './asciiConverter.js';
import { abacus } from './abacusClass.js';*/
import {abacus, flipBook} from './dataModel.js';


// --- State variables ---
let currentIndex = 0;

// Book / Abacus state
const aba = new abacus(3);
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
/*cd.push(['9', '0', '0'])
aba.set("900")
for (let i = 900; i <= 1110; i++) {
    outputList.push(i.toString());
    codes = aba.add("1");
    
    for (const c of codes) {
        cd.push(c);
    }
}*/
cd.push(['0', '0', '0']);
for (let i = 0; i <= 1110; i++) {
    outputList.push(i.toString());
    codes = aba.add("1");
    
    for (const c of codes) {
        cd.push(c);
    }
}
outputList[outputList.length-1] = outputList[outputList.length-1] + " congratulations!";
codes = aba.add("1");

for (const c of codes) {
    cd.push(c);
}
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

// align currentData and outputData
const clears = [110, 210, 310, 410, 510, 610, 710, 810, 910, 1010];

// Helper function to replace asyncio.sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- PLAYBACK CONTROLS ---
async function playFrames(flag) {
    isPlaying = true;
    
    // Disable interaction during play
    document.getElementById("sf").disabled = true;
    document.getElementById("sb").disabled = true;
    
    // 110, 210, 310, 410, 510, 610, 710, 810, 910, 1010
    if (clears.includes(outputIndex)) {
        if (flag === "f") {
            await sleep(100); // 0.1 seconds
            currentIndex += 1;
            updateDisplay();
            await sleep(100);
            currentIndex += 1;
            updateDisplay();
            await sleep(100);
            currentIndex += 1;
            updateDisplay();
            await sleep(100);
            currentIndex += 1;
            updateDisplay();
            
            document.getElementById("output_label").innerText = outputList[outputIndex + 1];
            outputIndex += 1;
            enableControls();   
            isPlaying = false;
            
        } else if (flag === "b") {
            await sleep(100);
            currentIndex -= 1;
            updateDisplay();
            await sleep(100);
            currentIndex -= 1;
            updateDisplay();
            await sleep(100);
            currentIndex -= 1;
            updateDisplay();
            await sleep(100);
            currentIndex -= 1;
            updateDisplay();
            
            // Replicating the specific hardcoded index from original script
            document.getElementById("output_label").innerText = outputList[109];
            enableControls();   
            isPlaying = false;
        }
        return;
    }
            
    if (flag === "f") {
        currentIndex += 1;
        outputIndex += 1;
        updateDisplay();
        await sleep(100);
            
    } else if (flag === "b") {
        currentIndex -= 1;
        outputIndex -= 1;    
        updateDisplay();
        await sleep(100);
    }
    
    document.getElementById("output_label").innerText = outputList[outputIndex];
    enableControls();   
    isPlaying = false;
}

// --- EVENT LISTENERS ---

document.getElementById("sf").addEventListener("click", (event) => {
    if (!isPlaying && currentData.length > 0) {
        // Fire and forget, similar to asyncio.ensure_future
        playFrames("f");
    }
});

document.getElementById("sb").addEventListener("click", (event) => {
    currentIndex = 0;
    outputIndex = 0;
    document.getElementById("output_label").innerText = outputList[0];
    updateDisplay();
    enableControls();
});
document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './example5.html';
});