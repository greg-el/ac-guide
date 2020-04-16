function createUser(email, password) {

    console.log(email, password)
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
        // ...
      });
}

$(document).ready( () => {
    $('#submit').click(function() {
        var email = $('#email').val();
        var password = $('#password').val();
        createUser(email, password)
    });
});