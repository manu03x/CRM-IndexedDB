let DB;

function conectDB() {
    const abrirConexion= window.indexedDB.open('crm', 1);

    abrirConexion.onerror = () => console.log('Browser doenst support IndexedDB')

    abrirConexion.onsuccess = () => DB = abrirConexion.result;
}

function printAlert(message,type) {
    // Create alert
    const alerta = document.querySelector('.alerta');

    if(!alerta){
        const divMessage = document.createElement('div');
        divMessage.classList.add('px-4', 'py-3', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'alerta');

        if (!type) {
            divMessage.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else {
            divMessage.classList.add('bg-green-100', 'border-green-400','text-green-700');
        }

        divMessage.textContent = message;

        formulario.appendChild(divMessage);

        setTimeout(() => {
            divMessage.remove();
        }, 3000);
    }
}