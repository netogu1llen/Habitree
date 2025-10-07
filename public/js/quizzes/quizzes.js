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

// Form submission
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const questionsData = getQuestionsData();
    if (!questionsData) {
        alert("Please fill in all question fields and select a correct answer");
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

    fetch('/quizzes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': formData.get('_csrf')
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Cerrar modal
                modal.classList.remove("open");
                // Recargar página
                setTimeout(() => {
                    location.reload();
                }, 1000);

            } else {
                alert("Error creating quiz: " + data.message);
            }
        })
        .catch(error => {
            alert(" Error creating quiz: " + error.message);
            console.error(error);
        });
});

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

    if (quiz.questions && quiz.questions.length > 0) {
        const firstQuestion = quiz.questions[0];
        document.getElementById('questionText').value = firstQuestion.question;
        
        // Handle answer options based on the first question
        const isMultipleChoice = firstQuestion.answer.includes('Option');
        questionTypeSelect.value = isMultipleChoice ? 'Multiple Choice' : 'True/False';
        updateOptionsContainer(questionTypeSelect.value);
        
        if (isMultipleChoice) {
            const options = firstQuestion.answer.split(',');
            options.forEach((option, index) => {
                if (index >= 2) addNewOption();
            });
            
            const optionInputs = document.querySelectorAll('.option-text');
            options.forEach((option, index) => {
                if (optionInputs[index]) {
                    optionInputs[index].value = option.trim();
                    const radio = optionInputs[index].previousElementSibling;
                    radio.value = option.trim();
                }
            });
        }
    }
}

// Modify the form submit handler
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const questionsData = getQuestionsData();
    if (!questionsData) {
        alert("Please fill in all question fields and select a correct answer");
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
});
