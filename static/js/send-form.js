export function sndRqst(url, form) {
    let data = new FormData(document.querySelector('form')); // Create the data to send
    let xhtp; //To store the request object
    let response; //To return the response from server

    //Create the request object
    if (window.XMLHttpRequest){
        xhtp = new XMLHttpRequest();
    }else{
        xhtp = new ActiveXObject('Microsoft.XMLHTTP');
    }

    xhtp.open('POST', url);
    xhtp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhtp.send(data);

    xhtp.addEventListener('readystatechange', () => {
        if (xhtp.status === 200 && xhtp.readyState === 4){
            response = xhtp.responseText;
        }
    });

    return response;
}