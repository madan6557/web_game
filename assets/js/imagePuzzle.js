import { sounds } from '../js/sounds.js';
import { imagePuzzle } from '../js/puzzleAssets.js';

document.addEventListener("DOMContentLoaded", () => {
    const puzzleContainer = document.getElementById("puzzle-container");
    const completionMessage = document.getElementById("completion-message");
    const nextButton = document.getElementById("next-button");

    let currentPuzzleIndex = 0;
    let pieces = [];

    // Load the first puzzle pieces
    loadPuzzle(imagePuzzle.level0[currentPuzzleIndex]);

    let selectedPiece = null;

    puzzleContainer.addEventListener("click", (e) => {
        const target = e.target;

        if (target.classList.contains("puzzle-piece") && !puzzleContainer.classList.contains("completed")) {
            if (!selectedPiece) {
                selectedPiece = target;
                target.style.border = "2px solid red";
            } else {
                swapPieces(selectedPiece, target);
                selectedPiece.style.border = "1px solid #ccc";
                selectedPiece = null;
                checkPuzzleCompletion();
            }
        }
    });

    function loadPuzzle(puzzle) {
        puzzleContainer.innerHTML = ''; // Clear previous puzzle pieces
        pieces = []; // Reset the pieces array

        puzzle.piece.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Puzzle Piece ${index + 1}`;
            img.className = 'puzzle-piece';
            img.id = `piece-${index + 1}`;
            pieces.push(img);
            puzzleContainer.appendChild(img);
        });

        // Shuffle pieces randomly
        const shuffledPieces = Array.from(pieces).sort(() => Math.random() - 0.5);

        // Append shuffled pieces to the container
        shuffledPieces.forEach(piece => puzzleContainer.appendChild(piece));

        // Reset state
        completionMessage.innerText = '';
        nextButton.style.display = 'none';
        puzzleContainer.classList.remove('completed');
    }

    function swapPieces(piece1, piece2) {
        const temp = document.createElement("div");
        piece1.parentNode.insertBefore(temp, piece1);
        piece2.parentNode.insertBefore(piece1, piece2);
        temp.parentNode.insertBefore(piece2, temp);
        temp.parentNode.removeChild(temp);
    }

    function checkPuzzleCompletion() {
        const currentPieces = Array.from(puzzleContainer.children);
        let isCorrect = true;

        for (let i = 0; i < currentPieces.length; i++) {
            const pieceId = currentPieces[i].id;
            const correctId = `piece-${i + 1}`;
            if (pieceId !== correctId) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            sounds['sfx_celebrate_horn'].play();
            sounds['kobo'].play();
            completionMessage.innerText = "Congratulation!";
            nextButton.style.display = "inline-block";
            puzzleContainer.classList.add("completed");
            pieces.forEach(piece => piece.classList.add("completed"));
        }
    }

    window.nextPuzzle = function() {
        currentPuzzleIndex++;
        if (currentPuzzleIndex < imagePuzzle.level0.length) {
            loadPuzzle(imagePuzzle.level0[currentPuzzleIndex]);
        } else {
            alert("No more puzzles available.");
        }
    }
});
