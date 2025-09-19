const openBtn = document.querySelector(".add-button");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const form = modal.querySelector("form");
const modalTitle = modal.querySelector(".modal-title");
let editMode = false;
let currentQuizId = null;

openBtn.addEventListener("click", () => {
    modal.style.display = "block";
    modalTitle.textContent = "Add Quiz";
    form.action = "/quizzes";
    form.reset();
    editMode = false;
    currentQuizId = null;
    form.IDQuiz.removeAttribute("readonly");
    document.getElementById("id-readonly-msg").style.display = "none";
    document.getElementById("delete-btn").style.display = "none";
    document.getElementById("add-edit-btn").textContent = "Add";
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

document.querySelectorAll(".manage-button").forEach(btn => {
    btn.addEventListener("click", function(e) {
        const row = e.target.closest("tr");
        const cells = row.querySelectorAll("td");
        const quizId = cells[0].textContent;
        
        fetch(`/quizzes/${quizId}`)
            .then(res => res.json())
            .then(quiz => {
                form.IDQuiz.value = quiz.IDQuiz;
                form.category.value = quiz.category;
                form.description.value = quiz.description;
                form.available.value = quiz.available;
                form.experience.value = quiz.experience;
                modalTitle.textContent = "Edit Quiz";
                form.action = `/quizzes/edit/${quiz.IDQuiz}`;
                modal.style.display = "block";
                editMode = true;
                currentQuizId = quiz.IDQuiz;
                form.IDQuiz.setAttribute("readonly", true);
                document.getElementById("id-readonly-msg").style.display = "inline";
                document.getElementById("delete-btn").style.display = "inline-block";
                document.getElementById("add-edit-btn").textContent = "Edit";
            })
            .catch(() => {
                showMessage("Error loading quiz data", true);
            });
    });
});

form.addEventListener("submit", function(e) {
    if (editMode) {
        e.preventDefault();
        const data = {
            category: form.category.value,
            description: form.description.value,
            available: form.available.value,
            experience: form.experience.value
        };
        fetch(`/quizzes/edit/${currentQuizId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": form._csrf.value
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showMessage(result.message);
                setTimeout(() => { window.location.reload(); }, 1200);
            } else {
                showMessage(result.message, true);
            }
        })
        .catch(() => {
            showMessage("Error updating quiz", true);
        });
    }
});

document.getElementById('delete-btn').addEventListener('click', function() {
    if (confirm('Are you sure you want to delete this quiz?')) {
        fetch(`/quizzes/${currentQuizId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': form._csrf.value
            }
        })
        .then(res => res.json())
        .then(data => {
            showMessage(data.message || 'Quiz deleted');
            setTimeout(() => { window.location.reload(); }, 1200);
        })
        .catch(err => {
            showMessage('Error deleting quiz', true);
            console.error(err);
        });
    }
});

function showMessage(msg, isError = false) {
    const msgDiv = document.getElementById("form-message");
    msgDiv.textContent = msg;
    msgDiv.style.display = "block";
    msgDiv.style.color = isError ? "red" : "green";
    setTimeout(() => { msgDiv.style.display = "none"; }, 3000);
}
