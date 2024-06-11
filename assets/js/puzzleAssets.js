export const imagePuzzle = {
    level0: [
        {
            'piece': [
                "/assets/img/sora-puzzle-piece-1.jpg", 
                "/assets/img/sora-puzzle-piece-2.jpg", 
                "/assets/img/sora-puzzle-piece-3.jpg", 
                "/assets/img/sora-puzzle-piece-4.jpg", 
                "/assets/img/sora-puzzle-piece-5.jpg", 
                "/assets/img/sora-puzzle-piece-6.jpg", 
                "/assets/img/sora-puzzle-piece-7.jpg", 
                "/assets/img/sora-puzzle-piece-8.jpg", 
                "/assets/img/sora-puzzle-piece-9.jpg", 
            ],
        },
        {
            'piece': [
                "/assets/img/bahirian-puzzle-piece-1.jpg", 
                "/assets/img/bahirian-puzzle-piece-2.jpg", 
                "/assets/img/bahirian-puzzle-piece-3.jpg", 
                "/assets/img/bahirian-puzzle-piece-4.jpg", 
                "/assets/img/bahirian-puzzle-piece-5.jpg", 
                "/assets/img/bahirian-puzzle-piece-6.jpg", 
                "/assets/img/bahirian-puzzle-piece-7.jpg", 
                "/assets/img/bahirian-puzzle-piece-8.jpg", 
                "/assets/img/bahirian-puzzle-piece-9.jpg", 
            ],
        },
    ]
};

export const matchConect = {
    level0: [
        {
            'sounds': {
                marin: new Audio('/assets/audio/marin.mp3'),
                kobo: new Audio('/assets/audio/kobo.mp3'),
                gura: new Audio('/assets/audio/gura.mp3'),
                lily: new Audio('/assets/audio/lily.mp3'),
                ninomae: new Audio('/assets/audio/ninomae.mp3'),
            },
            'sound-name': ["marin", "kobo", "gura", "lily", "ninomae"],
            'label': ["Marin", "Kobo", "Gura", "Lily", "Ninomae"],
        },
    ]
};

export const multipleChoice = {
    level0: [
        {
            'question': "Apa ibu kota Indonesia?",
            'choices': ["Jakarta", "Bandung", "Surabaya", "Medan"],
            'correctAnswer': 0
        },
        {
            'question': "Siapa penemu bola lampu?",
            'choices': ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Albert Einstein"],
            'correctAnswer': 1
        }
    ]
};

export const wordPuzzle = {
    level0: [
        {
            'word': ["sayur", "mayur", "muyur"],
            'hint': ["hijau", "setelah sayur", "setelah sayur"]
        }
    ]
};

export const findWordPuzzle = {
    level0: [
        {
            words: ['HELLO', 'WORLD', 'CODE', 'JAVA', 'SCRIPT']
        },
        {
            words: ['PYTHON', 'HTML', 'CSS', 'GRID', 'WEB']
        }
    ]
};