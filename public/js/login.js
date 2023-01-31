document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

$('#password').on('input', () => {
    if ($('#password').val().length < 8) {
        $('.div-msg').fadeIn(800);
        $('#pass-msg').html("<span style=\"color:red\">Are you Sure ?</span>");
        $('#pass-msg').fadeIn(400);
    } else {
        $('#pass-msg').html("<span style=\"color:green\">Bread 👍</span>");
    }
});


// google oauth
// function signIn() {
//     // Google's OAuth 2.0 endpoint for requesting an access token
//     var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

//     // Create <form> element to submit parameters to OAuth 2.0 endpoint.
//     var form = document.createElement('form');
//     form.setAttribute('method', 'GET'); // Send as a GET request.
//     form.setAttribute('action', oauth2Endpoint);

//     // Parameters to pass to OAuth 2.0 endpoint.
//     var params = {
//         'client_id': '732899449129-0k5guhiqil08ehm7q8cnpi9g6hs4m0sf.apps.googleusercontent.com',
//         'redirect_uri': '',
//         'response_type': 'token',
//         'scope': 'https://www.googleapis.com/auth/userinfo.profile',
//         'include_granted_scopes': 'true',
//         'state': 'pass-through value'
//     };

//     // Add form parameters as hidden input values.
//     for (var p in params) {
//         var input = document.createElement('input');
//         input.setAttribute('type', 'hidden');
//         input.setAttribute('name', p);
//         input.setAttribute('value', params[p]);
//         form.appendChild(input);
//     }

//     // Add form to page and submit it to open the OAuth 2.0 endpoint.
//     document.body.appendChild(form);
//     form.submit();
// }


function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    fetch('https://drug-lord.onrender.com/account/signup', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: {}
    })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))

}

function onFailure(error) {
    console.log(error);
}

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}