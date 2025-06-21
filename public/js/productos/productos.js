const scriptUrl = "https://script.google.com/macros/s/AKfycbwVfdaEo3uCey7ZhOqIoxjZDxr0QqI99IHSQ6yPVCveqnkgGt_o_QwTmuD8gKX_D3_w/exec";
const params = new URLSearchParams({ action: "read_products" });

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
                            <th>Cod. Producto</th>
                            <th>Producto</th>
                            <th>Marca</th>
                            <th>Unidad</th>
                            <th>Stock</th>
                            <th>P. Mayorista</th>
                            <th>P. Minorista</th>
                            <th>Fecha Ingreso</th>
                            <th>Estado</th>
                            <th class="hidden">Estado</th>
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
                            <td>${row.cod_prod}</td>
                            <td>${row.producto}</td>
                            <td>${row.marca}</td>
                            <td>${row.unidad}</td>
                            <td>${row.stock}</td>
                            <td>${row.precio_mayorista}</td>
                            <td>${row.precio_minorista}</td>
                            <td>${(row.fecha_ingreso.split("T")[0]).split("-").reverse().join("-")}</td>
                            <td>
                            <div class="flex font-semibold text-xs items-center justify-center h-8 w-full">
                            <span class="border rounded-full px-6 py-1.5 w-fit md:w-full ${row.estado == 'Obsoleto' ? 'bg-red-50 border-red-500 text-red-500' : 'bg-green-50 border-green-800 text-green-800'}${row.estado == 'Obsoleto' ? 'bg-red-50 border-red-500 text-red-500' : 'bg-green-50 border-green-800 text-green-800'}">
                            ${row.estado}
                            </span>
                            </div>
                            </td>
                            <td class="hidden"> ${row.estado}</td>
                            <td class="!w-fit">
                                <div class="flex justify-center gap-2">
                                    <button class="!px-2.5 py-1.5 rounded-md shadow-md border border-[#2c4382]" onclick=" import('/js/productos/edit_product.js').then(module => module.Edit_Product('${row.cod_prod}'))">
                                        <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                                    </button>
                                    <button class="!px-2.5 py-1.5 rounded-md shadow-md bg-[#fde6eb] outline-none" onclick=" import('/js/productos/delete_product.js').then(module => module.Delete('${row.cod_prod}'))">
                                        <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="#d8216d"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
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

                Filter(table, $('#marca-chips'), 2 )
                Filter(table, $('#estado-chips'), 9 )

                // Si la ruta actual no está en el array, crear el botón con onclick para mostrar el modal
                $(".dataTables_filter").append(`
                    <button class="absolute right-33.5 bg-[#2c4382] text-gray-50 border !px-3 !py-2 h-fit !text-xs rounded-md hover:!translate-y-0" id="invoke"  onclick=" import('/js/Modal/Modal.js').then(module => module.Open_Modal('modal_product_filter'))">
                        <a class="!p-0 flex gap-2 items-center">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-filter-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.36 20.213l-2.36 .787v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414" /><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>                        
                        </a>
                    </button>
                    <button class="border-[#2c4382] text-[#2c4382] border !px-3 !py-2.5 h-fit !text-xs rounded-md hover:-translate-y-1 transition-all duration-300" id="invoke"  onclick=" import('/js/Modal/Modal.js').then(module => module.Open_Modal('modal_product'))">
                        <a class="!p-0 flex gap-2 items-center">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-library-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1" /><path d="M11 10h6" /><path d="M14 7v6" /></svg>
                            Agregar
                        </a>
                    </button>
                `)

            // Ocultar el spinner una vez que los datos estén cargados
            } else {
                console.error("Error al cargar datos:", data.error);
            }
        })
        .catch(error => {
            console.error("Error en el fetch:", error);
        });
});

function Filter(table, container, colum){
    const columnIndex = colum;
    // const chipContainer = $('#column-chips');
    const chipContainer = container;

     // Obtener valores únicos
        table.column(columnIndex).data().unique().sort().each(function (d) {
            const chip = $(`<button type="button" class="chip text-[#2c4382] border px-3 py-1 rounded-full !text-xs !h-fit transition" data-value="${d}">${d}</button>`);
            chipContainer.append(chip);
        });

        // Manejar click (toggle)
        let activeFilter = null;

        chipContainer.on('click', '.chip', function () {
            const value = $(this).data('value');

            if (activeFilter === value) {
                table.column(columnIndex).search('').draw(); // limpiar filtro
                activeFilter = null;
                $(this).removeClass('bg-[#2c4382] text-white').addClass('text-[#2c4382] hover:bg-gray-700');
            } else {
                table.column(columnIndex).search('^' + value + '$', true, false).draw(); // aplicar filtro exacto
                activeFilter = value;
                chipContainer.find('.chip').removeClass('bg-[#2c4382] text-white').addClass('text-[#2c4382]');
                $(this).removeClass('text-gray-700').addClass('bg-[#2c4382] text-white');
            }
        });
}