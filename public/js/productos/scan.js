const barcodeInput = document.getElementById('cod_producto');

barcodeInput?.addEventListener('keydown', (event) => {
    const isEnter = event.key === 'Enter';
    const isHTMLElement = document.activeElement instanceof HTMLElement;

    if (!isEnter || !isHTMLElement) return;

    event.preventDefault();

    const focusableSelectors = 'input, button, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(document.querySelectorAll(focusableSelectors))
        .filter(el => !el.disabled && el.offsetParent !== null);

    const currentIndex = focusableElements.indexOf(document.activeElement);
    const nextElement = focusableElements[currentIndex + 2];

    if (nextElement) {
        nextElement.focus();

        const inputFecha = document.getElementById('fecha_ingreso');

        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes comienza en 0
        const dd = String(hoy.getDate()).padStart(2, '0');

        inputFecha.value = `${yyyy}-${mm}-${dd}`;
    }
});