$(document).ready(function () {
   //Variable

   //Event listeners
    $('.join form').on('submit', deFrmSubmtHandler);

   //Event handler
    function deFrmSubmtHandler(event) {
        if ($.trim($('.join form input').val()) == ''){
            event.preventDefault();
            $('.join form .alert-danger').html('Please enter a code to join!').removeClass('d-none');
        }
    }

   //Function
});