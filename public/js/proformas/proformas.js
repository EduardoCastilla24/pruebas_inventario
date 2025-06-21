const scriptUrl = "https://script.google.com/macros/s/AKfycbwVfdaEo3uCey7ZhOqIoxjZDxr0QqI99IHSQ6yPVCveqnkgGt_o_QwTmuD8gKX_D3_w/exec";
const params = new URLSearchParams({ action: "read_proformas" });

document.addEventListener("DOMContentLoaded", () => {

    const tableContainer = document.getElementById("tableContainer");

    // Realizar el fetch para obtener los datos
    fetch(`${scriptUrl}?${params}`, { method: "GET" })
        .then(response => response.json())
        .then(data => {

            if (data.success) {
                // Crear dinámicamente la tabla si aún no existe
                tableContainer.innerHTML = `
                    <table id="dataTable" class="w-full h-full dataTable responsive display nowrap" cellspacing="0" style="width: 100% !important">
                        <thead>
                            <th>Cod. Proforma</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Fecha</th>
                            <th class="max-w-[10rem] w-[10rem]"></th>
                        </thead>
                        <tbody></tbody>
                    </table>
                `;

                // Poblar los datos en la tabla
                const tableBody = document.querySelector(".dataTable tbody");
                tableBody.innerHTML = ""; // Asegura que no haya duplicados
                data.data.forEach(row => {
                    tableBody.innerHTML += `
                        <tr>
                            <td>${row.cod_proforma}</td>
                            <td>${row.cliente}</td>
                            <td>${row.total}</td>
                            <td>${(row.fecha.split("T")[0]).split("-").reverse().join("-")}</td>
                            <td>
                                <div class="flex justify-center gap-2">
                                    <button class="!px-2.5 py-1.5 rounded-md shadow-md border border-[#2c4382]" onclick=" import('/js/proformas/facturacion/read_boleta.js').then(module => module.Read_Detalle_Boleta('${row.cod_proforma}'))" title="Ver Boleta ${row.cod_proforma} ">
                                        <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file-text"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M9 9l1 0" /><path d="M9 13l6 0" /><path d="M9 17l6 0" /></svg>                                    
                                    </button>
                                    <button class="!px-2.5 py-1.5 rounded-md shadow-md !bg-[#2c4382] !text-white" onclick=" import('/js/proformas/facturacion/read_proforma.js').then(module => module.Read_Detalle_Proforma('${row.cod_proforma}'))" title="Ver Proforma ${row.cod_proforma} ">
                                        <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-ticket"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 5l0 2" /><path d="M15 11l0 2" /><path d="M15 17l0 2" /><path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2" /></svg>
                                    </button>
                                </div>
                            </td>

                        </tr>
                    `;
                });

                // Inicializar DataTables
                $('.dataTable').DataTable({
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
                    dom: 'Bfrtip',
                    // BOTONES DE EXPORTACION
                    buttons: [
                        {
                            'extend': 'excelHtml5',
                            'text': `
                                <div class="text-gray-500 flex items-center justify-center !p-0 gap-1 h-8">
                                    <svg  xmlns="http://www.w3.org/2000/svg"  width="18"  height="18"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file-excel"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" /><path d="M10 12l4 5" /><path d="M10 17l4 -5" /></svg>                        
                                    <p>Descargar xlsx</p>
                                </div>
                            `,
                            'titleAttr': "Exportar Excel",
                            autoFilter: true,
                            exportOptions: {
                                columns: 'th:not(:last-child)'
                            },
                        },
                    ]
                });
                // Array de rutas que quieres verificar
                const rutas = [
                    '/Proformas',
                ];

                        // Verificar si la ruta actual está en el array de rutas
                if (rutas.includes(window.location.pathname)) {
                    // Si la ruta actual está en el array, crear el botón con href en el enlace
                    $(".dataTables_filter").append(`
                        <button class="bg-[#2c4382] text-white !px-3 !py-2.5 h-fit !text-xs rounded-md hover:-translate-y-1 transition-all duration-300" id="invoke"  onclick=" import('/js/Modal/Modal.js').then(module => module.Open_Modal('modal_product'))">
                            <a href="${window.location.pathname}/nueva-proforma" class="!p-0 flex gap-2 items-center">
                                <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-library-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1" /><path d="M11 10h6" /><path d="M14 7v6" /></svg>
                                Agregar
                            </a>
                        </button>
                    `);
                } else {
                    // Si la ruta actual no está en el array, crear el botón con onclick para mostrar el modal
                    $(".dataTables_filter").append(`
                        <button class="bg-[#2c4382] text-white !px-3 !py-2.5 h-fit !text-xs rounded-md hover:-translate-y-1 transition-all duration-300" id="invoke"  onclick=" import('/js/Modal/Modal.js').then(module => module.Open_Modal('modal_product'))">
                            <a class="!p-0 flex gap-2 items-center">
                                <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-library-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1" /><path d="M11 10h6" /><path d="M14 7v6" /></svg>
                                Agregar
                            </a>
                        </button>
                    `)
                }

            // Ocultar el spinner una vez que los datos estén cargados
            } else {
                console.error("Error al cargar datos:", data.error);
            }
        })
        .catch(error => {
            console.error("Error en el fetch:", error);
        });
});