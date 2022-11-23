(function() {
    let DB;
    const formulario = document.querySelector('#formulario')
    document.addEventListener('DOMContentLoaded', () => {
        conectDB();
        formulario.addEventListener('submit', clientValidation)
    })

    function conectDB() {
        const abrirConexion= window.indexedDB.open('crm', 1);

        abrirConexion.onerror = () => console.log('Browser doenst support IndexedDB')

        abrirConexion.onsuccess = () => DB = abrirConexion.result;
    }

    function clientValidation(e) {
        e.preventDefault();
        //READ INPUTS
        const name = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#telefono').value;
        const company = document.querySelector('#empresa').value;

        if (!name || !email || !phone || !company) {
            printAlert('Todos los campos son obligatorios', false)

            return;
        }

        // Create an object with info

        // Object literal enhancement // Opposite of Deconstructuring

        const client = {
            name,
            email,
            phone,
            company
        }

        createClient(client)
    }

    function createClient(client) {
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');

        objectStore.add(client);

        transaction.onerror = function() {
            printAlert('Error al añadir cliente', false)
        }

        transaction.oncomplete = function() {
            printAlert('Cliente añadido exitosamente', true)
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

    }
})();