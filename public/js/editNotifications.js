document.addEventListener("click", (event) => {
    // Busca el botón de la tabla que se ha clicado
    const boton = event.target.closest(".table__button");
    if (!boton) return; // Si no es un botón de la tabla, sal de la función

    const fila = boton.closest("tr");
    if (!fila) return;

    // Obtén el ID de la fila
    const id = fila.cells[0].textContent.trim();

    // Realiza la petición para obtener el contenido del modal
    fetch(`/notifications/edit/${id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Error al obtener datos de la notificación");
            }
            return res.text();
        })
        .then(html => {
            // Paso 1: Inserta el HTML recibido en el modal-root
            const modalRoot = document.getElementById("modal-root");
            if (modalRoot) {
                modalRoot.innerHTML = html;
            } else {
                console.error("No se encontró el elemento #modal-root.");
                return;
            }

            // Paso 2: Ahora que el modal ya está en el DOM, busca los elementos
            const modal = modalRoot.querySelector(".modal");
            const backdrop = document.getElementById("backdrop");

            // Paso 3: Asegúrate de que los elementos se encontraron antes de manipularlos
            if (modal && backdrop) {
                // Muestra el modal
                modal.classList.add("active");
                backdrop.classList.add("active");

                // Paso 4: Añade los event listeners para cerrar el modal
                const closeModalBtn = modal.querySelector(".close-modal");
                if (closeModalBtn) {
                    closeModalBtn.onclick = () => {
                        modal.classList.remove("active");
                        backdrop.classList.remove("active");
                    };
                }

                backdrop.onclick = (event) => {
                    // Solo cierra el modal si el clic se hizo directamente en el backdrop
                    if (event.target === backdrop) {
                        modal.classList.remove("active");
                        backdrop.classList.remove("active");
                    }
                };
                
                // --- Aquí añadimos la lógica para el botón de 'Delete' ---
                const deleteBtn = document.getElementById("delete-btn");
                if (deleteBtn) {
                    deleteBtn.addEventListener("click", () => {
                        if (confirm("¿Estás seguro de que deseas eliminar esta notificación?")) {
                            // Encuentra el formulario de eliminación oculto y lo envía
                            const deleteForm = document.getElementById("form-delete-notification");
                            if (deleteForm) {
                                deleteForm.submit();
                            }
                        }
                    });
                }
                
            } else {
                console.error("Error: Modal o backdrop no encontrados.");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Hubo un error al cargar la notificación. Por favor, inténtelo de nuevo.");
        });
});