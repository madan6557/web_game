import { sounds } from '../js/sounds.js';

document.addEventListener("DOMContentLoaded", () => {
    const pieces = document.querySelectorAll(".puzzle-piece");
    const puzzleContainer = document.getElementById("puzzle-container");
    const completionMessage = document.getElementById("completion-message");
    const nextButton = document.getElementById("next-button");

    // Shuffle pieces randomly
    const shuffledPieces = Array.from(pieces).sort(() => Math.random() - 0.5);

    // Append shuffled pieces to the container
    shuffledPieces.forEach(piece => puzzleContainer.appendChild(piece));

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
});

function nextPuzzle() {
    // Add logic for loading the next puzzle
    alert("Next puzzle not implemented yet.");
}

window.nextPuzzle = nextPuzzle;
