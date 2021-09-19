import {sndRqst} from "./send-form";

$(document).ready(function () {
    //Variable
    let scholProfilBtn = $('.school-profile button');
    let scholProfilInp = $('.school-profile input');

    //Event listener
    scholProfilBtn.on('click', deSchlPrfilBtnClckHandler);
    scholProfilInp.on('change', deChngProfilImgHandler);
    $('.info').on('submit', deFrmSubmtHandler);

    //Event Handler
    function deSchlPrfilBtnClckHandler() {
        scholProfilInp.trigger('click');
    }

    function deChngProfilImgHandler() {
        $('.info .alert-danger').addClass('d-none');
        if (!this.files[0]){
            $('.info .alert-danger').html('Please choose a file').removeClass('d-none');
        }else if (!validateFile($(this).val())){
            $('.info .alert-danger').html('File format not supported').removeClass('d-none');
        }else{
            let url = URL.createObjectURL(this.files[0]);
            $('.school-profile img').attr('src', url);
            $('.school-profile img').on('load', e => URL.revokeObjectURL(e.currentTarget.src));
            $('.info button[type = "submit"]').removeClass('d-none');
        }
    }

    function deFrmSubmtHandler(event) {
        event.preventDefault();
        if (isEmpty('.info')){
            $('.info .alert-danger').html('Please fill out the field below').removeClass('d-none');
        }else if (!emailRegEx.test($('.create form input[name = email]').val())){
            $('.info .alert-danger').html('Please enter a valid Email').removeClass('d-none');
        }else{
            let res = sndRqst('chane/', '.info');
            console.log(res);
        }
    }

    //Function
    function validateFile(file){
        let extention = file.split('.');
        extention = extention[extention.length - 1];
        if (extention === 'png' || extention === 'jpg' || extention === 'jpeg'){
            return true;
        }else {
            return  false;
        }
    }
});