const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const form = document.getElementById("quizForm");
const questionTypeSelect = document.getElementById("questionType");
const optionsContainer = document.getElementById("optionsContainer");
const questionInput = document.getElementById("questionText");

// Modal control
openBtn.addEventListener("click", () => {
    console.log("Botón Add clickeado");
    modal.classList.add("open");
    initializeQuestionType();
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("open");
    }
});

// Question type handling
function initializeQuestionType() {
    updateOptionsContainer(questionTypeSelect.value);
    questionTypeSelect.addEventListener('change', (e) => {
        updateOptionsContainer(e.target.value);
    });
}

function updateOptionsContainer(selectedType) {
    optionsContainer.innerHTML = '';

    switch(selectedType) {
        case 'Multiple Choice':
            optionsContainer.innerHTML = `
                <div class="option-input-group">
                    <input type="radio" name="correct_answer" value="Option 1" required>
                    <input type="text" placeholder="Option 1" class="smallInput option-text" value="Option 1" required>
                    <button type="button" class="remove-option">×</button>
                </div>
                <div class="option-input-group">
                    <input type="radio" name="correct_answer" value="Option 2" required>
                    <input type="text" placeholder="Option 2" class="smallInput option-text" value="Option 2" required>
                    <button type="button" class="remove-option">×</button>
                </div>
                <button type="button" class="add-option-btn">+ Add Option</button>
            `;
            setupMultipleChoiceHandlers();
            break;

        case 'True/False':
            optionsContainer.innerHTML = `
                <div class="option-input-group">
                    <input type="radio" name="correct_answer" value="true" required>
                    <label>True</label>
                </div>
                <div class="option-input-group">
                    <input type="radio" name="correct_answer" value="false" required>
                    <label>False</label>
                </div>
            `;
            break;
    }
}

function setupMultipleChoiceHandlers() {
    const addOptionBtn = document.querySelector('.add-option-btn');
    if (addOptionBtn) {
        addOptionBtn.addEventListener('click', addNewOption);
    }
    setupRemoveOptionListeners();
    setupOptionTextHandlers();
}

function addNewOption() {
    const optionCount = optionsContainer.querySelectorAll('.option-input-group').length;
    const newOptionNumber = optionCount + 1;

    const newOption = document.createElement('div');
    newOption.className = 'option-input-group';
    newOption.innerHTML = `
        <input type="radio" name="correct_answer" value="Option ${newOptionNumber}" required>
        <input type="text" placeholder="Option ${newOptionNumber}" class="smallInput option-text" value="Option ${newOptionNumber}" required>
        <button type="button" class="remove-option">×</button>
    `;
    const addOptionBtn = optionsContainer.querySelector('.add-option-btn');
    optionsContainer.insertBefore(newOption, addOptionBtn);
    setupRemoveOptionListeners();
    setupOptionTextHandlers();
}

function setupRemoveOptionListeners() {
    const removeButtons = optionsContainer.querySelectorAll('.remove-option');
    removeButtons.forEach(button => {
        button.removeEventListener('click', handleRemoveOption);
        button.addEventListener('click', handleRemoveOption);
    });
}

function setupOptionTextHandlers() {
    const optionTexts = optionsContainer.querySelectorAll('.option-text');
    optionTexts.forEach((input, index) => {
        input.addEventListener('input', function() {
            const radio = this.previousElementSibling;
            radio.value = this.value;
        });
    });
}

function handleRemoveOption(event) {
    const optionsCount = optionsContainer.querySelectorAll('.option-input-group').length;
    if (optionsCount > 2) {
        event.target.closest('.option-input-group').remove();
    } else {
        alert('Must have at least 2 options');
    }
}

// Función para obtener la respuesta correcta seleccionada
function getCorrectAnswer() {
    const selectedRadio = optionsContainer.querySelector('input[name="correct_answer"]:checked');
    return selectedRadio ? selectedRadio.value : null;
}

// Función para obtener todas las preguntas y respuestas del formulario
function getQuestionsData() {
    const questionText = questionInput.value.trim();
    const questionType = questionTypeSelect.value;
    const correctAnswer = getCorrectAnswer();

    if (!questionText || !correctAnswer) {
        return null;
    }

    return [{
        question: questionText,
        answer: correctAnswer
    }];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeQuestionType();
});

// Update un sólo event listener
let isEditing = false;
let currentQuizId = null;

// Add click handler for manage buttons
document.querySelectorAll('.manage-button').forEach(button => {
    button.addEventListener('click', async (e) => {
        const row = e.target.closest('tr');
        const quizId = row.cells[0].textContent;
        currentQuizId = quizId;
        isEditing = true;
        
        try {
            const response = await fetch(`/quizzes/${quizId}`);
            const data = await response.json();
            
            if (data.success) {
                fillFormWithQuizData(data.quiz);
                modal.classList.add("open");
                document.getElementById('add-edit-btn').textContent = 'Update';
                document.getElementById('id-readonly-msg').style.display = 'block';
                document.querySelector('.modal-title').textContent = 'Edit Quiz'; // Añadir esta línea
            }
        } catch (error) {
            console.error('Error fetching quiz details:', error);
            alert('Error fetching quiz details');
        }
    });
});

