(function () {
    let clientId;

    const formulario = document.querySelector('#formulario');
    const nameInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const phoneInput = document.querySelector('#telefono');
    const companyInput = document.querySelector('#empresa');

    document.addEventListener('DOMContentLoaded', () => {
        conectDB();
        // Update the info

        formulario.addEventListener('submit', updateClient);

        //Check url id
        const url = new  URLSearchParams(window.location.search);

        clientId = url.get('id')

        if(clientId) {
            setTimeout(() => {
                getClient(clientId)
            }, 1000);
        }
    })

    function getClient(id) {
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');

        const client = objectStore.openCursor();
        client.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {

                if (cursor.value.id === Number(id)) {
                    fillForm(cursor.value)
                }
                cursor.continue();
            }
        }
    }

    function fillForm(client) {
        const {name, email, phone, company} = client
        nameInput.value = name
        emailInput.value = email
        phoneInput.value = phone
        companyInput.value = company
    }

    function updateClient(e) {

        e.preventDefault();
        if (!nameInput.value || !emailInput.value || !phoneInput.value || !companyInput.value) {
            printAlert('Todos los campos son obligatorios', false);
        }

        const updatedClient = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            company: companyInput.value,
            id: Number(clientId)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(updatedClient)
        transaction.oncomplete = function () {
            printAlert('Editado Correctamente', true);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

        transaction.onerror = function () {
            printAlert('Error en la edicion', true);
        }
    }
})();