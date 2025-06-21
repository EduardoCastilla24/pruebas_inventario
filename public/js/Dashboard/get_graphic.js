
var scriptUrl= 'https://script.google.com/macros/s/AKfycbwVfdaEo3uCey7ZhOqIoxjZDxr0QqI99IHSQ6yPVCveqnkgGt_o_QwTmuD8gKX_D3_w/exec'
async function cargarVentasSemanales() {
    const response = await fetch(`${scriptUrl}?action=get_venta_semanal`);
    const result = await response.json();

    if (!result.success) {
        console.error("Error al obtener los datos semanales");
        return;
    }

    const ventas = result.ventas_dias;

    const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const valores = diasOrden.map(dia => ventas[dia] || 0);

    const container_chart = document.querySelector(".container_chart");
    container_chart.innerHTML = ""; // Asegura que no haya duplicados

    container_chart.innerHTML = `
        <canvas class="w-full h-full max-w-full" id="myChart"></canvas>
    `;

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: diasOrden,
            datasets: [{
                label: 'Ventas por día (S/)',
                data: valores,
                backgroundColor: '#2c4382',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

cargarVentasSemanales();