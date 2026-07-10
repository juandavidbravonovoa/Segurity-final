document.addEventListener('DOMContentLoaded', () => {

    // 1. BASE DE DATOS SIMULADA (Podemos usar la misma o una versión ampliada)
    const dbAuditoria = [
        { fecha: '2026-07-01', ip: '10.0.0.55', tipo: 'Tráfico Inusual', severidad: 'baja' },
        { fecha: '2026-07-02', ip: '192.168.1.100', tipo: 'Malware Detectado', severidad: 'alta' },
        { fecha: '2026-07-03', ip: '172.16.2.8', tipo: 'Fuerza Bruta SSH', severidad: 'alta' },
        { fecha: '2026-07-04', ip: '192.168.1.45', tipo: 'Inyección SQL', severidad: 'alta' },
        { fecha: '2026-07-04', ip: '10.0.0.12', tipo: 'Escaneo Nmap', severidad: 'media' },
        { fecha: '2026-07-05', ip: '192.168.1.20', tipo: 'Acceso no autorizado', severidad: 'media' }
    ];

    // Elementos del DOM
    const btnGenerate = document.getElementById('btnGenerate');
    const btnExportPDF = document.getElementById('btnExportPDF');
    const previewContainer = document.getElementById('reportPreviewContainer');
    const tbody = document.getElementById('reportTableBody');
    const reportMeta = document.getElementById('reportMeta');
    const reportContent = document.getElementById('reportContent');

    // 2. LÓGICA PARA GENERAR LA VISTA PREVIA
    btnGenerate.addEventListener('click', () => {
        const start = document.getElementById('dateStart').value;
        const end = document.getElementById('dateEnd').value;
        const severity = document.getElementById('severityFilter').value;

        // Filtrar el arreglo según las condiciones
        const datosFiltrados = dbAuditoria.filter(item => {
            // Si hay fecha inicio, la fecha del item debe ser mayor o igual
            const matchStart = start ? item.fecha >= start : true;
            // Si hay fecha fin, la fecha del item debe ser menor o igual
            const matchEnd = end ? item.fecha <= end : true;
            // Si la severidad es "todas", pasa. Si no, debe ser exacta.
            const matchSeverity = severity === 'todas' ? true : item.severidad === severity;

            return matchStart && matchEnd && matchSeverity;
        });

        // Limpiar tabla anterior
        tbody.innerHTML = '';

        if (datosFiltrados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No se encontraron registros para estos filtros.</td></tr>';
        } else {
            // Llenar tabla con los datos filtrados
            datosFiltrados.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.fecha}</td>
                    <td><strong>${item.ip}</strong></td>
                    <td>${item.tipo}</td>
                    <td><span class="badge ${item.severidad}">${item.severidad.toUpperCase()}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Actualizar el texto del metadato del reporte
        const textoRango = (start || end) ? `Desde ${start || 'Inicio'} hasta ${end || 'Hoy'}` : 'Todo el historial histórico';
        const textoSeveridad = severity === 'todas' ? 'Todas' : severity.toUpperCase();
        reportMeta.innerText = `Rango de Fechas: ${textoRango} | Filtro de Severidad: ${textoSeveridad}`;

        // Mostrar la tabla de vista previa y el botón de PDF
        previewContainer.style.display = 'block';
        btnExportPDF.style.display = 'inline-block';
    });

    // 3. LÓGICA PARA EXPORTAR A PDF
    btnExportPDF.addEventListener('click', () => {
        // Configuraciones de la librería html2pdf
        const opciones = {
            margin:       0.5,
            filename:     'Reporte_Auditoria_Ciberseguridad.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 }, // Mayor escala = mejor calidad
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Seleccionamos específicamente el div que queremos imprimir
        html2pdf().set(opciones).from(reportContent).save();
    });
});