
/** Invia richiesta nel database per leggere i suoi dati.
 * @param {(data: Array) => void} onready 
 */
function OpenDb (onready) {
    
    let seconds = Math.floor(new Date() / 1000);
    let url = `data.json?${seconds}`;

    console.log(`Ho inviato richiesta "${url}" al DB.`);

    $.getJSON(url, data => onready(data));
}


/** Funzione main dello script. */
function Begin () {
    console.info("Avvio applicazione... :) ");

    /**
     * @param {Array} data 
     */
    const onReady = data => {
        let datasorted = Array.from(data)       // copia lista.
            .sort((a, b) => b.id - a.id)        // ordina.
            .map((item) => ({                   // crea oggetto per ciascun elemento.
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

        // console.log(datasorted);

        $('#sample_data').DataTable({
            data: datasorted,
            order: [],
            columns: [
                { data: 'first_name' },
                { data: 'last_name' },
                { data: 'gender' },
                { data: 'age' },
                { data: 'action' },
            ]
        });
    }

    // Apriamo il database !
    OpenDb(onReady);
}


// main inizia qui !
document.addEventListener('DOMContentLoaded', () => Begin());

// ok...

$(document).ready(function() {

    // load_db();

    // $('#add_data').click(function() {

    //     $('#dynamic_modal_title').text('Add Data');

    //     $('#sample_form')[0].reset();

    //     $('#action').val('Add');

    //     $('#action_button').text('Add');

    //     $('.text-danger').text('');

    //     $('#action_modal').modal('show');

    // });
   
    $('#sample_form').on('submit', function(event) {

        console.log('submit.');
        event.preventDefault();

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
                    $('#message').html('<div class="alert alert-success">' + data.success + '</div>');

                    $('#action_modal').modal('hide');

                    $('#sample_data').DataTable().destroy();

                    load_data();

                    setTimeout(function() {
                        $('#message').html('');
                    }, 5000);
                }
            }
        });

    });

    $(document).on('click', '.edit', function() {

        console.log('edit.');
        var id = $(this).data('id');
        console.log(id);
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
            },
            error: function() {},
            always: function() {
                alert('Ajax completed!')
            }
        });

    });

    $(document).on('click', '.delete', function() {

        var id = $(this).data('id');

        if (confirm("Are you sure you want to delete this data?")) {
            $.ajax({
                url: "action.php",
                method: "POST",
                data: {
                    action: 'delete',
                    id: id
                },
                dataType: "JSON",
                success: function(data) {
                    $('#message').html('<div class="alert alert-success">' + data.success + '</div>');
                    $('#sample_data').DataTable().destroy();
                    load_data();
                    setTimeout(function() {
                        $('#message').html('');
                    }, 5000);
                }
            });
        }

    });

});
