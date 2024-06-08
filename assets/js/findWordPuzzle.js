import { sounds } from '../js/sounds.js';

const puzzles = [
    {
        words: ['HELLO', 'WORLD', 'CODE', 'JAVA', 'SCRIPT']
    },
    {
        words: ['PYTHON', 'HTML', 'CSS', 'GRID', 'WEB']
    }
];

let currentPuzzle = 0;
let foundWords = new Set();
let selectedCells = [];
let gridSize = 12;
let grid = [];

function createGridAndWords() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    const words = puzzles[currentPuzzle].words;

    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const startRow = Math.floor(Math.random() * gridSize);
            const startCol = Math.floor(Math.random() * gridSize);

            if (direction === 'horizontal' && startCol + word.length <= gridSize) {
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    if (grid[startRow][startCol + i] !== '') {
                        canPlace = false;
                        break;
                    }
                }
                if (canPlace) {
                    for (let i = 0; i < word.length; i++) {
                        grid[startRow][startCol + i] = word[i];
                    }
                    placed = true;
                }
            } else if (direction === 'vertical' && startRow + word.length <= gridSize) {
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    if (grid[startRow + i][startCol] !== '') {
                        canPlace = false;
                        break;
                    }
                }
                if (canPlace) {
                    for (let i = 0; i < word.length; i++) {
                        grid[startRow + i][startCol] = word[i];
                    }
                    placed = true;
                }
            }
        }
    });

    // Fill empty cells with random letters
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === '') {
                grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    return grid;
}

function createGrid(grid) {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const div = document.createElement('div');
            div.className = 'grid-item';
            div.innerText = grid[i][j];
            div.dataset.row = i;
            div.dataset.col = j;
            div.onclick = () => selectCell(i, j);
            gridContainer.appendChild(div);
        }
    }
}

function createWordContainer(words) {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';

    words.forEach(word => {
        const div = document.createElement('div');
        div.className = 'word-item';
        div.dataset.word = word;
        div.innerText = '_ '.repeat(word.length);
        wordContainer.appendChild(div);
    });
}

function selectCell(row, col) {
    if (selectedCells.length === 0 || selectedCells.length === 1) {
        const cell = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('selected');
        selectedCells.push({ row, col });

        if (selectedCells.length === 2) {
            const first = selectedCells[0];
            const last = selectedCells[1];

            if (first.row !== last.row && first.col !== last.col) {
                // Non-aligned selection
                sounds['sfx_windows_error'].play();
                highlightInvalidSelection();
                setTimeout(() => {
                    selectedCells.forEach(({ row, col }) => {
                        const cell = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);
                        cell.classList.remove('selected', 'invalid-selection');
                    });
                    selectedCells = [];
                }, 1000);
            } else {
                checkSelectedCells();
            }
        }
    }
}

function checkSelectedCells() {
    const word = getSelectedWord();
    if (word) {
        sounds['gura'].play();
        highlightWord(word);
        updateWordContainer(word);
    } else {
        sounds['sfx_windows_error'].play();
        highlightInvalidSelection();
        setTimeout(() => {
            selectedCells.forEach(({ row, col }) => {
                const cell = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);
                cell.classList.remove('selected', 'invalid-selection');
            });
            selectedCells = [];
        }, 1000);
    }

    if (foundWords.size === puzzles[currentPuzzle].words.length) {
        sounds['sfx_celebrate_horn'].play();
        sounds['kobo'].play();
        document.getElementById('completion-message').style.display = 'block';
        document.getElementById('next-button').style.display = 'inline-block';
        disableGrid();
    }
}

function getSelectedWord() {
    const { words } = puzzles[currentPuzzle];
    let word = '';

    if (selectedCells.length === 2) {
        const first = selectedCells[0];
        const last = selectedCells[1];

        if (first.row === last.row) {
            // Horizontal
            const row = first.row;
            const start = Math.min(first.col, last.col);
            const end = Math.max(first.col, last.col);
            word = grid[row].slice(start, end + 1).join('');
            selectedCells = [];
            for (let i = start; i <= end; i++) {
                selectedCells.push({ row, col: i });
            }
        } else if (first.col === last.col) {
            // Vertical
            const col = first.col;
            for (let i = Math.min(first.row, last.row); i <= Math.max(first.row, last.row); i++) {
                word += grid[i][col];
                selectedCells.push({ row: i, col });
            }
        } else {
            // Non-aligned selection, clear selection
            selectedCells = [];
            return null;
        }

        word = word.toUpperCase();
        if (words.includes(word)) {
            return word;
        }
    }

    return null;
}

function highlightWord(word) {
    const first = selectedCells[0];
    const last = selectedCells[selectedCells.length - 1];

    if (first.row === last.row) {
        // Horizontal
        selectedCells.forEach(({ row, col }) => {
            const cell = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add('selected-horizontal');
        });
    } else if (first.col === last.col) {
        // Vertical
        selectedCells.forEach(({ row, col }) => {
            const cell = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add('selected-vertical');
        });
    }

    foundWords.add(word);
    selectedCells = [];
}

function highlightInvalidSelection() {
    selectedCells.forEach(({ row, col }) => {
        const cell = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('invalid-selection');
    });
}

function updateWordContainer(word) {
    const wordItem = document.querySelector(`.word-item[data-word="${word}"]`);
    wordItem.innerText = word;
}

function disableGrid() {
    const cells = document.querySelectorAll('.grid-item');
    cells.forEach(cell => {
        cell.onclick = null;
    });
}

function nextPuzzle() {
    currentPuzzle++;
    if (currentPuzzle >= puzzles.length) {
        alert('No more puzzles!');
        return;
    }

    foundWords.clear();
    document.getElementById('completion-message').style.display = 'none';
    document.getElementById('next-button').style.display = 'none';
    const grid = createGridAndWords();
    createGrid(grid);
    createWordContainer(puzzles[currentPuzzle].words);
}

window.onload = () => {
    const grid = createGridAndWords();
    createGrid(grid);
    createWordContainer(puzzles[currentPuzzle].words);
};

window.nextPuzzle = nextPuzzle;