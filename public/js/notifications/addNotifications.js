document.addEventListener("click", (event) => {
    // Busca el botón "Add" (ajusta el selector si tu botón tiene otra clase)
    const addBtn = event.target.closest(".header__button");
    if (!addBtn) return; // Si no es el botón "Add", sal de la función

    // Realiza la petición para obtener el contenido del modal de agregar
    fetch(`/notifications/add-modal`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Error al obtener el modal de agregar notificación");
            }
            return res.text();
        })
        .then(html => {
            // Inserta el HTML recibido en el modal-root
            const modalRoot = document.getElementById("modal-root");
            if (modalRoot) {
                modalRoot.innerHTML = html;
            } else {
                console.error("No se encontró el elemento #modal-root.");
                return;
            }

            // Ahora que el modal ya está en el DOM, busca los elementos
            const modal = modalRoot.querySelector(".modal");
            const backdrop = document.getElementById("backdrop");

            // Asegúrate de que los elementos se encontraron antes de manipularlos
            if (modal && backdrop) {
                // Muestra el modal
                modal.classList.add("active");
                backdrop.classList.add("active");

                // Añade los event listeners para cerrar el modal
                const closeModalBtn = modal.querySelector(".close-modal");
                if (closeModalBtn) {
                    closeModalBtn.onclick = () => {
                        modal.classList.remove("active");
                        backdrop.classList.remove("active");
                    };
                }

                backdrop.onclick = (event) => {
                    if (event.target === backdrop) {
                        modal.classList.remove("active");
                        backdrop.classList.remove("active");
                    }
                };
            } else {
                console.error("Error: Modal o backdrop no encontrados.");
            }
        })
        .catch(err => {
            console.error(err);
            alert("There was an error loading the add notification modal. Please try again.");
        });
});