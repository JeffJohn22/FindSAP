"use strict";
// WORDSEARCH.JS
class WordSearch {
    constructor(wrapEl) {
        this.wrapEl = wrapEl;
        // Add `.ws-area` to wrap element
        this.wrapEl.classList.add("ws-area");
        //Words solved.
        this.solved = 0;
        // Default settings
        this.settings = {
            directions: ["W", "N", "WN", "EN"],
            gridSize: 10,
            words: ["one", "two", "three", "four", "five"],
            wordsList: [],
            debug: false,
        };
        // Check the words' length if it is overflow the grid
        if (this.parseWords(this.settings.gridSize)) {
            // Add words into the matrix data
            let isWorked = false;
            while (!isWorked) {
                // initialize the application
                this.initialize();
                isWorked = this.addWords();
            }
            // Fill up the remaining blank items
            if (!this.settings.debug) {
                this.fillUpFools();
            }
            // Draw the matrix into wrap element
            this.drawmatrix();
        }
    }
    parseWords(maxSize) {
        let itWorked = true;
        for (let i = 0; i < this.settings.words.length; i++) {
            // Convert all the letters to upper case
            this.settings.wordsList[i] = this.settings.words[i].trim();
            this.settings.words[i] = this.settings.wordsList[i].trim().toUpperCase();
            let word = this.settings.words[i];
            if (word.length > maxSize) {
                alert("The length of word `" + word + "` is overflow the gridSize.");
                console.error("The length of word `" + word + "` is overflow the gridSize.");
                itWorked = false;
            }
        }
        return itWorked;
    }
    addWords() {
        console.log("Adding words");
        let keepGoing = true, counter = 0, isWorked = true;
        while (keepGoing) {
            // Getting random direction
            let dir = this.settings.directions[this.randRange(0, this.settings.directions.length - 1)], result = this.addWord(this.settings.words[counter], dir);
            if (!result) {
                keepGoing = false;
                isWorked = false;
            }
            counter++;
            if (counter >= this.settings.words.length) {
                keepGoing = false;
            }
        }
        return isWorked;
    }
    addWord(word, direction) {
        let itWorked = true, directions = {
            W: [0, 1],
            N: [1, 0],
            WN: [1, 1],
            EN: [1, -1], // From top right to bottom left
        }, row, col; // y, x
        switch (direction) {
            case "W": // Horizontal (From left to right)
                (row = this.randRange(0, this.settings.gridSize - 1)),
                    (col = this.randRange(0, this.settings.gridSize - word.length));
                break;
            case "N": // Vertical (From top to bottom)
                (row = this.randRange(0, this.settings.gridSize - word.length)),
                    (col = this.randRange(0, this.settings.gridSize - 1));
                break;
            case "WN": // From top left to bottom right
                (row = this.randRange(0, this.settings.gridSize - word.length)),
                    (col = this.randRange(0, this.settings.gridSize - word.length));
                break;
            case "EN": // From top right to bottom left
                (row = this.randRange(0, this.settings.gridSize - word.length)),
                    (col = this.randRange(word.length - 1, this.settings.gridSize - 1));
                break;
            default:
                let error = "UNKNOWN DIRECTION " + direction + "!";
                alert(error);
                console.log(error);
                break;
        }
        // Add words to the matrix
        for (let i = 0; i < word.length; i++) {
            let newRow = row + i * directions[direction][0], newCol = col + i * directions[direction][1];
            // The letter on the board
            let origin = this.matrix[newRow][newCol].letter;
            if (origin === "." || origin === word[i]) {
                this.matrix[newRow][newCol].letter = word[i];
            }
            else {
                itWorked = false;
            }
        }
        return itWorked;
    }
    initialize() {
        this.matrix = [...Array(this.settings.gridSize)].map((_) => Array(this.settings.gridSize));
        this.selectFrom = null;
        this.selected = [];
        this.initmatrix(this.settings.gridSize);
    }
    initmatrix(size) {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                let item = {
                    letter: ".",
                    row,
                    col,
                };
                this.matrix[row][col] = item;
            }
        }
    }
    drawmatrix() {
        for (let row = 0; row < this.settings.gridSize; row++) {
            // New row
            let divEl = document.createElement("div");
            divEl.setAttribute("class", "ws-row");
            this.wrapEl.appendChild(divEl);
            for (let col = 0; col < this.settings.gridSize; col++) {
                let cvEl = document.createElement("canvas");
                cvEl.setAttribute("class", "ws-col");
                cvEl.setAttribute("width", "40");
                cvEl.setAttribute("height", "40");
                // Fill text in middle center
                let x = cvEl.width / 2, y = cvEl.height / 2;
                let ctx = cvEl.getContext("2d");
                ctx.font = "400 28px Calibri";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#333"; // Text color
                ctx.fillText(this.matrix[row][col].letter, x, y);
                // Add event listeners
                cvEl.addEventListener("mousedown", this.onMousedown(this.matrix[row][col]));
                cvEl.addEventListener("touchmove", this.onMousedown(this.matrix[row][col]));
                cvEl.addEventListener("mouseover", this.onMouseover(this.matrix[row][col]));
                cvEl.addEventListener("mouseup", this.onMouseup());
                divEl.appendChild(cvEl);
            }
        }
    }
    fillUpFools() {
        // let rangeLanguage = searchLanguage(this.settings.words[0].split('')[0]);
        for (let row = 0; row < this.settings.gridSize; row++) {
            for (let col = 0; col < this.settings.gridSize; col++) {
                if (this.matrix[row][col].letter === ".") {
                    // this.randRange(65, 90) => A ~ Z
                    this.matrix[row][col].letter = String.fromCharCode(this.randRange(65, 90));
                }
            }
        }
    }
    getItems(rowFrom, colFrom, rowTo, colTo) {
        let items = [];
        if (rowFrom === rowTo || colFrom === colTo || Math.abs(rowTo - rowFrom) === Math.abs(colTo - colFrom)) {
            let shiftY = rowFrom === rowTo ? 0 : rowTo > rowFrom ? 1 : -1, shiftX = colFrom === colTo ? 0 : colTo > colFrom ? 1 : -1, row = rowFrom, col = colFrom;
            items.push(this.getItem(row, col));
            do {
                row += shiftY;
                col += shiftX;
                items.push(this.getItem(row, col));
            } while (row !== rowTo || col !== colTo);
        }
        return items;
    }
    getItem(row, col) {
        return this.matrix[row] ? this.matrix[row][col] : undefined;
    }
    clearHighlight() {
        let selectedEls = document.querySelectorAll(".ws-selected");
        for (let i = 0; i < selectedEls.length; i++) {
            selectedEls[i].classList.remove("ws-selected");
        }
    }
    lookup(selected) {
        let words = [""];
        for (let i = 0; i < selected.length; i++) {
            words[0] += selected[i].letter;
        }
        words.push(words[0].split("").reverse().join(""));
        if (this.settings.words.indexOf(words[0]) > -1 || this.settings.words.indexOf(words[1]) > -1) {
            for (let i = 0; i < selected.length; i++) {
                let row = selected[i].row + 1, col = selected[i].col + 1, el = document.querySelector(".ws-area .ws-row:nth-child(" + row + ") .ws-col:nth-child(" + col + ")");
                el.classList.add("ws-found");
            }
            //Cross word off list.
            let wordList = document.querySelector(".ws-words");
            let wordListItems = wordList.getElementsByTagName("li");
            for (let i = 0; i < wordListItems.length; i++) {
                if (words[0] === wordListItems[i].innerHTML.toUpperCase()) {
                    if (wordListItems[i].innerHTML != "<del>" + wordListItems[i].innerHTML + "</del>") {
                        //Check the word is never found
                        wordListItems[i].innerHTML = "<del>" + wordListItems[i].innerHTML + "</del>";
                        //Increment solved words.
                        this.solved++;
                    }
                }
            }
            //Game over?
            if (this.solved === this.settings.words.length) {
                this.gameOver();
            }
        }
    }
    /**
     * Game Over
     */
    gameOver() {
        alert("yay");
    }
    /**
     * Mouse event - Mouse down
     * @param {Object} item
     */
    onMousedown(item) {
        return () => {
            this.selectFrom = item;
        };
    }
    /**
     * Mouse event - Mouse move
     * @param {Object}
     */
    onMouseover(item) {
        return () => {
            if (this.selectFrom) {
                this.selected = this.getItems(this.selectFrom.row, this.selectFrom.col, item.row, item.col);
                this.clearHighlight();
                for (let i = 0; i < this.selected.length; i++) {
                    let current = this.selected[i], row = current.row + 1, col = current.col + 1, el = document.querySelector(".ws-area .ws-row:nth-child(" + row + ") .ws-col:nth-child(" + col + ")");
                    el.className += " ws-selected";
                }
            }
        };
    }
    /**
     * Mouse event - Mouse up
     */
    onMouseup() {
        return () => {
            this.selectFrom = null;
            this.clearHighlight();
            this.lookup(this.selected);
            this.selected = [];
        };
    }
    randRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
// INDEX.HTML
let gameAreaEl = document.getElementById("ws-area");
let gameobj = new WordSearch(gameAreaEl);
// Put words into `.ws-words`
let words = gameobj.settings.wordsList, wordsWrap = document.querySelector(".ws-words");
for (let i in words) {
    let liEl = document.createElement("li");
    liEl.setAttribute("class", "ws-word");
    liEl.innerText = words[i];
    wordsWrap.appendChild(liEl);
}
