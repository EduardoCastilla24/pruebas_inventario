const scriptUrl = "https://script.google.com/macros/s/AKfycbwVfdaEo3uCey7ZhOqIoxjZDxr0QqI99IHSQ6yPVCveqnkgGt_o_QwTmuD8gKX_D3_w/exec";
const params = new URLSearchParams({ action: "get_last_proformas" });

document.addEventListener("DOMContentLoaded", () => {

    const tableContainer = document.getElementById("tableContainer");

    // Realizar el fetch para obtener los datos
    fetch(`${scriptUrl}?${params}`, { method: "GET" })
        .then(response => response.json())
        .then(data => {

            if (data.success) {
                // Crear dinámicamente la tabla si aún no existe
                tableContainer.innerHTML = `
                    <table id="dataTable" class="w-full dataTable responsive display nowrap" cellspacing="0" style="width: 100% !important">
                        <thead>
                            <th class="max-w-[2rem] w-[2rem]">Cod.</th>
                            <th class="max-w-[10rem] w-[10rem]">Cliente</th>
                            <th class="max-w-[2rem] w-[2rem]"></th>
                        </thead>
                        <tbody></tbody>
                    </table>
                `;

                // Poblar los datos en la tabla
                const tableBody = document.querySelector(".dataTable tbody");
                tableBody.innerHTML = ""; // Asegura que no haya duplicados
                data.last_proformas.forEach(row => {
                    tableBody.innerHTML += `
                        <tr>
                            <td>${row.cod_proforma}</td>
                            <td>${row.cliente}</td>
                            <td class="!w-fit">
                                <div class="flex justify-center gap-2">
                                    <button class="!px-2.5 py-1.5 rounded-md shadow-md border border-[#2c4382]" onclick=" import('/js/proformas/facturacion/read_boleta.js').then(module => module.Read_Detalle_Boleta('${row.cod_proforma}'))" title="Ver Boleta ${row.cod_proforma} ">
                                        <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>                                    
                                    </button>
                                </div>
                            </td>

                        </tr>
                    `;
                });

                // Inicializar DataTables
                const table = $('.dataTable').DataTable({
                    responsive: true,
                    pageLength: 8,
                    autoWidth: false,
                    language: {
                        search: "",
                        searchPlaceholder: "Buscar...",
                        lengthMenu: '_MENU_',
                        zeroRecords: 'No se han encontrado registros que coincidan',
                        info: 'Mostrando _END_ de _MAX_ registros',
                        infoEmpty: 'Mostrando _END_ coincidencias',
                        infoFiltered: "(Filtrado de _MAX_ registros en total)",
                        emptyTable: 'No existen registros en esta tabla',
                        paginate: {
                            next: `
                                <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
                            `,
                            previous: `
                                <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
                            `
                        },
                    },
                    dom: '',

                });
            // Ocultar el spinner una vez que los datos estén cargados
            } else {
                console.error("Error al cargar datos:", data.error);
            }
        })
        .catch(error => {
            console.error("Error en el fetch:", error);
        });
});
