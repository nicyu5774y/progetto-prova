

// --------------------------------

/** Invia richiesta nel database per leggere i suoi dati.
 * @param {(data: Array) => void} onready 
 */
function OpenDb (table) {
    
    let seconds = Math.floor(new Date() / 1000);
    let url = `data.json?${seconds}`;

    console.log(`Ho inviato richiesta "${url}" al DB.`);


    /** Fai questo a richiesta completata. */
    const onready = data => {

        let datasorted = [...data]       // copia lista.
            .sort((a, b) => b.id - a.id)        // ordina.
            .map(item => ({                     // crea oggetto per ciascun elemento.
                first_name: item.first_name,
                last_name: item.last_name,
                gender: item.gender,
                age: item.age,
                action: (       // Costruzione elementi dei pulsanti per modificare item.
`<button type="button" class="btn btn-warning btn-sm edit" data-id="${item.id}" >Edit</button>
<button type="button" class="btn btn-danger btn-sm delete" data-id="${item.id}" >Delete</button>
<br>
<input type="text" value="${item.id}" disabled="" />`
                )
            }))
        ;

        UpdateTable(table, datasorted);
    }


    // Invia richiesta.
    $.getJSON(url, data => onready(data));
}


/** Costruisce la tabella. */
function CreateTable () {

    // Costruisce il tavolo.
    let table = $('#sample_data').DataTable({
        order: [],
        columns: [
            { data: 'first_name' },
            { data: 'last_name' },
            { data: 'gender' },
            { data: 'age' },
            { data: 'action' },
        ]
    });


    const btnAdd = () => {
        $('#dynamic_modal_title').text('Add Data');
        $('#sample_form')[0].reset();
        $('#action').val('Add');
        $('#action_button').text('Add');
        $('.text-danger').text('');
        $('#action_modal').modal('show');
    }


    const btnEdit = ev => {
        ev.preventDefault();

        var id = $(this).data('id');
        $('#dynamic_modal_title').text('Edit Data');

        $('#action').val('Edit');

        $('#action_button').text('Edit');

        $('.text-danger').text('');

        $('#action_modal').modal('show');

        $.ajax({
            url: "action.php",
            method: "POST",
            data: {
                id: id,
                action: 'fetch_single'
            },
            dataType: "JSON",
            success: function(data) {
                $('#first_name').val(data.first_name);
                $('#last_name').val(data.last_name);
                $('#gender').val(data.gender);
                $('#age').val(data.age);
                $('#id').val(data.id);

                OpenDb(table);
            },
            error: function() {},
            always: function() {
                alert('Ajax completed!')
            }
        });
    }


    const btnDelete = ev => {
        ev.preventDefault();

        let confirmation = confirm("Vuoi cancellare questo campo?");

        // Chiedi l'utente se vuole cancellare il campo!
        if (!confirmation) {
            return;
        }
        
        let id = $(this).data('id');

        $.ajax({
            url: "action.php",
            method: "POST",
            data: { action: 'delete', id: id },
            dataType: "JSON",
            success: (data) => {
                $('#message').html('<div class="alert alert-success">' + data.success + '</div>');
                $('#sample_data').DataTable().destroy();

                OpenDb(table);

                setTimeout(function() {
                    $('#message').html('');
                }, 5000);
            }
        });
    }


    /** Invia cambiamenti da un 'add' o 'edit' */
    const submitChange = ev => {

        ev.preventDefault();
        
        $.ajax({
            url: "action.php",
            method: "POST",
            data: $('#sample_form').serialize(),
            dataType: "JSON",
            beforeSend: function() {
                $('#action_button').attr('disabled', 'disabled');
            },
            success: function(data) {
                $('#action_button').attr('disabled', false);
                if (data.error) {
                    if (data.error.first_name_error) {
                        $('#first_name_error').text(data.error.first_name_error);
                    }
                    if (data.error.last_name_error) {
                        $('#last_name_error').text(data.error.last_name_error);
                    }
                    if (data.error.age_error) {
                        $('#age_error').text(data.error.age_error);
                    }
                } else {
                    $('#message').html(`<div class="alert alert-success">${data.success}</div>`);

                    $('#action_modal').modal('hide');

                    $('#sample_data').DataTable().destroy();

                    OpenDb(table);

                    setTimeout(function() {
                        $('#message').html('');
                    }, 5000);
                }
            }
        });
    }


    // Configura i pulsanti della modifica.
    $('#add_data')      .on('click', btnAdd);
    $('#sample_form')   .on('submit', submitChange);
    $(document)         .on('click', '.edit', btnEdit);
    $(document)         .on('click', '.delete', btnDelete);

    return table;
}


/** Svuota e ripopola la tabella. */
function UpdateTable (table, db) {

    table.clear();
    table.rows.add(db);
    table.draw();
}


// --------------------------------

/** Funzione main dello script. */
function Begin () {
    console.info("Avvio applicazione... :) ");

    // Costruisce la tabella.
    let table = CreateTable();

    // Apriamo il database !
    OpenDb(table);
}


// --------------------------------

// main inizia qui !
document.addEventListener('DOMContentLoaded', () => Begin());


// --------------------------------
