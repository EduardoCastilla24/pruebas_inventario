
const scriptUrl = "https://script.google.com/macros/s/AKfycbwVfdaEo3uCey7ZhOqIoxjZDxr0QqI99IHSQ6yPVCveqnkgGt_o_QwTmuD8gKX_D3_w/exec";

export async function Read_Detalle_Proforma(cod_prod) {

    Notiflix.Loading.dots('Cargando...'); // Muestra el loading con un mensaje

    const response = await fetch(
        `${scriptUrl}?action=search_proforma&cod_proforma=${cod_prod}`
    );

    const result = await response.json();

    Notiflix.Loading.remove();


    if (!result.success) {
        console.error(result.error);
        return;
    }

    const data = result.data;

    // Usar jsPDF desde la ventana global
    const { jsPDF } = window.jspdf;

    // Crear el PDF en A5 horizontal
    const doc = new jsPDF({
        unit: "mm",
        format: [210, 148], // A5 en horizontal
        orientation: "landscape"
    });

    let y = 10;

    const center = (text) => {
        const width = doc.getTextWidth(text);
        return (210 - width) / 2;
    };


    // LOGO
    doc.addImage("../assets/logo/inventario_logo.png", "PNG", 10, 5, 12, 10);

    // INFORMACIÓN DE TIENDA
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text("Ica - Chincha - Chincha Alta", 30, y);
    doc.setFont("helvetica", "normal");
    doc.text("Tienda Chincha", 30, y + 4);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    // INFORMACIÓN DE LA PROFORMA
    doc.text(`Proforma: ${data.cod_proforma}`, center(`Proforma: ${data.cod_proforma}`), y);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(`Fecha:`, 170, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.fecha.split("T")[0].split("-").reverse().join("-")}`, 185, y);


    // LÍNEA SEPARADORA
    y += 10;
    doc.line(10, y, 200, y);
    y += 6;

    // DATOS DE LA EMPRESA
    doc.setFont("helvetica", "bold");
    doc.text("R.U.C:", 10, y); doc.setFont("helvetica", "normal"); doc.text("10770630270", 20, y);
    doc.setFont("helvetica", "bold");
    doc.text("Telef.:", 90, y); doc.setFont("helvetica", "normal"); doc.text("+51 977287331", 100, y);
    doc.setFont("helvetica", "bold");
    doc.text("Correo.", 160, y); doc.setFont("helvetica", "normal"); doc.text("leonjuda.lib@gmail.com", 200, y, { align: "right" });

    // LÍNEA SEPARADORA
    y += 4;
    doc.line(10, y, 200, y);
    y += 4;

    // DATOS DEL CLIENTE
    doc.setFont("helvetica", "bold");
    doc.text("Señor(es):", 10, y); doc.setFont("helvetica", "normal"); doc.text(`${data.cliente}`, 30, y);
    doc.setFont("helvetica", "bold");
    doc.text(`Fecha Proforma:`, 120, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.fecha.split("T")[0].split("-").reverse().join("-")}`, 160, y);

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Sucursal:", 10, y); doc.setFont("helvetica", "normal"); doc.text("Tienda Chincha", 30, y);
    doc.setFont("helvetica", "bold");
    doc.text("Forma de Pago:", 120, y); doc.setFont("helvetica", "normal"); doc.text("Contado Adelantado en Efectivo", 160, y);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Direccion:", 10, y); doc.setFont("helvetica", "normal"); doc.text("Calle Mariscal Castilla N° 143 int. 18", 30, y);
    doc.setFont("helvetica", "bold");
    doc.text("Validez de la Proforma:", 120, y); doc.setFont("helvetica", "normal"); doc.text("2 DIAS", 160, y);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones:", 10, y);

    // LÍNEA SEPARADORA
    y += 4;
    doc.line(10, y, 200, y);
    y += 5;
    doc.setFontSize(6); +

        doc.text("Detalle de Artículos :", 10, y);
    y += 5;

    const pageHeight = doc.internal.pageSize.getHeight();
    const margenInferior = 30;
    const altoFila = 5;

    const printTableHeader = () => {
        doc.setFont("helvetica", "bold");
        doc.text("Item", 10, y);
        doc.text("Código", 32, y);
        doc.text("Descripcion", 65, y);
        doc.text("Unidad", 130, y);
        doc.text("Cantidad", 150, y);
        doc.text("Precio Unit.", 170, y);
        doc.text("Total", 190, y);
        y += 5;
    };

    printTableHeader();

    data.detalles.forEach((item, index) => {
        if (y + altoFila > pageHeight - margenInferior) {
            doc.addPage();
            y = 10;
            doc.setFontSize(6);
            doc.setFont("helvetica", "bold");
            doc.text("Detalle de Artículos :", 10, y);
            y += 5;
            printTableHeader();
        }

        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.text(`${index + 1}`, 11, y);
        doc.text(`${item.cod_producto}`, 30, y);
        doc.text(`${item.producto}`, 65, y);
        doc.text(`${item.unidad}`, 130, y);
        doc.text(`${item.cantidad}`, 152, y);
        doc.text(item.precio.toFixed(2), 170, y);
        doc.text(item.subtotal.toFixed(2), 190, y);
        y += 6;
    });
    doc.line(148, y, 200, y);
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal", 150, y);
    doc.text("I.g.v", 170, y);
    doc.text("Total", 190, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.text(`${data.subtotal}`, 152, y);
    doc.text(data.igv.toFixed(2), 170, y);
    doc.text(data.total.toFixed(2), 190, y);

    y += 4;
    doc.line(10, y, 200, y);

    doc.text('Precios Expresados en Nuevos Soles', center('Precios Expresados en Soles'), y + 4);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text('Atentamente,', 10, y);
    doc.text('Empresa de León de Judá', 30, y);
    y += 8;
    doc.setFontSize(6)
    doc.setFont("helvetica", "normal");
    doc.text('Nuestras cuentas son: ', 10, y);
    doc.setFont("helvetica", "bold");
    doc.text('BCP: ', 50, y);
    doc.setFont("helvetica", "normal");
    doc.text('193-1159267-0-66', 75, y);


    doc.setProperties({
        title: `Proforma - ${data.cod_proforma}`,
    });
    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl, "_blank");
}
