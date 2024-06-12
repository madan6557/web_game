import { matchConect } from '../js/puzzleAssets.js';

let currentPuzzleIndex = 0;
let selectedTarget = null;
let selectedColor = null;
let isSoundPuzzle;
const matches = {};
const colors = {};
let reverseMatches = {};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initializePuzzle() {
    reverseMatches = {};

    const puzzleData = matchConect.level0[currentPuzzleIndex];
    const container = document.querySelector('.container');
    isSoundPuzzle = puzzleData.type === 'sound';

    container.innerHTML = `
        <h1>Permainan Mencocokan ${isSoundPuzzle ? 'Suara' : 'Gambar'}</h1>
        <div class="puzzle-container"></div>
        <svg id="connections"></svg>
        <button id="submit-btn">Submit</button>
        <div id="result"></div>
    `;

    const puzzleContainer = container.querySelector('.puzzle-container');
    puzzleContainer.style.display = 'flex';
    puzzleContainer.style.flexDirection = isSoundPuzzle ? 'column' : 'row';
    puzzleContainer.style.justifyContent = 'center';
    puzzleContainer.style.alignItems = 'center';

    const nameButtons = [];
    const buttonWrappers = [];

    puzzleData.puzzles.forEach((puzzle, index) => {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('buttons');
        buttonWrapper.style.display = 'flex';
        buttonWrapper.style.flexDirection = isSoundPuzzle ? 'row' : 'column';
        buttonWrapper.style.alignItems = 'center';
        buttonWrapper.style.margin = '10px';

        const targetButtonsWrapper = document.createElement('div');
        targetButtonsWrapper.classList.add('sound-buttons');

        const nameButtonsWrapper = document.createElement('div');
        nameButtonsWrapper.classList.add('name-buttons');

        if (isSoundPuzzle) {
            targetButtonsWrapper.style.marginRight = '100px';
        } else {
            targetButtonsWrapper.style.marginBottom = '100px';
        }

        const targetButton = document.createElement('button');
        targetButton.classList.add(isSoundPuzzle ? 'sound-btn' : 'image-btn');
        targetButton.setAttribute('data-index', index);
        if (isSoundPuzzle) {
            targetButton.setAttribute('data-sound', puzzle.sound);
            targetButton.setAttribute('data-color', puzzle.color);
            targetButton.style.backgroundColor = puzzle.color;
            targetButton.textContent = `Suara ${index + 1}`;
            targetButton.addEventListener('click', () => {
                selectedTarget = index;
                selectedColor = puzzle.color;
                puzzle.sound.play();
                resetTargetColors();
                targetButton.style.backgroundColor = selectedColor; // Highlight selected sound button
            });
        } else {
            targetButton.innerHTML = `<img src="${puzzle.image}" alt="Gambar ${index + 1}" />`;
            targetButton.addEventListener('click', function () {
                selectedTarget = parseInt(this.getAttribute('data-index'), 10); // Pastikan index berupa number
                selectedColor = 'blue'; // Set default color for images
                resetTargetColors();
                this.style.borderColor = selectedColor; // Highlight selected image button
            });
        }
        targetButtonsWrapper.appendChild(targetButton);

        const nameButton = document.createElement('button');
        nameButton.classList.add('name-btn');
        nameButton.setAttribute('data-index', index); // Assign correct index
        nameButton.setAttribute('data-name', puzzle.label);
        nameButton.textContent = puzzle.label;
        nameButton.addEventListener('click', () => {
            if (selectedTarget !== null) {
                const name = puzzle.label;
                if (reverseMatches[selectedTarget] !== undefined) {
                    const prevName = reverseMatches[selectedTarget];
                    const prevButton = document.querySelector(`.name-btn[data-name="${prevName}"]`);
                    if (prevButton) {
                        prevButton.style.backgroundColor = '#008CBA'; // Reset color
                    }
                    delete matches[prevName];
                    removeConnection(selectedTarget, prevName);
                    delete reverseMatches[selectedTarget];
                }
                matches[name] = selectedTarget;
                reverseMatches[selectedTarget] = name;
                colors[name] = selectedColor;
                nameButton.style.backgroundColor = selectedColor;
                drawConnection(selectedTarget, name, selectedColor);
                selectedTarget = null;
                selectedColor = null;
            } else {
                document.getElementById('result').textContent = `Pilih ${isSoundPuzzle ? 'Suara' : 'Gambar'} dulu.`;
            }
        });
        nameButtons.push(nameButton);

        buttonWrapper.appendChild(targetButtonsWrapper);
        buttonWrapper.appendChild(nameButtonsWrapper);

        buttonWrappers.push(buttonWrapper);
    });

    // Simpan indeks asli setiap tombol sebelum melakukan pengacakan
    const originalButtonIndices = nameButtons.map(button => parseInt(button.getAttribute('data-index'), 10));

    // Shuffle name buttons
    shuffle(nameButtons);

    // Logging shuffled name buttons
    console.log("Shuffled name buttons:", nameButtons.map(button => button.textContent));

    // Append shuffled name buttons to their respective wrappers
    nameButtons.forEach((button, index) => {
        const originalIndex = originalButtonIndices[index]; // Dapatkan indeks asli dari array
        const nameButtonsWrapper = buttonWrappers[originalIndex].querySelector('.name-buttons');
        nameButtonsWrapper.appendChild(button);
    });

    // Additional logging for verification
    console.log("Updated button order:", buttonWrappers.map(wrapper => Array.from(wrapper.querySelectorAll('.name-btn')).map(btn => btn.textContent)));

    // Append button wrappers to the puzzle container
    buttonWrappers.forEach(wrapper => {
        puzzleContainer.appendChild(wrapper);
    });

    document.getElementById('submit-btn').addEventListener('click', () => {
        if (document.getElementById('submit-btn').textContent === 'Submit') {
            let correctMatches = 0;
            puzzleData.puzzles.forEach((puzzle, index) => {
                if (matches[puzzle.label] === index) {
                    correctMatches++;
                }
            });
            document.getElementById('result').textContent = `Jawaban yang benar: ${correctMatches} dari ${puzzleData.puzzles.length}.`;
            document.getElementById('submit-btn').textContent = 'Next';
        } else {
            currentPuzzleIndex++;
            if (currentPuzzleIndex < matchConect.level0.length) {
                document.getElementById('connections').innerHTML = '';
                initializePuzzle();
            } else {
                document.querySelector('.container').innerHTML = '<h1>Permainan Selesai!</h1>';
            }
        }
    });

    resetTargetColors();
}

