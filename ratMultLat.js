// Assuming your 'latm' module is translated and available, e.g.:
// import * as lm from './latm.js';

/*import * as lm from './latm.js';
import * as r from './TDDataModel.js';
import * as cr from './checkTDFormat.js'*/

/**
 * lm.makeGalGrid(inp1, inp2);
    let lAB = lm.latticeMult(inp1, inp2);
    let res = lm.convertToRegNum(lAB);
    let sl = lm.diagSum(inp1, inp2);
 */

import { checkTD, ratToDub, makeGalGrid, latticeMult, convertToRegNum, diagSum, stringize, dubToRat } from "./dataModel.js";

let matrix = [];
let topVal = "";
let rightVal = "";

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

function getInputs() {
    let v1 = document.getElementById("input_field1").value;
    let v2 = document.getElementById("input_field2").value;
    
    let valid = (checkTD(v1) && checkTD(v2)) || 
                (checkInput(v1) && checkTD(v2)) || 
                (checkInput(v2) && checkTD(v1)) || 
                (checkInput(v2) && checkInput(v1));
    
    if (v1.includes("-") || v2.includes("-")) {
        window.alert("Please enter valid positive rationals.");
        return [null, null];
    }
    if (!valid) {
        window.alert("Please enter valid positive rationals.");
        return [null, null];
    }
    return [v1, v2];
}

function updateGrid() {
    let image_matrix = matrix;
    
    // 1. Safety Check
    if (!image_matrix || image_matrix.length === 0) {
        return;
    }
        
    let num_rows = image_matrix.length;
    let num_cols = num_rows > 0 ? image_matrix[0].length : 0;
    
    let container = document.getElementById("grid_container");
    let current_rows = container.getElementsByClassName("grid-row");
    
    // 2. Adjust the number of Rows
    while (current_rows.length < num_rows) {
        let new_row = document.createElement("div");
        new_row.className = "grid-row";
        container.appendChild(new_row);
    }
        
    while (current_rows.length > num_rows) {
        container.removeChild(container.lastChild);
    }
        
    // 3. Adjust Columns per Row and Update Image Sources
    for (let r = 0; r < num_rows; r++) {
        let row_div = current_rows[r];
        let current_imgs = row_div.getElementsByTagName("img");
        
        while (current_imgs.length < num_cols) {
            let new_img = document.createElement("img");
            row_div.appendChild(new_img);
        }
            
        while (current_imgs.length > num_cols) {
            row_div.removeChild(row_div.lastChild);
        }
            
        // 4. Apply the image logic
        for (let c = 0; c < num_cols; c++) {
            let img_el = current_imgs[c];
            let img_id = image_matrix[r][c];
            
            // Only update the source if img_id actually has text in it
            if (img_id && img_id !== "") {
                img_el.src = `./assets/lm/${img_id}.png`;
                img_el.alt = `cell_${r}_${c}`;
                img_el.style.visibility = "visible"; 
            } else {
                // If it's an empty string, clear the image so it doesn't show a broken icon
                img_el.removeAttribute("src");
                img_el.alt = "";
                img_el.style.visibility = "hidden"; // Hides the broken image outline
                console.warn(`Grid cell [${r}][${c}] was empty and skipped.`);
            }
        }
    }
}

function genImMat(inp1, inp2, nC, nR, gg, lAB) {
    let grid = [];

    // Initialize 2D grid with empty strings
    for (let j = 0; j < nR; j++) {
        let row = [];
        for (let i = 0; i < nC; i++) {
            row.push("");
        }
        grid.push(row);
    }

    grid[0][0] = "square";
    grid[0][nC - 1] = "topRightCorner";
    grid[nR - 1][0] = "square";
    grid[nR - 1][nC - 1] = "bottomRightCorner";

    let curr = 1; // Fallback in case the loop below doesn't execute
    
    // fill west side
    for (let i = 1; i < nR - 1; i++) {
        grid[i][0] = lAB[i - 1] + "c";
        curr = i; // Mimics Python's behavior of leaking the loop variable's last state
    }
    
    // fill south side
    for (let i = 1; i < (lAB.length - curr + 1); i++) {
        grid[nR - 1][i] = lAB[curr + i - 1] + "c";
    }

    // fill north side
    for (let i = 1; i < nC - 1; i++) {
        grid[0][i] = inp1[i - 1] + "s";
    }

    // fill east side
    for (let i = 1; i < nR - 1; i++) {
        grid[i][nC - 1] = inp2[i - 1] + "s";
    }

    // fill middle
    for (let i = 0; i < gg.length; i++) {
        for (let j = 0; j < gg[0].length; j++) {
            grid[i + 1][j + 1] = String(gg[i][j][0]) + String(gg[i][j][1]) + "dia";
        }
    }
    
    matrix = grid;
}

function processResult(inp1, inp2) {

    let dub1 = ratToDub(inp1)
    let dub2 = ratToDub(inp2)
    
    if(inp1.length > 2){
        if(inp1[0] == "0"){
            inp1 = inp1.slice(2)
        }
        else{
            inp1 = dub1[0]
        }
    }
    if(inp2.length > 2){
        if(inp2[0] == "0"){
            inp2 = inp2.slice(2)
        }
        else{
            inp2 = dub2[0]
        }
    }

    let gg = makeGalGrid(inp1, inp2);
    let lAB = latticeMult(inp1, inp2);
    let res = convertToRegNum(lAB);
    let sl = diagSum(inp1, inp2);

    topVal = inp1;
    rightVal = inp2;

    let numCols = inp1.length + 2;
    let numRows = inp2.length + 2;

    genImMat(inp1, inp2, numCols, numRows, gg, lAB);
    updateGrid();
    let inte = stringize(res)
    let expo = String(parseInt(dub1[1])+parseInt(dub2[1]))

    document.getElementById("output_label").innerText = dubToRat([inte,expo]);
    document.getElementById("rods_label").innerText = sl;
}
/*

// Emulate PyScript's @when decorator by binding the event listener once the DOM loads
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("process_button").addEventListener("click", function latticeMultEvent(event) {
        let [v1, v2] = getInputs();
        if (v1 !== null) {
            processResult(v1, v2);
        }
    });
});*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded and ready!"); // Should appear when page loads
    
    const btn = document.getElementById("process_button");
    if (!btn) {
        console.error("Could not find button with ID 'process_button'");
        return;
    }

    btn.addEventListener("click", function(event) {
        console.log("Button was clicked!"); // Should appear on click
        
        let [v1, v2] = getInputs();
        console.log("Inputs received:", v1, v2); 
        
        if (v1 !== null) {
            console.log("Processing result...");
            processResult(v1, v2);
            console.log("Finished processing!"); // If this doesn't print, processResult crashed
        }
    });
});
document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './divRat.html';
});