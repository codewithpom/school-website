import { sndRqst } from "./send-form";

$(document).ready(function () {
   //Variable

   //Event listeners
    $('.join form').on('submit', deFrmSubmtHandler);

    $('input').on('blur', deInpBlrHandler).on('focus', deInpFcsHandler);

    $('label').on('click', deLblClckHandler);

   //Event handler
    function deFrmSubmtHandler(event) {
        if ($.trim($('.join form input').val()) === ''){
            event.preventDefault();
            $('.join form .alert-danger').html('Please enter a code to join!').removeClass('d-none');
        }else{
            let res = sndRqst('join/', '.join form');
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
});