function resetTargetColors() {
    document.querySelectorAll('.sound-btn').forEach(button => {
        button.style.backgroundColor = button.getAttribute('data-color');
    });
    document.querySelectorAll('.image-btn').forEach(button => {
        button.style.borderColor = 'transparent';
    });
}

function drawConnection(soundIndex, name, color) {
    const targetButton = document.querySelector(`.sound-btn[data-index="${soundIndex}"], .image-btn[data-index="${soundIndex}"]`);
    const nameButton = document.querySelector(`.name-btn[data-name="${name}"]`);
    const svg = document.getElementById('connections');
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const targetRect = targetButton.getBoundingClientRect();
    const nameRect = nameButton.getBoundingClientRect();

    const lineID = `${soundIndex}-${name}-line`;

    const lines = document.querySelectorAll(`line[id*="-line"]`);
    lines.forEach(line => {
        if (line.id.endsWith(`-${name}-line`)) {
            line.parentNode.removeChild(line);
        }
    });

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('id', lineID);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '2');

    if (isSoundPuzzle) {
        line.setAttribute('x1', targetRect.right - containerRect.left);
        line.setAttribute('y1', targetRect.top + (targetRect.height / 2) - containerRect.top);
        line.setAttribute('x2', nameRect.left - containerRect.left);
        line.setAttribute('y2', nameRect.top + (nameRect.height / 2) - containerRect.top);
    } else {
        line.setAttribute('x1', targetRect.left + (targetRect.width / 2) - containerRect.left);
        line.setAttribute('y1', targetRect.bottom - containerRect.top);
        line.setAttribute('x2', nameRect.left + (nameRect.width / 2) - containerRect.left);
        line.setAttribute('y2', nameRect.top - containerRect.top);
    }

    svg.appendChild(line);
}

function removeConnection(soundIndex, name) {
    const lines = document.querySelectorAll(`line[id*="${soundIndex}-"]`);
    lines.forEach(line => {
        if (line.id.endsWith(`-${name}-line`)) {
            line.parentNode.removeChild(line);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializePuzzle();
});
