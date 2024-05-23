document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    const words = ["SAPIANS", "SLIMS", "PEOPLE", "NEWS", "FUN", "COFFEE"];
    const gridSize = 15;
    const grid = [];

    // Initialize grid
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = '';
        }
    }
    console.log("Grid initialized");

    // Place words randomly on the grid
    words.forEach(word => placeWord(word));
    console.log("Words placed on grid", grid);

    // Fill empty cells with random letters
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }
    console.log("Grid filled with random letters", grid);

    // Display the grid
    const table = document.getElementById('wordGrid');
    grid.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, colIndex) => {
            const td = document.createElement('td');
            td.textContent = cell;
            td.addEventListener('click', () => toggleHighlight(td, rowIndex, colIndex));
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    console.log("Grid displayed on page");

    // Toggle highlighting of cells
    function toggleHighlight(cell, row, col) {
        cell.classList.toggle('highlight');
        checkWord(row, col);
    }

    // Check if a word is found
    function checkWord(row, col) {
        const cell = table.rows[row].cells[col];
        const letter = cell.textContent;
        words.forEach(word => {
            if (word.includes(letter)) {
                const horizontal = word === grid[row].slice(col, col + word.length).join('');
                const vertical = word === grid.map(row => row[col]).slice(row, row + word.length).join('');
                if (horizontal || vertical) {
                    markWord(row, col, word.length, horizontal ? 'horizontal' : 'vertical');
                    checkAllWordsFound();
                }
            }
        });
    }

    // Mark the found word
    function markWord(row, col, length, direction) {
        for (let i = 0; i < length; i++) {
            const cell = direction === 'horizontal' ? table.rows[row].cells[col + i] : table.rows[row + i].cells[col];
            cell.classList.add('found');
        }
    }

    function placeWord(word) {
        // Simplified example: place words horizontally from top left
        const row = Math.floor(Math.random() * (gridSize - word.length));
        const col
