//FUNCIÓN PARA CREAR POP UP

const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const form = modal.querySelector("form");
const modalTitle = modal.querySelector(".modal-title");
let editMode = false;
let currentMissionId = null;

openBtn.addEventListener("click", () => {
    modal.classList.add("open");
    modalTitle.textContent = "Add Mission";
    form.action = "/missions";
    form.reset();
    editMode = false;
    currentMissionId = null;
    form.IDMission.removeAttribute("readonly");
    document.getElementById("id-readonly-msg").style.display = "none";
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
});

// Cerrar al hacer clic fuera del modal
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("open");
    }
});

// Abrir pop-up en modo edición al hacer clic en el botón Manage
document.querySelectorAll(".table__button").forEach(btn => {
    btn.addEventListener("click", function(e) {
        const row = e.target.closest("tr");
        const cells = row.querySelectorAll("td");
        const missionId = cells[0].textContent;
        // Obtener datos actualizados desde el backend por AJAX
        fetch(`/missions/${missionId}`)
            .then(res => res.json())
            .then(mission => {
                form.IDMission.value = mission.IDMission;
                form.responseVerification.value = mission.responseVerification;
                form.category.value = mission.category;
                form.description.value = mission.description;
                form.available.value = mission.available;
                form.experience.value = mission.experience;
                modalTitle.textContent = "Edit Mission";
                form.action = `/missions/edit/${mission.IDMission}`;
                modal.classList.add("open");
                editMode = true;
                currentMissionId = mission.IDMission;
                form.IDMission.setAttribute("readonly", true);
                document.getElementById("id-readonly-msg").style.display = "inline";
            })
            .catch(() => {
                showMessage("Error loading mission data", true);
            });
    });
});

// Mostrar mensajes en el pop-up
function showMessage(msg, isError = false) {
    const msgDiv = document.getElementById("form-message");
    msgDiv.textContent = msg;
    msgDiv.style.display = "block";
    msgDiv.style.color = isError ? "red" : "green";
    setTimeout(() => { msgDiv.style.display = "none"; }, 3000);
}

// Interceptar el submit en modo edición para enviar por AJAX
form.addEventListener("submit", function(e) {
    if (editMode) {
        e.preventDefault();
        const data = {
            responseVerification: form.responseVerification.value,
            category: form.category.value,
            description: form.description.value,
            available: form.available.value,
            experience: form.experience.value
        };
        fetch(`/missions/edit/${currentMissionId}`, {
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
            showMessage("Error updating mission", true);
        });
    }
});