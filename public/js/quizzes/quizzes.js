const openBtn = document.querySelector(".add-button");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const form = modal.querySelector("form");
const modalTitle = modal.querySelector(".modal-title");
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Modal control
openBtn.addEventListener("click", () => {
    modal.style.display = "block";
    initializeQuestionType();
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Question type handling
function initializeQuestionType() {
    const questionType = document.querySelector('.question-type');
    const optionsContainer = document.querySelector('.options-container');
    
    // Initial options based on default selection
    updateOptionsContainer(questionType.value);

    questionType.addEventListener('change', (e) => {
        updateOptionsContainer(e.target.value);
    });
}

function updateOptionsContainer(selectedType) {
    const optionsContainer = document.querySelector('.options-container');
    optionsContainer.innerHTML = '';

    switch(selectedType) {
        case 'Multiple Choice':
            optionsContainer.innerHTML = `
                <div class="option-input-group">
                    <input type="radio" name="correct_answer" required>
                    <input type="text" placeholder="Option 1" class="form-control" required>
                    <button type="button" class="remove-option">×</button>
                </div>
                <div class="option-input-group">
                    <input type="radio" name="correct_answer" required>
                    <input type="text" placeholder="Option 2" class="form-control" required>
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

        case 'Open Answer':
            optionsContainer.innerHTML = `
                <div class="option-input-group">
                    <textarea class="form-control" placeholder="Write the correct answer here" rows="3" required></textarea>
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
}

function addNewOption() {
    const optionsContainer = document.querySelector('.options-container');
    const newOption = document.createElement('div');
    newOption.className = 'option-input-group';
    newOption.innerHTML = `
        <input type="radio" name="correct_answer" required>
        <input type="text" placeholder="New option" class="form-control" required>
        <button type="button" class="remove-option">×</button>
    `;
    const addOptionBtn = optionsContainer.querySelector('.add-option-btn');
    optionsContainer.insertBefore(newOption, addOptionBtn);
    setupRemoveOptionListeners();
}

function setupRemoveOptionListeners() {
    const optionsContainer = document.querySelector('.options-container');
    const removeButtons = optionsContainer.querySelectorAll('.remove-option');
    
    removeButtons.forEach(button => {
        // Remover event listeners anteriores para evitar duplicados
        button.removeEventListener('click', handleRemoveOption);
        // Añadir nuevo event listener
        button.addEventListener('click', handleRemoveOption);
    });
}

function handleRemoveOption(event) {
    const optionsContainer = document.querySelector('.options-container');
    const optionsCount = optionsContainer.querySelectorAll('.option-input-group').length;
    
    if (optionsCount > 2) {
        event.target.closest('.option-input-group').remove();
    } else {
        alert('Must have at least 2 options');
    }
}

function updateOptionsContainer(selectedType) {
    const optionsContainer = document.querySelector('.options-container');
    optionsContainer.innerHTML = '';

    switch(selectedType) {
        case 'Multiple Choice':
            optionsContainer.innerHTML = `
                <div class="option-input-group">
                    <input type="radio" name="correct_answer" required>
                    <input type="text" placeholder="Option 1" class="form-control" required>
                    <button type="button" class="remove-option">×</button>
                </div>
                <div class="option-input-group">
                    <input type="radio" name="correct_answer" required>
                    <input type="text" placeholder="Option 2" class="form-control" required>
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

        case 'Open Answer':
            optionsContainer.innerHTML = `
                <div class="option-input-group">
                    <textarea class="form-control" placeholder="Write the correct answer here" rows="3" required></textarea>
                </div>
            `;
            break;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeQuestionType();
});
    msgDiv.textContent = msg;
    msgDiv.style.display = "block";
    msgDiv.style.color = isError ? "red" : "green";
    setTimeout(() => { msgDiv.style.display = "none"; }, 3000);

// Modificar el evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const questionType = document.querySelector('.question-type');
    if (!questionType) return;

    function updateOptionsContainer(selectedType) {
        const optionsContainer = questionType.closest('.question-container').querySelector('.options-container');
        if (!optionsContainer) return;

        optionsContainer.innerHTML = ''; // Limpiar opciones existentes

        switch(selectedType) {
            case 'Multiple Choice':
                optionsContainer.innerHTML = `
                    <div class="option-input-group">
                        <input type="radio" name="correct_answer" required>
                        <input type="text" placeholder="Option 1" class="form-control" required>
                        <button type="button" class="remove-option">×</button>
                    </div>
                    <div class="option-input-group">
                        <input type="radio" name="correct_answer" required>
                        <input type="text" placeholder="Option 2" class="form-control" required>
                        <button type="button" class="remove-option">×</button>
                    </div>
                    <button type="button" class="add-option-btn">+ Add Option</button>
                `;

                const addOptionBtn = optionsContainer.querySelector('.add-option-btn');
                if (addOptionBtn) {
                    addOptionBtn.addEventListener('click', () => {
                        const newOption = document.createElement('div');
                        newOption.className = 'option-input-group';
                        newOption.innerHTML = `
                            <input type="radio" name="correct_answer" required>
                            <input type="text" placeholder="New option" class="form-control" required>
                            <button type="button" class="remove-option">×</button>
                        `;
                        optionsContainer.insertBefore(newOption, addOptionBtn);
                        setupRemoveOptionListeners(optionsContainer);
                    });
                }
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

            case 'Open Answer':
                optionsContainer.innerHTML = `
                    <div class="option-input-group">
                        <textarea class="form-control" placeholder="Write the correct answer here" rows="3" required></textarea>
                    </div>
                `;
                break;
        }

        setupRemoveOptionListeners(optionsContainer);
    }

    // Event listener para el cambio de tipo de pregunta
    questionType.addEventListener('change', function(e) {
        updateOptionsContainer(e.target.value);
    });

    // Inicializar con el tipo seleccionado actualmente
    updateOptionsContainer(questionType.value);
});

function setupRemoveOptionListeners(container) {
    container.querySelectorAll('.remove-option').forEach(button => {
        button.addEventListener('click', function() {
            const optionsCount = container.querySelectorAll('.option-input-group').length;
            if (optionsCount > 2) {
                this.closest('.option-input-group').remove();
            }
        });
    });
}

form.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
        category: formData.get('category'),
        description: formData.get('description'),
        experience: formData.get('experience')
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
    .catch(error => {
        showMessage("Error creating quiz", true);
        console.error(error);
    });
});
