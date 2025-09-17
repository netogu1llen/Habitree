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
        // Si no encuentras el modal-root, puedes crear uno
        // o mostrar un mensaje de error. Por ahora, salimos.
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
        // Busca el botón de cerrar DENTRO del modal
        const closeModalBtn = modal.querySelector(".close-modal");
        if (closeModalBtn) {
          closeModalBtn.onclick = () => {
            modal.classList.remove("active");
            backdrop.classList.remove("active");
          };
        }

        backdrop.onclick = () => {
          modal.classList.remove("active");
          backdrop.classList.remove("active");
        };
      } else {
        console.error("Error: Modal o backdrop no encontrados.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Hubo un error al cargar la notificación. Por favor, inténtelo de nuevo.");
    });
});