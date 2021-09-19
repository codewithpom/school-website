import { sndRqst, btnHtml } from "./send-form.js";

$(document).ready(function () {
    //Variable

    //Event listeners
    $('.auth form').on('submit', deFrmSubmtHandler);

    $('input').on('blur', deInpBlrHandler).on('focus', deInpFcsHandler);

    $('label').on('click', deLblClckHandler);

    //Event handler
    function deFrmSubmtHandler(event) {
        event.preventDefault();
        if ($.trim($('.auth form input').val()) === ''){
            $('.auth form .alert-danger').html('Please enter a code to join!').removeClass('d-none');
        }else{
            sndRqst('auth/', '.auth form').then(res => {
                $('button[type = "submit"]').html(btnHtml).removeClass('loading');
                if (res === 'Done'){
                    shwSucess();
                }else{
                    $('.auth form .alert-danger').html('Something went wrong!').removeClass('d-none');
                }
            });
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
    function shwSucess() {
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Bootstrap Example</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../static/libraries/bootstrap/css/index.css">
    <link rel="stylesheet" href="../static/css/email-checked.css">
</head>
<body>

<div class="container">
    <div class="row d-flex align-items-center">
        <div class="col-10 offset-1 col-md-8 offset-md-2 bg-white p-5 rounded mail-sent">
            <p class="h2 text-center text-secondary">Your Account Verified</p>
            <img class="mt-4" src="../static/img/open-email-message-svgrepo-com.svg" alt="">
            <p class="h5 text-center text-secondary mt-5">Welcome to our customers community, You can <a class="text-secondary" href="user.html">Login</a></p>
        </div>
    </div>
</div>

</body>
</html>
`;

        document.write(html);
    }
});