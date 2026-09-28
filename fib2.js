/*import * as ac from './asciiConverter.js';
import * as m from './integerDataModel.js';*/
import { flipBook, fibo, reverseFibo, display} from "./dataModel.js";

// --- State variables ---
let currentIndex = 0;
let page = 0;
let book = [];
let currentData = [];
let cd = [];
let codes = [];
let toFlag = false;
let l = 0;
let isPlaying = false;

// Helper function to replicate asyncio.sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function enableControls() {
    if (currentIndex <= (currentData.length / 2) - 2) {
        document.getElementById("sf").disabled = false;
        document.getElementById("sb").disabled = true;
    } else if (currentIndex > (currentData.length / 2) - 2) {
        document.getElementById("sf").disabled = true;
        document.getElementById("sb").disabled = false;
    }
}

// Initial script execution state
document.getElementById("sf").disabled = false;
document.getElementById("sb").disabled = true;

function updateDisplay() {
    if (book.length > 0 && currentData.length > 0) {
        if (currentData[currentIndex][0] === "$") {
            // .slice(1) is the JS equivalent to [1:] in Python
            document.getElementById("output_label").innerText = currentData[currentIndex].slice(1);
            currentIndex = (currentIndex + 1) % currentData.length;
        } else {
            document.getElementById("scroll_container").innerText = display(currentData[currentIndex]);
            page = (page + 1) % book.length;
            currentIndex = (currentIndex + 1) % currentData.length;
        }
    }
}

// --- PLAYBACK CONTROLS ---

async function playFrames(flag) {

    isPlaying = true;
    
    // Disable interaction during play
    document.getElementById("sf").disabled = true;
    document.getElementById("sb").disabled = true;
    document.getElementById("my_combo_box").disabled = true;
    
    let nextNine = 0;
    while (isPlaying) {
        if (flag === "f") {
            if (currentIndex > (currentData.length / 2) - 2) {
                if (!toFlag) {
                    document.getElementById("output_label").innerText = currentData[currentIndex].slice(1);
                }
                break;
            }
            updateDisplay();
            await sleep(300); // 0.3 seconds
            
        } else if (flag === "b") {
            if (currentIndex <= (currentData.length / 2) - 2) {
                break;
            }
            updateDisplay();
            await sleep(300); // 0.3 seconds
        }
    }
    
    enableControls();
    document.getElementById("my_combo_box").disabled = false;
    isPlaying = false;
}

// Event Listeners replacing @when decorators
document.getElementById("sf").addEventListener("click", (event) => {
    if (!isPlaying && book.length > 0) {
        // asyncio.ensure_future equivalent is simply calling the async function without awaiting it
        playFrames("f"); 
    }
});

document.getElementById("sb").addEventListener("click", (event) => {
    if (!isPlaying && book.length > 0) {
        playFrames("b");
    }
});

document.getElementById("my_combo_box").addEventListener("change", (event) => {
    let selectedValue = event.target.value;
    page = 0;
    currentIndex = 0;
    cd = [];
    
    // Route logic based on selected value
    if (selectedValue === "option9") {
        codes = fibo(9)[0];
        for (let c of codes) cd.push(c);

        codes = reverseFibo(9);
        for (let c of codes) cd.push(c);

        book = flipBook(cd);
        currentData = cd;
        document.getElementById("scroll_container").innerText = display(currentData[1]);
        
    } else if (selectedValue === "option13") {
        codes = fibo(13)[0];
        for (let c of codes) cd.push(c);

        codes = reverseFibo(13);
        for (let c of codes) cd.push(c);

        book = flipBook(cd);
        currentData = cd;
        document.getElementById("scroll_container").innerText = display(currentData[1]);
        
    } else if (selectedValue === "option11") {
        codes = fibo(11)[0];
        for (let c of codes) cd.push(c);

        codes = reverseFibo(11);
        for (let c of codes) cd.push(c);

        book = flipBook(cd);
        currentData = cd;
        document.getElementById("scroll_container").innerText = display(currentData[1]);
        
    } else if (selectedValue === "option21") {
        toFlag = true;
        codes = fibo(21)[0];
        for (let c of codes) cd.push(c);

        codes = reverseFibo(21);
        for (let c of codes) cd.push(c);

        book = flipBook(cd);
        currentData = cd;
        document.getElementById("scroll_container").innerText = display(currentData[1]);
        
    } else if (selectedValue === "option19") {
        codes = fibo(19)[0];
        for (let c of codes) cd.push(c);

        codes = reverseFibo(19);
        for (let c of codes) cd.push(c);

        book = flipBook(cd);
        currentData = cd;
        document.getElementById("scroll_container").innerText = display(currentData[1]);
    }
    
    document.getElementById("sf").disabled = false;
    document.getElementById("sb").disabled = true;
});
document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './page7.html';
});