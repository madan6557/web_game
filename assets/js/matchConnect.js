const sounds = {
    marin: new Audio('/assets/audio/marin.mp3'),
    kobo: new Audio('/assets/audio/kobo.mp3'),
    gura: new Audio('/assets/audio/gura.mp3'),
    lily: new Audio('/assets/audio/lily.mp3'),
    ninomae: new Audio('/assets/audio/ninomae.mp3'),
};

let selectedSound = null;
let selectedColor = null;
const matches = {};
const colors = {};
const reverseMatches = {};

// Initialize button colors
document.querySelectorAll('.sound-btn').forEach(button => {
    const color = button.getAttribute('data-color');
    button.style.backgroundColor = color;
});

// Handle sound button clicks
document.querySelectorAll('.sound-btn').forEach(button => {
    button.addEventListener('click', () => {
        const sound = button.getAttribute('data-sound');
        selectedSound = sound;
        selectedColor = button.getAttribute('data-color');
        sounds[sound].play();
        resetSoundColors();
        button.style.backgroundColor = selectedColor; // Highlight selected sound button
    });
});

// Handle name button clicks
document.querySelectorAll('.name-btn').forEach(button => {
    button.addEventListener('click', () => {
        if (selectedSound) {
            const name = button.getAttribute('data-name');

            // Unselect previous name if the sound is already matched with another name
            if (reverseMatches[selectedSound]) {
                const prevName = reverseMatches[selectedSound];
                document.querySelector(`.name-btn[data-name="${prevName}"]`).style.backgroundColor = '#008CBA'; // Reset color
                delete matches[prevName];
                removeConnection(selectedSound, prevName); // Hapus koneksi sebelumnya
                delete reverseMatches[selectedSound]; // Hapus referensi ke nama sebelumnya
            }

            matches[name] = selectedSound;
            reverseMatches[selectedSound] = name;
            colors[name] = selectedColor;
            button.style.backgroundColor = selectedColor; // Match the color of the name button
            drawConnection(selectedSound, name, selectedColor);
            selectedSound = null;
            selectedColor = null;
        } else {
            document.getElementById('result').textContent = 'Pilih suara dulu.';
        }
    });
});

// Handle submit button click
document.getElementById('submit-btn').addEventListener('click', () => {
    let correctMatches = 0;
    document.querySelectorAll('.name-btn').forEach(button => {
        const name = button.getAttribute('data-name');
        if (matches[name] === name) {
            correctMatches++;
        }
    });
    document.getElementById('result').textContent = `Jawaban yang benar: ${correctMatches} dari 5.`;
});

// Reset only the sound button colors
function resetSoundColors() {
    document.querySelectorAll('.sound-btn').forEach(button => {
        button.style.backgroundColor = button.getAttribute('data-color'); // Reset color
    });
}

// Ensure name button colors persist on page load and after each match
document.querySelectorAll('.name-btn').forEach(button => {
    const name = button.getAttribute('data-name');
    if (colors[name]) {
        button.style.backgroundColor = colors[name];
    }
});

// Draw a connection between a sound button and a name button
function drawConnection(sound, name, color) {
    const soundButton = document.querySelector(`.sound-btn[data-sound="${sound}"]`);
    const nameButton = document.querySelector(`.name-btn[data-name="${name}"]`);
    // const circle = document.getElementById(`circle${soundButton.id.slice(-1)}`);
    const svg = document.getElementById('connections');
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const soundRect = soundButton.getBoundingClientRect();
    const nameRect = nameButton.getBoundingClientRect();

    const lineID = `${sound}-${name}-line`; // ID based on sound and name pair

    // Hapus koneksi sebelumnya jika ada
    const prevSound = reverseMatches[name];
    if (prevSound && prevSound !== sound) { // Pastikan suara sebelumnya bukan sama dengan suara yang baru dipasangkan
        removeConnection(prevSound, name);
    }

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('id', lineID);
    line.setAttribute('x1', soundRect.right - containerRect.left);
    line.setAttribute('y1', soundRect.top + (soundRect.height / 2) - containerRect.top);
    line.setAttribute('x2', nameRect.left - containerRect.left);
    line.setAttribute('y2', nameRect.top + (nameRect.height / 2) - containerRect.top);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '2');

    svg.appendChild(line);

}

// Remove a connection between a sound button and a name button
function removeConnection(sound, name) {
    const lines = document.querySelectorAll(`line[id*="${sound}-"]`);
    lines.forEach(line => {
        if (line.id.endsWith(`-${name}-line`)) {
            line.parentNode.removeChild(line);
        }
    });
}
