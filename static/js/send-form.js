export  let btnHtml = $('button[type = "submit"]').html();

export async function sndRqst(url, form) {
    //Loading animation
    $('button[type = "submit"]').html('<img src="../static/img/Rolling-1s-200px.svg" alt="">').addClass('loading');

    let data = new FormData(document.querySelector('form')); // Create the data to send
    let xhtp; //To store the request object
    let response; //To return the response from server

    //Create the request object
    if (window.XMLHttpRequest){
        xhtp = new XMLHttpRequest();
    }else{
        xhtp = new ActiveXObject('Microsoft.XMLHTTP');
    }

    await xhtp.open('POST', url);
    await xhtp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    await xhtp.send(data);

    await xhtp.addEventListener('readystatechange', () => {
        if (xhtp.status === 200 && xhtp.readyState === 4){
            response = xhtp.responseText;
        }
    });

    return await 'Done';
}