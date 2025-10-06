const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const form = modal.querySelector("form");
const modalTitle = modal.querySelector(".modal-title");
let editMode = false;
let currentUserId = null;

openBtn.addEventListener("click", () => {
    modal.classList.add("open");
    modalTitle.textContent = "Add Item";
    form.action = "/shop";
    form.reset();
    editMode = false;
    currentUserId = null;
    form.email.removeAttribute("readonly");
    document.querySelector(".submit-btn").style.display = "inline-block";
    document.getElementById("edit-btn").style.display = "none";
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("open");
    }
});

// Mostrar mensajes en el pop-up
function showMessage(msg, isError = false) {
    const msgDiv = document.getElementById("form-message");
    msgDiv.textContent = msg;
    msgDiv.style.display = "block";
    msgDiv.style.color = isError ? "red" : "green";
    setTimeout(() => { msgDiv.style.display = "none"; }, 3000);
}

// Abrir modal en modo edición al hacer clic en 'Manage'
document.querySelectorAll(".manage-user-btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
        const row = e.target.closest("tr");
        const userId = row.getAttribute("data-id");
        // Obtener datos del usuario por AJAX
        fetch(`/users/${userId}`)
            .then(res => res.json())
            .then(user => {
                form.name.value = user.name;
                form.email.value = user.email;
                form.gender.value = user.gender;
                form.dateOfBirth.value = user.dateOfBirth ? user.dateOfBirth.slice(0,10) : "";
                modalTitle.textContent = "Edit User";
                form.action = `/users/edit/${userId}`;
                modal.classList.add("open");
                editMode = true;
                currentUserId = userId;
                form.email.removeAttribute("readonly");
                document.querySelector(".submit-btn").style.display = "none";
                document.getElementById("edit-btn").style.display = "inline-block";
            })
            .catch(() => {
                showMessage("Error loading user data", true);
            });
    });
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const csrfToken = form.querySelector('input[name="_csrf"]').value;
    
    // Remover el token del FormData (se enviará en header)
    formData.delete('_csrf');
    
    try {
        const response = await fetch('/shop', {
            method: 'POST',
            headers: {
                'CSRF-Token': csrfToken  // Token en header
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Item agregado exitosamente');
            modal.classList.remove("open");
            window.location.href = result.redirect; // redirige al /shop
        } else {
            alert('Error: ' + result.msg);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar el item');
    }
});
// --- Búsqueda de usuarios ---
const searchInput = document.getElementById("searchInput");
const usersTableBody = document.getElementById("usersTableBody");
const noUserFoundMsg = document.getElementById("noUserFoundMsg");

function filterUsers() {
    const searchValue = searchInput.value.trim().toLowerCase();
    let found = false;
    const rows = usersTableBody.querySelectorAll("tr.user-row");
    rows.forEach(row => {
        const id = row.getAttribute("data-id").toLowerCase();
        const name = row.getAttribute("data-name").toLowerCase();
        if (
            searchValue === "" ||
            id.includes(searchValue) ||
            name.includes(searchValue)
        ) {
            row.style.display = "";
            found = true;
        } else {
            row.style.display = "none";
        }
    });
    // Ocultar/mostrar mensaje de no encontrado
    if (!found) {
        noUserFoundMsg.style.display = "block";
    } else {
        noUserFoundMsg.style.display = "none";
    }
    // Ocultar la fila de "No hay usuarios registrados" si hay búsqueda
    const noUsersRow = usersTableBody.querySelector("tr.no-users-row");
    if (noUsersRow) {
        noUsersRow.style.display = searchValue === "" ? "" : "none";
    }
}

searchInput.addEventListener("input", filterUsers);