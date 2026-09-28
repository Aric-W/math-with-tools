//import * as lm from './binLatMult.js';

import {    makeGalGrid2, binLatMult, convertToRegNum, diagSum2} from './dataModel.js'

// --- State Variables ---
let matrix = [];
let topVal = "";
let rightVal = "";

// --- Helper Functions ---
function checkInput(inp) {
    if (!inp) return false;
    // 48 = ASCII '0', 49 = ASCII '1'
    if (inp.charCodeAt(0) === 48 && inp.length > 1) {
        return false;
    }
    for (let i = 0; i < inp.length; i++) {
        let code = inp.charCodeAt(i);
        if (code < 48 || code > 49) {
            return false;
        }
    }
    return true;
}

function getInputs() {
    let v1 = document.getElementById("input_field1").value;
    let v2 = document.getElementById("input_field2").value;
    
    if (!(checkInput(v1) && checkInput(v2))) {
        window.alert("Please enter valid positive binary integers.");
        return [null, null];
    }
    return [v1, v2];
}

// --- DOM Grid Manipulation ---
function updateGrid() {
    /*
      Takes a 2D list (list of lists) of image filename bases.
      Example image_matrix: 
      [
          ["0c", "00dia", "1c"],
          ["b", "00dia", "2c"]
      ]
    */
    let imageMatrix = matrix;
    
    // 1. Safety Check
    if (!imageMatrix || imageMatrix.length === 0) {
        return;
    }
        
    let numRows = imageMatrix.length;
    let numCols = numRows > 0 ? imageMatrix[0].length : 0;
    
    let container = document.getElementById("grid_container");
    let currentRows = container.getElementsByClassName("grid-row");
    
    // 2. Adjust the number of Rows
    // Add new row divs if we need more
    while (currentRows.length < numRows) {
        let newRow = document.createElement("div");
        newRow.className = "grid-row";
        container.appendChild(newRow);
    }
        
    // Remove row divs if we have too many
    while (currentRows.length > numRows) {
        container.removeChild(container.lastChild);
    }
        
    // 3. Adjust Columns per Row and Update Image Sources
    for (let r = 0; r < numRows; r++) {
        let rowDiv = currentRows[r];
        let currentImgs = rowDiv.getElementsByTagName("img");
        
        // Add new img elements if this row needs more
        while (currentImgs.length < numCols) {
            let newImg = document.createElement("img");
            rowDiv.appendChild(newImg);
        }
            
        // Remove img elements if this row has too many
        while (currentImgs.length > numCols) {
            rowDiv.removeChild(rowDiv.lastChild);
        }
            
        // 4. Apply the image logic (mimicking images[r][c])
        for (let c = 0; c < numCols; c++) {
            let imgEl = currentImgs[c];
            let imgId = imageMatrix[r][c];
            
            // Map the 2D matrix data to your asset names
            imgEl.src = `./assets/lm/${imgId}.png`;
            imgEl.alt = `cell_${r}_${c}`;
        }
    }
}

// --- Matrix Generation ---
function genImMat(inp1, inp2, nC, nR, gg, lAB) {
    let grid = [];

    // Create the empty 2D array
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

    // fill west side
    let curr = 0;
    for (let i = 1; i < nR - 1; i++) {
        grid[i][0] = lAB[i - 1] + "c";
        curr = i; // Mimics Python's loop variable scoping scope leak
    }

    // fill south side
    for (let i = 1; i < lAB.length - curr + 1; i++) {
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

    // Assign globally
    matrix = grid;
}

// --- Processing Logic ---
function processResult(inp1, inp2) {
    let gg = makeGalGrid2(inp1, inp2);
    let lAB = binLatMult(inp1, inp2);
    let res = convertToRegNum(lAB);
    let sl = diagSum2(inp1, inp2);

    topVal = inp1;
    rightVal = inp2;

    let numCols = inp1.length + 2;
    let numRows = inp2.length + 2;

    genImMat(inp1, inp2, numCols, numRows, gg, lAB);
    updateGrid();

    document.getElementById("output_label").innerText = res;
    document.getElementById("rods_label").innerText = sl;
}

// --- Event Listeners ---
document.getElementById("process_button").addEventListener("click", (event) => {
    let [v1, v2] = getInputs();
    if (v1) {
        processResult(v1, v2);
    }
});
document.getElementById("btn_back").addEventListener("click", (event) => {
    window.location.href = './binAbacPage.html';
});