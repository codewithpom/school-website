$(document).ready(function () {
    // Variable
    let emailRegEx = /[0-9a-zA-Z]+\@+[a-z]+\.+['com']/;

    // Event listener
    $('form a').on('click', deFrmAClckHandler);

    $('#login-form').on('submit', deLoginFrmInpHandler);

    $('#signup-form').on('submit', deSignFrmInpHandler);

    $('input').on('blur', deInpBlrHandler).on('focus', deInpFcsHandler);

    $('label').on('click', deLblClckHandler);

    // Event handler
    function deFrmAClckHandler() {
        event.preventDefault();
        $('.alert-danger').addClass('d-none');
        $('.cover').removeClass('d-none');
        setTimeout(() => {
            $('form').addClass('d-none');
            $($(this).attr('href')).addClass('d-block').removeClass('d-none');
            $('.cover').addClass('d-none');
        }, 1000);
    }

    function deLoginFrmInpHandler() {
        event.preventDefault();
        console.log(isEmpty('#login-form'));
        if (isEmpty('#login-form')){
            event.preventDefault();
            $('.alert-danger').html('Please fill out the field below').removeClass('d-none');
        }else if (!emailRegEx.test($('#login-form input[name = email]').val())){
            event.preventDefault();
            $('.alert-danger').html('Please enter a valid Email').removeClass('d-none');
        }
    }

    function deSignFrmInpHandler() {
        if (isEmpty('#signup-from')){
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

    // Function
    function isEmpty(parent) {
        let isEmpt = false;
        $(`${parent} input[type="text"]`).each(function() {
            if ($.trim($(this).val()) === "") {
                isEmpt = true;
            }
        });
        return isEmpt;
    }

    function addBoxShadow() {
        let color;
        $('.shapes div').each(function () {
            color = this.style.background;
            if(color !== '') $(this).css('box-shadow', `0 0 5px ${color}`);
        });
    }

    addBoxShadow();
});