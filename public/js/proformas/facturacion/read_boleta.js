const scriptUrl = "https://script.google.com/macros/s/AKfycbwVfdaEo3uCey7ZhOqIoxjZDxr0QqI99IHSQ6yPVCveqnkgGt_o_QwTmuD8gKX_D3_w/exec";

export async function Read_Detalle_Boleta(cod_prod) {

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
  const doc = new jsPDF({
    unit: "mm",
    format: [72, 250], // Alto ajustable
    orientation: "portrait",
    margin: { top: 0, bottom: 5, left: 5, right: 5 },
  });

  let y = 5;

  const center = (text) => {
    const width = doc.getTextWidth(text);
    return (72 - width) / 2;
  };

  // ENCABEZADO
  doc.addImage("../assets/logo/inventario_logo.png", "PNG", 21, y, 30, 15);
  y += 25;

  doc.setFontSize(6);
  const info = [
    "Calle Mariscal Castilla N° 143 int. 18",
    "Ica - Chincha - Chincha Alta",
    "TIENDA CHINCHA",
    "R.U.C: 10770630270",
  ];
  info.forEach((line) => {
    doc.text(line, center(line), y);
    y += 4;
  });

  y += 3;
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("Boleta de Venta Electrónica", 5, y);
  y += 4;
  doc.setFontSize(6);
  doc.text(`N° Boleta: ${data.cod_proforma}`, 5, y);
  doc.text(
    `Fecha: ${data.fecha.split("T")[0].split("-").reverse().join("-")}`,
    65,
    y,
    { align: "right" }
  );
  y += 6;

  // CLIENTE
  doc.setFont("helvetica", "bold");
  doc.text(`Cliente:`, 5, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.cliente}`, 65, y, { align: "right" });
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text("Moneda:", 5, y);
  doc.setFont("helvetica", "normal");
  doc.text("Soles", 65, y, { align: "right" });
  y += 6;

  doc.setFont("helvetica", "normal");

  // DETALLE DE PRODUCTOS
  data.detalles.forEach((item) => {
    doc.setFontSize(6);
    doc.text(`${item.cod_producto}`, 5, y);
    doc.text(`${item.producto}`, 65, y, { align: "right" });
    y += 4;
    doc.text(`${item.cantidad} ${item.unidad}`, 5, y);
    doc.text(item.precio.toFixed(2), 40, y, { align: "right" });
    doc.text(item.subtotal.toFixed(2), 65, y, { align: "right" });
    y += 6;
  });

  // TOTAL
  doc.setFont("helvetica", "bold");
  doc.text("Igv", 5, y);
  doc.text("S/.", 60, y, { align: "right" });
  doc.text(data.igv.toFixed(2), 65, y, { align: "right" });
  y += 6;
  doc.text("Subtotal", 5, y);
  doc.text("S/.", 60, y, { align: "right" });
  doc.text(data.subtotal.toFixed(2), 65, y, { align: "right" });
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.text(`Importe Total`, 5, y);
  doc.text(`S/. ${data.total.toFixed(2)}`, 65, y, { align: "right" });
  y += 10;

  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text(
    "*************************************************************************",
    5,
    y
  );
  y += 4;
  doc.setFont("helvetica", "normal");

  const info_ = [
    "Venta al por menor de libros, periódicos y",
    "artículos de papelería en comercios especializados.",
  ];

  info_.forEach((line) => {
    doc.text(line, center(line), y);
    y += 4;
  });

  doc.setFont("helvetica", "bold");
  doc.text("¡Gracias por su preferencia!", center("¡Gracias por su preferencia!"), y);
  y += 4;
  doc.setFontSize(6);
  doc.text(
    "*************************************************************************",
    5,
    y
  );
  y += 10;
  y += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(2);
  doc.text(".", center("."), y);
  y += 4;

  doc.setProperties({
    title: `Boleta de Venta - ${data.cod_proforma}`,
  });

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url);

  if (printWindow) {
    printWindow.addEventListener("load", function () {
      printWindow.focus();
      printWindow.print();
      // printWindow.close(); // Descomenta si quieres cerrar automáticamente
    });
  } else {
    alert("El navegador bloqueó la ventana emergente. Permite las ventanas emergentes para imprimir.");
  }
}
