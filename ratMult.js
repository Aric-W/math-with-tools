

 import { checkTD, flipBook, ratToDub, multRat } from "./dataModel.js";

function makeSoup(base, expo) {
    const supMap = {
        '-': '⁻',
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹'
    };

    let built = "";
    // Ensure expo is a string
    let expoStr = String(expo); 
    
    for (let c of expoStr) {
        built += supMap[c] || c;
    }

    return `${base}${built}`;
}

// State variables
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
    const v1 = document.getElementById("input_field1").value;
    const v2 = document.getElementById("input_field2").value;
    
    const validCondition = 
        (checkTD(v1) && checkTD(v2)) || 
        (checkTD(v1) && checkTD(v2)) || 
        (checkTD(v2) && checkTD(v1)) || 
        (checkTD(v2) && checkTD(v1));

    if (!validCondition) {
        window.alert("Please enter valid rationals.");
        return [null, null];
    }
    return [v1, v2];
}

function processResult(dub, opChar) {
    isPlaying = false;
    
    // dub[0] is the matrix/data, dub[1] is the final string result
    currentData = flipBook(dub[0]);
    currentIndex = 0;
    
    const val1 = document.getElementById("input_field1").value;
    const val2 = document.getElementById("input_field2").value;
    const pair1 = ratToDub(val1);
    const pair2 = ratToDub(val2);
    const pair3 = ratToDub(dub[1]);
    
    const exp1 = makeSoup("10", pair1[1]);  
    const exp2 = makeSoup("10", pair2[1]);
    const exp3 = makeSoup("10", pair3[1]);
    
    document.getElementById("output_label").innerText = 
        `${pair1[0]} ${opChar} ${exp1}  ${opChar} ${pair2[0]}  ${opChar} ${exp2} = ${val1} ${opChar} ${val2} = ${dub[1]} = ${pair3[0]} ${opChar} ${exp3}`;
    
    //document.getElementById("rods_label").innerText = `Unit rod: ${m.unitRod} rods from leftmost`;
    
    updateDisplay();
    enableControls();
}

// --- MATH OPERATIONS ---

document.getElementById("process_button6").addEventListener("click", (event) => {
    const [v1, v2] = getInputs();
    if (v1 !== null) {
        const dub = multRat(v1, v2);
        // Note: Python was dub[1][0] and dub[0]. Assuming m.multRat returns array-like structures
        processResult([dub[1][0], dub[0]], "×");
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
        // Equivalent to asyncio.sleep(0.3)
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
    window.location.href = './ratMultLat.html';
});