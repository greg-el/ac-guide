function createUser(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
        user.user.getIdToken(true).then(idToken => {
            $.ajax({
                url: "/session",
                headers: {
                    token: idToken
                },
                success: () => {
                    $.ajax({
                        url: "/add",
                        headers: {
                            token: idToken
                        },
                        success: () => {
                            console.log("Successfully added user");
                            window.location.replace("/");
                        }
                    })
                }
            })
        })
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        $('#error-text').text(errorMessage)
    });
}

function loginUser(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
        user.user.getIdToken(true).then(idToken => {
            $.ajax({
                url: "/session",
                headers: {
                    token: idToken
                },
                success: () => {
                    window.location.replace("/");
                }
            })
        })
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

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};