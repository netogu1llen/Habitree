document.addEventListener("click", (event) => {
    // Busca el botón de la tabla que se ha clicado
    const boton = event.target.closest(".table__button");
    if (!boton) return; // Si no es un botón de la tabla, sal de la función

    const fila = boton.closest("tr");
    if (!fila) return;


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addRewardBtn");
  const modal = document.getElementById("addRewardModal");
  const backdrop = document.getElementById("backdrop");
  const closeModal = document.getElementById("closeModal");
  const saveBtn = document.getElementById("add-edit-btn");

  // Mostrar modal
  addBtn.addEventListener("click", () => {
    modal.classList.add("active");
    backdrop.classList.add("active");
  });

  // Cerrar modal
  const close = () => {
    modal.classList.remove("active");
    backdrop.classList.remove("active");
    clearForm();
  };

  closeModal.addEventListener("click", close);
  backdrop.addEventListener("click", close);

  // Limpiar formulario
  function clearForm() {
    document.getElementById("rewardName").value = "";
    document.getElementById("rewardDescription").value = "";
    document.getElementById("rewardPrice").value = "";
    document.getElementById("rewardImage").value = "";
  }

  // Guardar Reward (ejemplo con fetch POST)
  saveBtn.addEventListener("click", async () => {
    const name = document.getElementById("rewardName").value.trim();
    const description = document.getElementById("rewardDescription").value.trim();
    const price = document.getElementById("rewardPrice").value.trim();

    if (!name || !description || !price) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const res = await fetch("/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": window.csrfToken
        },
        body: JSON.stringify({ name, description, price })
      });

      if (res.ok) {
        alert("Reward added successfully!");
        close();
        location.reload(); // refresca lista
      } else {
        alert("Error adding reward.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  });
});

});