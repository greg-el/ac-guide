function createUser(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
            $.ajax({
                url: "/verify/"+user.id,
                headers: {
                    token: idToken
                },
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                }
            })
        })
        //window.location.replace("/");
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        $('#error-text').text(errorMessage)
    });
}

function loginUser(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
        firebase.auth().currentUser.getIdToken(true).then(function(idToken) {

            $.ajax({
                url: "/verify",
                headers: {
                    token: idToken
                },
                success: function(data) {
                    console.log(data);
                }
            })
        })
        //window.location.replace("/");
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        $('#error-text').text(errorMessage)
    });
};

$(document).ready( () => {
    $('#login-button').click(function() {
        var email = $('#email').val();
        var password = $('#password').val();
        loginUser(email, password)
    });
});

$(document).ready( () => {
    $('#create-button').click(function() {
        var email = $('#email').val();
        var password = $('#password').val();
        createUser(email, password)
    });
});

$(document).ready( () => {
    $('#create-prompt').click(function() {
        $('#login-button').css('display', 'none');
        $('#create-button').css('display', 'block')
    });
});