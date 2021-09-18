$(document).ready(function () {
    //Variable
    let emailRegEx = /[0-9a-zA-Z]+\@+[a-z]+\.+['com']/;

    //Event listeners
    $('.join form').on('submit', deFrmSubmtHandler);

    $('input').on('blur', deInpBlrHandler).on('focus', deInpFcsHandler);

    $('label').on('click', deLblClckHandler);

    //Event handler
    function deFrmSubmtHandler(event) {
        if (isEmpty('#signup-form')){
            event.preventDefault();
            $('.alert-danger').html('Please fill out the field below').removeClass('d-none');
        }else if (!emailRegEx.test($('#signup-form input[name = email]').val())){
            event.preventDefault();
            $('.alert-danger').html('Please enter a valid Email').removeClass('d-none');
        }
    }

    function deInpBlrHandler() {
        if ($.trim($(this).val()) !== ''){
            $(this).next().css('opacity', 0);
        }
    }

    function deInpFcsHandler() {
        $(this).next().css('opacity', 1);
    }

    function deLblClckHandler() {
        $(this).prev().focus();
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