const api = 'https://acceso-db.onrender.com/clientes';

const main = document.getElementById("contenido-principal");

fetch(api)
    .then(response => { 
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .then(data => {
        const acordion = document.createElement('div');
        acordion.classList.add('accordion', 'accordion-flush');
        acordion.id = 'accordionClientes';

        data.map(clientes =>{
            const item = document.createElement('div');
            item.classList.add('accordion-item');
            const header = document.createElement('h2');
            header.classList.add('accordion-header');
            header.id = `flush-heading${clientes.ID}`;
            const button = document.createElement('button');
            button.classList.add('accordion-button', 'collapsed');
            button.type = 'button';
            button.setAttribute('data-bs-toggle', 'collapse');
            button.setAttribute('data-bs-target', `#flush-collapse${clientes.ID}`);
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', `flush-collapse${clientes.ID}`);
            button.innerText = `${clientes.NOMBRE} - ID: ${clientes.ID}`
            const collapse = document.createElement('div');
            collapse.id = `flush-collapse${clientes.ID}`;
            collapse.classList.add('accordion-collapse', 'collapse');
            collapse.setAttribute('aria-labelledby', `flush-heading${clientes.ID}`);
            collapse.setAttribute('data-bs-parent', '#accordionClientes');
            const body = document.createElement('div');
            body.classList.add('accordion-body');
            const clienteInfo = document.createElement('div');
            clienteInfo.classList.add('card', 'bg-light', 'border-0');
            clienteInfo.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${clientes.NOMBRE || 'Nombre no disponible'}</h5>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><i class="bi bi-building me-2"></i> Empresa: ${clientes.EMPRESA || 'No disponible'}</li>
                        <li class="list-group-item"><i class="bi bi-telephone-fill me-2"></i> Teléfono: ${clientes.TELEFONO || 'No disponible'}</li>
                        <li class="list-group-item"><i class="bi bi-envelope-fill me-2"></i> Email: ${clientes.EMAIL || 'No disponible'}</li>
                        <li class="list-group-item"><i class="bi bi-person-fill me-2"></i> Edad: ${clientes.EDAD || 'No disponible'} años</li>
                        <li class="list-group-item"><i class="bi bi-geo-alt-fill me-2"></i> Dirección: ${clientes.DIRECCION || 'No disponible'}</li>
                        <li class="list-group-item"><i class="bi bi-heart-fill me-2"></i> Estado Civil: ${clientes.ESTADO_CIVIL || 'No disponible'}</li>
                        <li class="list-group-item"><i class="bi bi-calendar-check-fill me-2"></i> Creado el: ${new Date(clientes.FECHA_CREACION).toLocaleDateString() || 'No disponible'}</li>
                    </ul>
                </div>
            `;

            body.appendChild(clienteInfo);
            acordion.appendChild(item);
            item.appendChild(header);
            header.appendChild(button);
            item.appendChild(collapse);
            collapse.appendChild(body);
        });

        main.appendChild(acordion); 
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });



    document.getElementById('formEliminar').addEventListener('submit', function(event) {
    event.preventDefault();

    const idEliminar = document.getElementById('id_eliminar').value;

    fetch(`https://acceso-db.onrender.com/clientes/${idEliminar}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
        alert('Cliente eliminado correctamente');
        location.reload();
        } else if (response.status === 404) {
        alert('El cliente con ese ID no existe');
        } else {
        alert('Error al eliminar el cliente');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    });


    document.getElementById('formAgregar').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const nuevoCliente = Object.fromEntries(formData.entries());

        fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoCliente)
        })
        .then(response => {
            if (response.ok) {
                alert('Cliente agregado correctamente');
                location.reload();
            } else {
                alert('Error al agregar el cliente');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });


    document.getElementById('formEditar').addEventListener('submit', function(event) {
  event.preventDefault();

  const idActualizar = document.getElementById('id_editar').value;
  const formData = new FormData(event.target);
  const clienteActualizado = Object.fromEntries(formData.entries());

  // Eliminar propiedades vacías del objeto antes de enviar
  for (const key in clienteActualizado) {
    if (clienteActualizado.hasOwnProperty(key) && clienteActualizado[key] === '') {
      delete clienteActualizado[key];
    }
  }

  fetch(`https://acceso-db.onrender.com/clientes/${idActualizar}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clienteActualizado)
  })
  .then(response => {
    if (response.ok) {
      alert('Cliente actualizado correctamente');
      location.reload();
    } else {
      alert('Error al actualizar el cliente');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
