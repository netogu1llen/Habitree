document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("tbody");
  const modal = document.getElementById("modifyRewardModal");
  const closeBtn = document.getElementById("closeModifyRewardModal");
  const form = document.getElementById("modifyRewardForm");

  if (!tbody || !modal || !closeBtn || !form) {
    console.error("Faltan elementos del modal de edición (tbody/modal/close/form).");
    return;
  }

  // Delegación: un listener en tbody para capturar clicks en botones .edit-btn
  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button.edit-btn");
    if (!btn) return; // no era un botón de editar

    const id = btn.dataset.id || btn.closest("tr")?.querySelector("td")?.textContent.trim();
    console.log("Editar id:", id);

    if (!id) {
      console.error("No se pudo obtener el ID de la fila.");
      return;
    }

    try {
      const response = await fetch(`/modify-reward/${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);

      const reward = await response.json();

      // Rellenar formulario (asegúrate que los IDs existan en tu modal)
      document.getElementById("editIDReward").value = reward.IDReward ?? id;
      document.getElementById("editName").value = reward.name ?? "";
      document.getElementById("editDescription").value = reward.description ?? "";
      document.getElementById("editType").value = reward.type ?? "";
      // Si tu select espera '1'/'0', conviértelo:
      document.getElementById("editStatus").value = reward.available ? "1" : "0";
      document.getElementById("editValue").value = reward.value ?? "";

      // Actualizar action del form
      form.action = `/modify-reward/edit/${encodeURIComponent(reward.IDReward ?? id)}`;

      // Mostrar modal
      modal.style.display = "flex";
    } catch (err) {
      console.error("Error cargando recompensa:", err);
      alert("No se pudo cargar la recompensa (revisa consola / pestaña Network).");
    }
  });

  // Cerrar modal
  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});




