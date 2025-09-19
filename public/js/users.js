const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

openBtn.addEventListener("click", () => {
    modal.classList.add("open");
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("open");
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