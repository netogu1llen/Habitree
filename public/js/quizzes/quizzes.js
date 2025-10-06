const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const form = document.getElementById("quizForm");
const questionTypeSelect = document.getElementById("questionType");
const optionsContainer = document.getElementById("optionsContainer");
const questionInput = document.getElementById("questionText");

const manageModal = document.getElementById("manageModal");
const closeManageBtn = document.getElementById("closeManageModal");
const manageEditBtn = document.getElementById("manage-edit-btn");
const manageDeleteBtn = document.getElementById("manage-delete-btn");

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

    // Mostrar mensaje de "cargando"
    alert("Creating quiz... Please wait");

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
                // Mensaje de éxito
                alert("Quiz created successfully!");

                // Cerrar modal
                modal.classList.remove("open");

                // Limpiar formulario
                form.reset();

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

// Modal con 2 botones Edit Delete
let currentQuizId = null;

const manageButtons = document.querySelectorAll(".manage-button");

// Abrir modal en modo edición
manageButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        currentQuizId = row.querySelector("td:first-child").textContent;

        // Abrir modal de Manage
        manageModal.classList.add("open");
    });
});

closeManageBtn.addEventListener("click", () => {
    manageModal.classList.remove("open");
});

// Botón eliminar
manageDeleteBtn.addEventListener("click", () => {
    if (!currentQuizId) return;

    if (confirm("Are you sure you want to delete this quiz?")) {
        fetch(`/quizzes/${currentQuizId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": document.querySelector('input[name="_csrf"]').value
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    if (data.message.includes("desactivado")) {
                        alert("This quiz cannot be deleted because it's already used, but it has been disabled.");
                    } else {
                        alert("Quiz deleted successfully!");
                    }
                    manageModal.classList.remove("open");
                    setTimeout(() => location.reload(), 1000);
                } else {
                    if (data.message.includes("inactive") || data.message.includes("deleted")) {
                        alert("This quiz was already deleted previously.");
                    } else {
                        alert("Error deleting quiz: " + data.message);
                    }
                }
                manageModal.classList.remove("open");
                setTimeout(() => location.reload(), 1000);
            })
            .catch(err => {
                alert("Error deleting quiz: " + err.message);
                console.error(err);
            });
    }
});


manageEditBtn.addEventListener("click", () => {
    alert("Edit clicked for quiz ID: " + currentQuizId);

});

