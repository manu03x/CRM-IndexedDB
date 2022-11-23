(function() {

    let DB;
    const table = document.querySelector('#listado-clientes')
    document.addEventListener('DOMContentLoaded', () => {
        createDB();

        if (window.indexedDB.open('crm', 1)) {
            getClients();
        }

        table.addEventListener('click', deleteClient)
    });

    function deleteClient(e) {
        if(e.target.classList.contains('delete')) {
            const idDelete = Number(e.target.dataset.cliente);

            const confirmDelete = confirm('Deseas eliminar este cliente?');

            if (confirmDelete) {
                const transaction = DB.transaction(['crm'], 'readwrite');

                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idDelete);

                transaction.oncomplete = function() {
                    e.target.parentElement.parentElement.remove()
                }

                
                transaction.onerror = function() {
                    console.log('error')
                }

            }
        }
    }

    // Create IndexDB

    function createDB() {
        const createDB = window.indexedDB.open('crm', 1);

        createDB.onerror = function() {
            console.log('Your browser doesnt support IndexDB')
        };

        createDB.onsuccess = function() {
            DB = createDB.result;
        };


        console.log('DB LISTA')
        createDB.onupgradeneeded = function(e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', {keyPath: 'id', autoIncrement: true});

            objectStore.createIndex('name', 'name', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('phone', 'phone', {unique: false});
            objectStore.createIndex('company', 'company', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

        };
    }

    function getClients() {
        const conection = window.indexedDB.open('crm', 1);

        conection.onerror = function() {
            console.log('error');
        }

        conection.onsuccess = function() {
            DB = conection.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e) {
                const cursor = e.target.result;

                if (cursor) {
                    const {name, phone, company, email, id} = cursor.value;

                    table.innerHTML +=`
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${phone}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">
                            <p class="text-gray-600">${company}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 delete">Eliminar</a>
                        </td>
                    </tr>
                        `;

                    cursor.continue();
                }
            }
        }
    }
})();