document.addEventListener('DOMContentLoaded', () => {

    // 1. BASE DE DATOS SIMULADA DE AMENAZAS
    const dbAmenazas = [
        { id: 1, fecha: '2026-07-04', ip: '192.168.1.45', tipo: 'Inyección SQL', severidad: 'alta', mitigacion: 'Revisar la sanitización de inputs en el formulario de login. Aplicar consultas preparadas (Prepared Statements) en la base de datos y bloquear la IP temporalmente.' },
        { id: 2, fecha: '2026-07-04', ip: '10.0.0.12', tipo: 'Escaneo Nmap', severidad: 'media', mitigacion: 'Configurar el Firewall perimetral para dropear paquetes ICMP excesivos y limitar el rate de conexiones por segundo desde esa IP.' },
        { id: 3, fecha: '2026-07-03', ip: '172.16.2.8', tipo: 'Fuerza Bruta SSH', severidad: 'alta', mitigacion: 'Deshabilitar el inicio de sesión root vía SSH, cambiar el puerto por defecto (22) e implementar Fail2Ban para bloquear la IP atacante.' },
        { id: 4, fecha: '2026-07-02', ip: '192.168.1.100', tipo: 'Malware Detectado', severidad: 'alta', mitigacion: 'Aislar el equipo de la red inmediatamente. Ejecutar el antivirus corporativo en modo seguro y buscar el proceso malicioso en el Administrador de Tareas.' },
        { id: 5, fecha: '2026-07-01', ip: '10.0.0.55', tipo: 'Tráfico Inusual', severidad: 'baja', mitigacion: 'Monitorear los logs del equipo. Es posible que sea una actualización pesada en segundo plano de Windows Update.' }
    ];

    let datosActuales = [...dbAmenazas];
    let paginaActual = 1;
    const registrosPorPagina = 3;

    // Elementos del DOM
    const tbody = document.getElementById('threatsTableBody');
    const inputIP = document.getElementById('filterIP');
    const inputDate = document.getElementById('filterDate');
    const modal = document.getElementById('mitigationModal');
    const btnCerrarModal = document.querySelector('.close-btn');

    // 2. RENDERIZAR TABLA CON PAGINACIÓN
    function renderTable() {
        tbody.innerHTML = ''; // Limpiar tabla
        
        // Lógica matemática de paginación
        const inicio = (paginaActual - 1) * registrosPorPagina;
        const fin = inicio + registrosPorPagina;
        const paginaDatos = datosActuales.slice(inicio, fin);

        if (paginaDatos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No se encontraron registros.</td></tr>';
        }

        paginaDatos.forEach(amenaza => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${amenaza.fecha}</td>
                <td><strong>${amenaza.ip}</strong></td>
                <td>${amenaza.tipo}</td>
                <td><span class="badge ${amenaza.severidad}">${amenaza.severidad.toUpperCase()}</span></td>
                <td><button class="btn-action" onclick="abrirModal(${amenaza.id})">Mitigar</button></td>
            `;
            tbody.appendChild(tr);
        });

        actualizarPaginacion();
    }

    // 3. ACTUALIZAR BOTONES DE PAGINACIÓN
    function actualizarPaginacion() {
        const totalPaginas = Math.ceil(datosActuales.length / registrosPorPagina) || 1;
        document.getElementById('pageInfo').innerText = `Página ${paginaActual} de ${totalPaginas}`;
        
        document.getElementById('btnPrev').disabled = (paginaActual === 1);
        document.getElementById('btnNext').disabled = (paginaActual === totalPaginas);
    }

    // Eventos de Paginación
    document.getElementById('btnPrev').addEventListener('click', () => {
        if (paginaActual > 1) { paginaActual--; renderTable(); }
    });

    document.getElementById('btnNext').addEventListener('click', () => {
        const totalPaginas = Math.ceil(datosActuales.length / registrosPorPagina);
        if (paginaActual < totalPaginas) { paginaActual++; renderTable(); }
    });

    // 4. LÓGICA DE FILTROS DE BÚSQUEDA
    document.getElementById('btnSearch').addEventListener('click', () => {
        const ipFiltro = inputIP.value.trim();
        const fechaFiltro = inputDate.value;

        datosActuales = dbAmenazas.filter(amenaza => {
            const coincideIP = ipFiltro === '' || amenaza.ip.includes(ipFiltro);
            const coincideFecha = fechaFiltro === '' || amenaza.fecha === fechaFiltro;
            return coincideIP && coincideFecha;
        });

        paginaActual = 1; // Volver a la primera página tras buscar
        renderTable();
    });

    document.getElementById('btnReset').addEventListener('click', () => {
        inputIP.value = '';
        inputDate.value = '';
        datosActuales = [...dbAmenazas];
        paginaActual = 1;
        renderTable();
    });

    // 5. LÓGICA DEL MODAL
    window.abrirModal = function(id) {
        const amenaza = dbAmenazas.find(a => a.id === id);
        const modalDetails = document.getElementById('modalDetails');
        
        modalDetails.innerHTML = `
            <p><strong>Equipo Afectado (IP):</strong> ${amenaza.ip}</p>
            <p><strong>Vulnerabilidad:</strong> ${amenaza.tipo}</p>
            <div class="mitigation-box">
                <h4>Instrucciones Técnicas:</h4>
                <p>${amenaza.mitigacion}</p>
            </div>
        `;
        modal.style.display = 'block';
    }

    // Cerrar modal al hacer clic en la "X"
    btnCerrarModal.addEventListener('click', () => { modal.style.display = 'none'; });

    // Cerrar modal al hacer clic fuera de la caja
    window.addEventListener('click', (event) => {
        if (event.target === modal) { modal.style.display = 'none'; }
    });

    // Render inicial
    renderTable();
});