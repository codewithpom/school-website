import { sndRqst } from './send-form.js';

$(document).ready(function () {
    //Variable
    let emailRegEx = /[0-9a-zA-Z]+\@+[a-z]+\.+['com']/;

    //Event listeners
    $('.create form').on('submit', deFrmSubmtHandler);

    $('input').on('blur', deInpBlrHandler).on('focus', deInpFcsHandler);

    $('label').on('click', deLblClckHandler);

    //Event handler
    function deFrmSubmtHandler(event) {
        event.preventDefault();
        if (isEmpty('.create form')){
            $('.alert-danger').html('Please fill out the field below').removeClass('d-none');
        }else if (!emailRegEx.test($('.create form input[name = email]').val())){
            $('.alert-danger').html('Please enter a valid Email').removeClass('d-none');
        }else{
            let res = sndRqst('create/', '.create form');
            console.log(res);
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