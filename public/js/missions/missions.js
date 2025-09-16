//FUNCIÓN PARA CREAR POP UP

const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

openBtn.addEventListener("click", () => {
    console.log("Opening modal"); // Para debug
    modal.classList.add("open");
});

closeBtn.addEventListener("click", () => {
    console.log("Closing modal"); // Para debug
    modal.classList.remove("open");
});

// Cerrar al hacer clic fuera del modal
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("open");
    }
});