function createUser(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        console.log("Successfully created account");
        window.location.replace("/");
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        $('#error-text').text(errorMessage)
        console.log(errorCode);
        console.log(errorMessage);
        console.log(typeof errorMessage)
        console.log(typeof errorCode)
    });
}

firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    console.log("Logged in successfully");
    window.location.replace("/");
}).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    $('#error-text').text(errorMessage)
  });

$(document).ready( () => {
    $('#login-button').click(function() {
        var email = $('#email').val();
        var password = $('#password').val();
        createUser(email, password)
    });
});

$(document).ready( () => {
    $('#create-button').click(function() {
        var email = $('#email').val();
        var password = $('#password').val();
        loginUser(email, password)
    });
});