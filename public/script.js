document.addEventListener('DOMContentLoaded', () => {
    const selectorSemana = document.getElementById('weekSelector');
    const cuerpoTablaActividades = document.querySelector('#activitiesTable tbody');
    const listaTopActividades = document.getElementById('topActivitiesList');
    const gestionEventosBtn = document.getElementById('gestionEventosBtn');
    const popup = document.getElementById('popup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const updateDateBtn = document.getElementById('updateDateBtn');
    const eventDateInput = document.getElementById('eventDate');
    const addActivityCheckbox = document.getElementById('addActivityCheckbox');
    const addActivityForm = document.getElementById('addActivityForm');
    const addActivityBtn = document.getElementById('addActivityBtn');
    const currentWeekNumberElement = document.getElementById('currentWeekNumber');
    const currentDayElement = document.getElementById('currentDay');
    const currentSeasonElement = document.getElementById('currentSeason');

    // Función para calcular la semana actual desde una fecha fija
    function calcularSemanaActual() {
        const fechaInicio = new Date('2024-07-11'); // Fecha fija de inicio
        const fechaActual = new Date(); // Fecha actual
        const milisegundosPorDia = 24 * 60 * 60 * 1000;

        // Calcular los días transcurridos desde la fecha fija
        const diasTranscurridos = Math.floor((fechaActual - fechaInicio) / milisegundosPorDia);

        // Convertir días en semanas y redondear hacia arriba
        const semanaActual = Math.ceil(diasTranscurridos / 7);

        return semanaActual > 0 ? semanaActual : 1; // Asegurarse de que no sea menor a 1
    }

    // Función para obtener la fecha completa en formato dd/mm/aaaa
    function obtenerFechaCompleta() {
        const fechaActual = new Date();
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
        const año = fechaActual.getFullYear();
        return `${dia}/${mes}/${año}`;
    }

    // Función para obtener la temporada actual
    function obtenerTemporadaActual() {
        const fechaActual = new Date();
        const mes = fechaActual.getMonth();
        const año = fechaActual.getFullYear();

        let temporada;
        if (mes >= 2 && mes <= 4) {
            temporada = 'Temporada Primavera';
        } else if (mes >= 5 && mes <= 7) {
            temporada = 'Temporada Verano';
        } else if (mes >= 8 && mes <= 10) {
            temporada = 'Temporada Otoño';
        } else {
            temporada = 'Temporada Invierno';
        }

        return `${temporada} ${año}`;
    }

    // Mostrar la semana actual, fecha completa y temporada en el apartado
    const semanaActual = calcularSemanaActual();
    const fechaCompleta = obtenerFechaCompleta();
    const temporadaActual = obtenerTemporadaActual();

    currentWeekNumberElement.textContent = semanaActual;
    currentDayElement.textContent = fechaCompleta;
    currentSeasonElement.textContent = temporadaActual;

    console.log(`Semana actual calculada: ${semanaActual}`); // Depuración
    console.log(`Fecha completa: ${fechaCompleta}`); // Depuración
    console.log(`Temporada actual: ${temporadaActual}`); // Depuración

    // Función para obtener semanas únicas desde la API y ordenarlas
    async function obtenerSemanas() {
        try {
            const respuesta = await fetch('/api/weeks');
            if (!respuesta.ok) {
                throw new Error('Error al obtener las semanas');
            }
            let semanas = await respuesta.json();

            // Ordenar las semanas de menor a mayor
            semanas = semanas.sort((a, b) => {
                const numeroA = parseInt(a.replace('Semana ', ''));
                const numeroB = parseInt(b.replace('Semana ', ''));
                return numeroA - numeroB;
            });

            llenarSelectorSemanas(semanas);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Función para llenar el selector con las semanas
    function llenarSelectorSemanas(semanas) {
        selectorSemana.innerHTML = ''; // Limpiar el selector
        semanas.forEach(semana => {
            const opcion = document.createElement('option');
            opcion.value = semana;
            opcion.textContent = semana;
            selectorSemana.appendChild(opcion);
        });
        // Cargar actividades y top de actividades de la primera semana por defecto
        if (semanas.length > 0) {
            obtenerActividades(semanas[0]);
            obtenerTopActividades(semanas[0]);
        }
    }

    // Función para obtener actividades de la API
    async function obtenerActividades(semana) {
        try {
            const respuesta = await fetch(`/api/activities?week=${encodeURIComponent(semana)}`);
            if (!respuesta.ok) {
                throw new Error('Error al obtener las actividades');
            }
            const actividades = await respuesta.json();
            mostrarActividades(actividades);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Función para mostrar las actividades en la tabla
    function mostrarActividades(actividades) {
        cuerpoTablaActividades.innerHTML = ''; // Limpiar tabla

        const semanaActual = calcularSemanaActual(); // Obtener la semana actual

        if (actividades.length === 0) {
            const fila = document.createElement('tr');
            fila.innerHTML = `<td colspan="5">No hay actividades para esta semana.</td>`;
            cuerpoTablaActividades.appendChild(fila);
        } else {
            actividades.forEach(actividad => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${actividad.actividad}</td>
                    <td>${actividad.responsable}</td>
                    <td>${actividad.stopper}</td>
                    <td>${actividad.indicador}</td> <!-- Cambiado de prioridad a indicador -->
                    <td>
                        <input type="checkbox" ${actividad.semana === semanaActual ? 'checked' : ''}>
                    </td>
                `;
                cuerpoTablaActividades.appendChild(fila);
            });
        }
    }

    // Función para obtener el Top de Actividades
    async function obtenerTopActividades(semana) {
        try {
            const respuesta = await fetch(`/api/top-activities?week=${encodeURIComponent(semana)}`);
            if (!respuesta.ok) {
                throw new Error('Error al obtener el Top de Actividades');
            }
            const actividades = await respuesta.json();
            mostrarTopActividades(actividades);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Función para mostrar el Top de Actividades
    function mostrarTopActividades(actividades) {
        listaTopActividades.innerHTML = ''; // Limpiar lista
        if (actividades.length === 0) {
            const item = document.createElement('li');
            item.textContent = 'No hay actividades destacadas para esta semana.';
            listaTopActividades.appendChild(item);
        } else {
            actividades.forEach(actividad => {
                const item = document.createElement('li');
                item.textContent = actividad.actividad;
                listaTopActividades.appendChild(item);
            });
        }
    }

    // Evento para detectar cambios en el selector
    selectorSemana.addEventListener('change', (evento) => {
        const semanaSeleccionada = evento.target.value;
        console.log(`Semana seleccionada: ${semanaSeleccionada}`); // Depuración
        obtenerActividades(semanaSeleccionada);
        obtenerTopActividades(semanaSeleccionada);
    });

    // Abrir o cerrar el pop-up al presionar el botón "Gestión de Eventos"
    gestionEventosBtn.addEventListener('click', () => {
        if (popup.classList.contains('hidden')) {
            const rect = gestionEventosBtn.getBoundingClientRect();
            popup.style.left = `${rect.left}px`;
            popup.style.bottom = `${window.innerHeight - rect.top + 10}px`; // Ajustar para que aparezca justo arriba
            popup.classList.remove('hidden');
        } else {
            popup.classList.add('hidden');
        }
    });

    // Cerrar el pop-up al presionar la "X"
    closePopupBtn.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    // Actualizar la fecha del evento
    updateDateBtn.addEventListener('click', () => {
        const nuevaFecha = eventDateInput.value;
        if (nuevaFecha) {
            console.log(`Fecha actualizada a: ${nuevaFecha}`); // Aquí puedes enviar la fecha al backend si es necesario
            alert(`La fecha del evento ha sido actualizada a: ${nuevaFecha}`);
            popup.classList.add('hidden');
        } else {
            alert('Por favor, selecciona una fecha válida.');
        }
    });

    // Mostrar/ocultar el formulario al activar/desactivar el checkbox
    addActivityCheckbox.addEventListener('change', () => {
        if (addActivityCheckbox.checked) {
            addActivityForm.classList.remove('hidden');
        } else {
            addActivityForm.classList.add('hidden');
        }
    });

    // Manejar el evento del botón "Agregar actividad"
    addActivityBtn.addEventListener('click', () => {
        const actividad = document.getElementById('activityName').value;
        const responsable = document.getElementById('responsable').value;
        const semana = document.getElementById('week').value;
        const stopper = document.getElementById('stopper').value;
        const duracion = document.getElementById('duration').value;
        const diasAlEvento = document.getElementById('daysToEvent').value;
        const indicador = document.getElementById('indicator').value;

        if (actividad && responsable && semana && stopper && duracion && diasAlEvento && indicador) {
            console.log('Nueva actividad agregada:', {
                actividad,
                responsable,
                semana,
                stopper,
                duracion,
                diasAlEvento,
                indicador,
            });
            alert('Actividad agregada exitosamente.');
            addActivityForm.reset();
        } else {
            alert('Por favor, completa todos los campos.');
        }
    });

    // Simulación de datos de actividades
    const actividades = [
        { actividad: 'Revisión de motor', responsable: 'Juan', stopper: 'No', indicador: 'Alta', semana: 40 },
        { actividad: 'Cambio de neumáticos', responsable: 'Ana', stopper: 'Sí', indicador: 'Media', semana: 39 },
        { actividad: 'Ajuste de aerodinámica', responsable: 'Luis', stopper: 'No', indicador: 'Alta', semana: 40 }
    ];

    // Mostrar actividades en la tabla
    mostrarActividades(actividades);

    // Obtener semanas al cargar la página
    obtenerSemanas();
});