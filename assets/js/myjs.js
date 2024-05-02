
/** Carica i dati dal database. */
function load_db () {

    console.log("Caricamento database.");

    var seconds = new Date() / 1000;

    $.getJSON("data.json?" + seconds + "", function(data) {

        data.sort((a, b) => b.id - a.id);

        var data_arr = [];

        for (var count = 0; count < data.length; count++) {
            var sub_array = {
                'first_name': data[count].first_name,
                'last_name': data[count].last_name,
                'gender': data[count].gender,
                'age': data[count].age,
                'action': '<button type="button" class="btn btn-warning btn-sm edit" data-id="' + data[count].id +
                    '">Edit</button>&nbsp;<button type="button" class="btn btn-danger btn-sm delete" data-id="' + data[count].id + '">Delete</button>'
            };

            data_arr.push(sub_array);
        }

        $('#sample_data').DataTable({
            data: data_arr,
            order: [],
            columns: [{
                    data: "first_name"
                },
                {
                    data: "last_name"
                },
                {
                    data: "gender"
                },
                {
                    data: "age"
                },
                {
                    data: "action"
                }
            ]
        });

    });
}

$(document).ready(function() {

    console.log('Caricamento db.');
    load_data();

    $('#add_data').click(function() {

        $('#dynamic_modal_title').text('Add Data');

        $('#sample_form')[0].reset();

        $('#action').val('Add');

        $('#action_button').text('Add');

        $('.text-danger').text('');

        $('#action_modal').modal('show');

    });

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
