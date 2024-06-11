import { sounds } from './sounds.js';
import { multipleChoice } from '../js/puzzleAssets.js';

let currentQuestionIndex = 0;
let correctAnswers = 0;
let selectedAnswerIndex = null;
let questions = multipleChoice.level0; // Menggunakan data dari multipleChoice

function loadQuestion() {
    const questionElement = document.getElementById('question-text');
    const quizContainer = document.getElementById('quiz-container');
    const nextButton = document.getElementById('next-button');
    const completionMessage = document.getElementById('completion-message');

    completionMessage.innerHTML = '';
    nextButton.style.display = 'none';
    quizContainer.innerHTML = '';
    questionElement.innerText = '';

    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.innerText = currentQuestion.question;

        currentQuestion.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.innerText = choice;
            button.onclick = () => selectAnswer(button, index);
            quizContainer.appendChild(button);
        });
    } else {
        showCompletionMessage();
    }
}

function selectAnswer(button, index) {
    // Remove 'selected' class from all buttons
    const buttons = document.querySelectorAll('.quiz-container button');
    buttons.forEach(btn => btn.classList.remove('selected'));

    // Add 'selected' class to the clicked button
    button.classList.add('selected');

    selectedAnswerIndex = index;
    document.getElementById('next-button').style.display = 'block';
}

function checkAnswer() {
    const currentQuestion = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.quiz-container button');
    const completionMessage = document.getElementById('completion-message');
    document.getElementById('next-button').style.display = 'none';

    buttons.forEach((button, index) => {
        if (index === currentQuestion.correctAnswer) {
            button.classList.add('correct');
        }
        if (index === selectedAnswerIndex && index !== currentQuestion.correctAnswer) {
            button.classList.add('incorrect');
        }
    });

    if (selectedAnswerIndex === currentQuestion.correctAnswer) {
        correctAnswers++;
        sounds['gura'].play();
        completionMessage.innerHTML = '<p style="color: green;">Jawaban benar!</p>';
    } else {
        sounds['ninomae'].play();
        completionMessage.innerHTML = '<p style="color: red;">Jawaban salah!</p>';
    }

    setTimeout(() => {
        currentQuestionIndex++;
        selectedAnswerIndex = null;
        loadQuestion();
    }, 2000);
}

function showCompletionMessage() {
    sounds['sfx_celebrate_horn'].play();
    sounds['kobo'].play();
    const completionMessage = document.getElementById('completion-message');
    completionMessage.innerHTML = `Kuis selesai! Anda menjawab benar ${correctAnswers} dari ${questions.length} pertanyaan.`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
});

window.nextQuestion = checkAnswer;
