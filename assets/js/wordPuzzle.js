import { sounds } from '../js/sounds.js';

document.addEventListener('DOMContentLoaded', () => {
    const words = {
        1: "sayur",
        2: "mayur",
        3: "muyur",
    };

    const hints = {
        1: "hijau",
        2: "setelah sayur",
        3: "setelah sayur",
    };

    let currentWordIndex = 1;

    function initializePuzzle() {
        const word = words[currentWordIndex];
        const hint = hints[currentWordIndex];
        const shuffledChars = shuffleArray(word.split(''));
        const wordContainer = document.getElementById('word-container');
        const charContainer = document.getElementById('char-container');
        const hintMessage = document.getElementById('hint-message');
        const completionMessage = document.getElementById('completion-message');
        const nextButton = document.getElementById('next-button');

        wordContainer.innerHTML = '';
        charContainer.innerHTML = '';
        hintMessage.textContent = `Hint: ${hint}`;
        completionMessage.textContent = '';
        completionMessage.className = 'completion-message';
        nextButton.style.display = 'none';

        word.split('').forEach(() => {
            const dropBox = document.createElement('div');
            dropBox.classList.add('drop-box');
            dropBox.setAttribute('draggable', true);
            dropBox.addEventListener('dragover', (event) => event.preventDefault());
            dropBox.addEventListener('dragstart', handleDragStartWithinWordContainer);
            dropBox.addEventListener('drop', handleDrop);
            wordContainer.appendChild(dropBox);
        });

        shuffledChars.forEach((char) => {
            const charBox = document.createElement('div');
            charBox.classList.add('char-box');
            charBox.textContent = char;
            charBox.setAttribute('draggable', true);
            charBox.addEventListener('dragstart', handleDragStart);
            charBox.addEventListener('dragend', handleDragEnd);
            charContainer.appendChild(charBox);
        });
    }

    function handleDragStartWithinWordContainer(event) {
        const draggedChar = event.target.textContent;
        event.dataTransfer.setData('text/plain', draggedChar);
        event.dataTransfer.setData('source', event.target.parentElement.id);
    }

    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.textContent);
        event.dataTransfer.setData('source', event.target.parentElement.id);
        setTimeout(() => {
            event.target.classList.add('hide');
        }, 0);
    }

    function handleDragEnd(event) {
        event.target.classList.remove('hide');
    }

    function handleDrop(event) {
        event.preventDefault();
        const draggedChar = event.dataTransfer.getData('text/plain');
        const source = event.dataTransfer.getData('source');

        console.log(source);

        if (event.target.classList.contains('drop-box')) {
            const existingChar = event.target.textContent;

            // Hapus huruf dari posisi asal jika sumbernya adalah word-container
            if (existingChar !== draggedChar) {
                if (source === 'word-container') {
                    const originalBox = Array.from(document.querySelectorAll('.drop-box')).find(box => box.textContent === draggedChar);
                    if (originalBox) originalBox.textContent = '';
                } else if (source === 'char-container') {
                    const charBox = document.querySelector(`.char-box.hide`);
                    if (charBox) charBox.remove();
                }

                // Hapus huruf dari kotak sebelumnya jika ada
                const dropBoxes = document.querySelectorAll('.drop-box');
                dropBoxes.forEach(box => {
                    if (box.textContent === '') {
                        box.classList.remove('filled');
                    }
                });

                // Tambahkan huruf ke posisi baru
                event.target.textContent = draggedChar;
                event.target.classList.add('filled');

                // Jika ada huruf sebelumnya di kotak target, kembalikan ke kontainer huruf
                if (existingChar) {
                    const charBox = document.createElement('div');
                    charBox.classList.add('char-box');
                    charBox.textContent = existingChar;
                    charBox.setAttribute('draggable', true);
                    charBox.addEventListener('dragstart', handleDragStart);
                    charBox.addEventListener('dragend', handleDragEnd);
                    document.getElementById('char-container').appendChild(charBox);
                }
            }

        }

        checkCompletion();
    }

    function checkCompletion() {
        const dropBoxes = document.querySelectorAll('.drop-box');
        const currentWord = Array.from(dropBoxes).map(box => box.textContent).join('');
        const isComplete = Array.from(dropBoxes).every(box => box.textContent !== '');
        const completionMessage = document.getElementById('completion-message');

        if (isComplete) {
            if (currentWord === words[currentWordIndex]) {
                sounds['sfx_celebrate_horn'].play();
                sounds['kobo'].play();
                completionMessage.textContent = 'Congratulations!';
                if (completionMessage.classList.contains('error')) {
                    completionMessage.classList.remove('error');
                }
                completionMessage.classList.add('success');
                document.getElementById('next-button').style.display = 'block';
                disableDragAndDrop();
            } else {
                sounds['sfx_windows_error'].play();
                completionMessage.textContent = 'Try Again!';
                if (completionMessage.classList.contains('success')) {
                    completionMessage.classList.remove('success');
                }
                completionMessage.classList.add('error');
                setTimeout(() => {
                    resetPuzzle();
                }, 1000);
            }
        }
    }

    function disableDragAndDrop() {
        const charBoxes = document.querySelectorAll('.char-box');
        const dropBoxes = document.querySelectorAll('.drop-box');
        charBoxes.forEach(box => box.setAttribute('draggable', false));
        dropBoxes.forEach(box => {
            box.removeEventListener('dragover', (event) => event.preventDefault());
            box.removeEventListener('drop', handleDrop);
        });
    }

    function resetPuzzle() {
        const charContainer = document.getElementById('char-container');
        const dropBoxes = document.querySelectorAll('.drop-box');

        dropBoxes.forEach(box => {
            if (box.textContent) {
                const charBox = document.createElement('div');
                charBox.classList.add('char-box');
                charBox.textContent = box.textContent;
                charBox.setAttribute('draggable', true);
                charBox.addEventListener('dragstart', handleDragStart);
                charBox.addEventListener('dragend', handleDragEnd);
                charContainer.appendChild(charBox);
                box.textContent = '';
                box.classList.remove('filled');
            }
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    window.nextPuzzle = function () {
        currentWordIndex++;
        if (currentWordIndex <= Object.keys(words).length) {
            initializePuzzle();
        } else {
            alert('Semua puzzle selesai!');
        }
    };

    initializePuzzle();
});