function fillFormWithQuizData(quiz) {
    document.getElementById('category').value = quiz.category;
    document.getElementById('description').value = quiz.description;
    document.getElementById('experience').value = quiz.experience;
    document.getElementById('available').value = quiz.available;

    // Limpiar el contenedor de preguntas guardadas
    const savedQuestionsContainer = document.getElementById('savedQuestionsContainer');
    savedQuestionsContainer.innerHTML = '';

    // Mostrar las preguntas existentes
    if (quiz.questions && quiz.questions.length > 0) {
        quiz.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'saved-question';
            questionDiv.innerHTML = `
                <div class="question-header">
                    <h4>Question ${index + 1}</h4>
                    <button type="button" class="remove-question" onclick="removeQuestion(this)">×</button>
                </div>
                <p><strong>Question:</strong> ${question.question}</p>
                <p><strong>Answer:</strong> ${question.answer}</p>
            `;
            savedQuestionsContainer.appendChild(questionDiv);
        });
        questionCounter = quiz.questions.length;
    }

    // Limpiar el formulario de nueva pregunta
    document.getElementById('questionText').value = '';
    document.getElementById('questionType').value = 'Multiple Choice';
    updateOptionsContainer('Multiple Choice');
}

// Modificar addQuestionBtn event listener
addQuestionBtn.addEventListener('click', () => {
    const questionData = getQuestionsData();
    if (!questionData || !questionData[0]) {
        alert('Please fill in the current question before adding a new one');
        return;
    }

    // Guardar la pregunta en el contenedor de preguntas guardadas
    const savedQuestionsContainer = document.getElementById('savedQuestionsContainer');
    const questionDiv = document.createElement('div');
    questionDiv.className = 'saved-question';
    questionDiv.innerHTML = `
        <div class="question-header">
            <h4>Question ${questionCounter + 1}</h4>
            <button type="button" class="remove-question" onclick="removeQuestion(this)">×</button>
        </div>
        <p><strong>Question:</strong> ${questionData[0].question}</p>
        <p><strong>Answer:</strong> ${questionData[0].answer}</p>
    `;
    savedQuestionsContainer.appendChild(questionDiv);
    questionCounter++;

    // Limpiar el formulario para la siguiente pregunta
    document.getElementById('questionText').value = '';
    const optionInputs = document.querySelectorAll('.option-text');
    optionInputs.forEach(input => input.value = '');
    const radios = document.querySelectorAll('input[name="correct_answer"]');
    radios.forEach(radio => radio.checked = false);
});

// Agregar función para remover preguntas
function removeQuestion(button) {
    const questionDiv = button.closest('.saved-question');
    questionDiv.remove();
    // Actualizar los números de las preguntas restantes
    const questions = document.querySelectorAll('.saved-question');
    questions.forEach((q, index) => {
        q.querySelector('h4').textContent = `Question ${index + 1}`;
    });
    questionCounter--;
}

// Modificar getAllQuestionsData para incluir las preguntas guardadas
function getAllQuestionsData() {
    const questions = [];
    
    // Obtener preguntas guardadas
    document.querySelectorAll('.saved-question').forEach(questionDiv => {
        const questionText = questionDiv.querySelector('p:nth-child(2)').textContent.replace('Question: ', '');
        const answer = questionDiv.querySelector('p:nth-child(3)').textContent.replace('Answer: ', '');
        questions.push({ question: questionText, answer: answer });
    });

    // Obtener pregunta actual si está completa
    const currentQuestion = getQuestionsData();
    if (currentQuestion && currentQuestion[0]) {
        questions.push(currentQuestion[0]);
    }

    return questions;
}

// Modificar el event listener del formulario
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const questionsData = getAllQuestionsData();
    if (questionsData.length === 0) {
        alert("Please add at least one question");
        return;
    }

    const formData = new FormData(form);
    const data = {
        category: formData.get('category'),
        description: formData.get('description'),
        experience: parseInt(formData.get('experience')),
        available: parseInt(formData.get('available')),
        questions: questionsData
    };

    const url = isEditing ? `/quizzes/${currentQuizId}` : '/quizzes';
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': formData.get('_csrf')
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            modal.classList.remove("open");
            form.reset();
            location.reload();
        } else {
            alert(isEditing ? "Error updating quiz: " : "Error creating quiz: " + data.message);
        }
    })
    .catch(error => {
        alert("Error: " + error.message);
        console.error(error);
    });
});

// Reset form state when opening modal for new quiz
openBtn.addEventListener("click", () => {
    isEditing = false;
    currentQuizId = null;
    form.reset();
    document.getElementById('add-edit-btn').textContent = 'Add';
    document.getElementById('delete-btn').style.display = 'none';
    document.getElementById('id-readonly-msg').style.display = 'none';
    document.querySelector('.modal-title').textContent = 'Add New Quiz'; // Añadir esta línea
});
