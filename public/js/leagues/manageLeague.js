document.addEventListener("DOMContentLoaded", () => {
    const csrfToken = document.querySelector('input[name="_csrf"]').value;
    const manageButtons = document.querySelectorAll(".table__button");
    const modalRoot = document.getElementById("modal-root");
    const backdrop = document.getElementById("backdrop");

    manageButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const row = e.target.closest("tr");
            const leagueName = row.querySelector("td:nth-child(2)").textContent.trim();

            // Crear modal
            modalRoot.innerHTML = `
                <div class="modal active" id="manageModal">
                    <div class="modal-inner">
                        <h2 id="modal-title">Manage League</h2>
                        <p style="text-align:center;">"${leagueName}"</p>
                        <div class="button-container">
                            <button id="closeModalBtn" class="submit-btn">Edit</button>
                            <button id="deleteLeagueBtn" class="submit-btn" style="background-color:#d9534f;">Delete</button>
                        </div>
                    </div>
                </div>
            `;

            backdrop.classList.add("active");

            const modal = document.getElementById("manageModal");
            const deleteBtn = document.getElementById("deleteLeagueBtn");
            const closeBtn = document.getElementById("closeModalBtn");

            // Cerrar modal
            const closeModal = () => {
                modal.classList.remove("active");
                backdrop.classList.remove("active");
                modalRoot.innerHTML = "";
            };

            closeBtn.addEventListener("click", closeModal);
            backdrop.addEventListener("click", (event) => {
                if (event.target === backdrop) closeModal();
            });

            // Eliminar liga
            deleteBtn.addEventListener("click", async () => {
                if (!confirm(`Are you sure you want to delete "${leagueName}"?`)) return;

                try {
                    const res = await fetch("/leagues/delete", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "CSRF-Token": csrfToken
                        },
                        body: JSON.stringify({ leagueName })
                    });

                    const data = await res.json();
                    alert(data.message || "Unknown response from server");

                    if (data.success) {
                        closeModal();
                        window.location.reload();
                    }
                } catch (err) {
                    console.error("Error deleting league:", err);
                    alert("Error deleting league");
                }
            });
        });
    });
});
