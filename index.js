document.addEventListener('DOMContentLoaded', () => {
    const difficultySelect = document.getElementById('difficulty');
    const typeSelect = document.getElementById('type');
    const categorySelect = document.getElementById('category');
    const createTriviaButton = document.getElementById('create-trivia');
    const newTriviaButton = document.getElementById('new-trivia');
    const quizContainer = document.getElementById('quiz');
    const questionsContainer = document.getElementById('questions');
    const checkAnswersButton = document.getElementById('check-answers');
    const scoreContainer = document.getElementById('score');
    const finalScoreContainer = document.getElementById('final-score');
    const newGameButton = document.getElementById('new-game');

    // Definir opciones de dificultad
    const difficultyOptions = ['easy', 'medium', 'hard'];

    // Obtener opciones de categoría de la API y llenar el select
    async function fillCategoryOptions() {
        const categoryOptions = await fetchCategoryOptions();
        categoryOptions.forEach(option => {
            const categoryOption = document.createElement('option');
            categoryOption.value = option.id;
            categoryOption.textContent = option.name;
            categorySelect.appendChild(categoryOption);
        });
    }

    // Obtener opciones de categoría de la API
    async function fetchCategoryOptions() {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        return data.trivia_categories.map(category => ({ id: category.id, name: category.name }));
    }

    // Llenar el formulario con las opciones definidas
    function fillFormOptions() {
        difficultyOptions.forEach(option => {
            const difficultyOption = document.createElement('option');
            difficultyOption.value = option;
            difficultyOption.textContent = option.charAt(0).toUpperCase() + option.slice(1);
            difficultySelect.appendChild(difficultyOption);
        });
    }

    fillFormOptions();
    fillCategoryOptions(); // Llenar las opciones de categoría al cargar la página

    // Crear Trivia
    createTriviaButton.addEventListener('click', async () => {
        const difficulty = difficultySelect.value;
        const type = typeSelect.value;
        const category = categorySelect.value;

        const response = await fetch(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=${type}&category=${category}`);
        const data = await response.json();

        displayQuestions(data.results);
    });

    // Mostrar preguntas y opciones de respuesta
    function displayQuestions(questions) {
        questionsContainer.innerHTML = '';
    
        questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <p>${index + 1}. ${question.question}</p>
                <ul>
                    ${question.incorrect_answers.map(answer => `<li><input type="radio" name="question${index}" value="${answer}">${answer}</li>`).join('')}
                    <li><input type="radio" name="question${index}" value="${question.correct_answer}" data-correct="${question.correct_answer}">${question.correct_answer}</li>
                </ul>
            `;
            questionsContainer.appendChild(questionElement);
        });
    
        quizContainer.style.display = 'block';
    }
    
    // Comprobar respuestas
checkAnswersButton.addEventListener('click', () => {
    const selectedAnswers = questionsContainer.querySelectorAll('input:checked');

    let score = 0;

    selectedAnswers.forEach(selected => {
        const correctAnswer = selected.getAttribute('data-correct');
        if (selected.value === correctAnswer) {
            score += 1;
        }
    });

    const finalScore = score * 100;
    let message;
    if (finalScore >= 1000) {
        message = `¡Tu puntaje final es ${finalScore}/1000!`;
        Swal.fire({
            title: 'Puntaje Final',
            text: message,
            icon: 'success',
            confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.isConfirmed) {
                // Ejecutar la función newGameButton al hacer clic en Ok
                newGameButtonFunction();
            }
        });
    } else {
        message = `¡Tu puntaje final es ${finalScore}/1000!`;
        Swal.fire({
            title: 'Puntaje Final',
            text: message,
            icon: 'error',
            confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.isConfirmed) {
                // Ejecutar la función newGameButton al hacer clic en Ok
                newGameButtonFunction();
            }
        });
    }
});

// Función para reiniciar el juego
function newGameButtonFunction() {
    difficultySelect.selectedIndex = 0;
    typeSelect.selectedIndex = 0;
    categorySelect.selectedIndex = 0;
    questionsContainer.innerHTML = '';
    quizContainer.style.display = 'none';
    scoreContainer.style.display = 'none';
}

});