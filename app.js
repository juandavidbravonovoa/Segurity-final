document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. GRÁFICO DE CONTROL DE SEGURIDAD (Tráfico) ---
    const ctxTraffic = document.getElementById('trafficChart').getContext('2d');
    new Chart(ctxTraffic, {
        type: 'bar',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [{
                label: 'Picos de Tráfico (MB/s)',
                data: [120, 90, 450, 300, 800, 200], // Simulando pico a las 16:00
                backgroundColor: '#4318FF',
                borderRadius: 5
            }]
        },
        options: { responsive: true }
    });

    // --- 2. GRÁFICO DE ESTADO DE PARCHES ---
    const ctxPatch = document.getElementById('patchChart').getContext('2d');
    new Chart(ctxPatch, {
        type: 'doughnut',
        data: {
            labels: ['Equipos Actualizados', 'Equipos Vulnerables'],
            datasets: [{
                data: [85, 15], // Porcentaje calculado automáticamente
                backgroundColor: ['#05CD99', '#EE5D50'],
                borderWidth: 0
            }]
        },
        options: { 
            responsive: true,
            cutout: '70%'
        }
    });

    // --- 3. DATOS DINÁMICOS: TABLA DE ALERTAS (Simulando BD) ---
    const alertas = [
        { incidente: 'Intento de Inyección SQL', ip: '192.168.1.45', nivel: 'alta' },
        { incidente: 'Escaneo de Puertos Nmap', ip: '10.0.0.12', nivel: 'media' },
        { incidente: 'Inicio de sesión inusual', ip: '172.16.2.8', nivel: 'baja' }
    ];

    const alertsBody = document.getElementById('alertsTableBody');
    alertas.forEach(alerta => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${alerta.incidente}</td>
            <td>${alerta.ip}</td>
            <td><span class="badge ${alerta.nivel}">${alerta.nivel.toUpperCase()}</span></td>
        `;
        alertsBody.appendChild(tr);
    });

    // --- 4. DATOS DINÁMICOS: LOG DE ACCESOS (Simulando BD) ---
    const accesos = [
        { usuario: 'admin_sys', tiempo: '10:45:22', estado: 'exito', texto: 'Aprobado' },
        { usuario: 'guest_01', tiempo: '10:50:01', estado: 'denegado', texto: 'Bloqueado' },
        { usuario: 'db_admin', tiempo: '11:12:33', estado: 'exito', texto: 'Aprobado' }
    ];

    const accessBody = document.getElementById('accessTableBody');
    accesos.forEach(acceso => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${acceso.usuario}</td>
            <td>${acceso.tiempo}</td>
            <td><span class="badge ${acceso.estado}">${acceso.texto}</span></td>
        `;
        accessBody.appendChild(tr);
    });
});