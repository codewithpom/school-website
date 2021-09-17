$(document).ready(function () {
    //Variable
    let emailRegEx = /[0-9a-zA-Z]+\@+[a-z]+\.+['com']/;

    //Event Listener
    $('#contactForm').on('submit', deCntctFrmSbmtHandler);

    //Event handler

    // form validation
    function deCntctFrmSbmtHandler(event){
        event.preventDefault();
        $('#contactFor .alert-danger').addClass('d-none');
        if (isEmpty('#contactForm')){
            event.preventDefault();
            $('#contactForm .alert-danger').html('Please fill out the field below').removeClass('d-none');
        }else if (!emailRegEx.test($('#contactForm input[name = email]').val())){
            event.preventDefault();
            $('#contactForm .alert-danger').html('Please enter a valid Email').removeClass('d-none');
        }
    }

    //Function
    function isEmpty(parent) {
        let isEmpt = false;
        $(`${parent} input[type="text"]`).each(function() {
            if ($.trim($(this).val()) === "") {
                isEmpt = true;
            }
        });
        return isEmpt;
    }
});