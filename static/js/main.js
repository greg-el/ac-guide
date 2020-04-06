const TAB_ACTIVE_COLOR = "rgb(238, 227, 183)"
const TAB_INACTIVE_COLOR = "rgb(165, 172, 143)"

$(function() {
    $('a#fish-button').bind('click', function() {
        $.getJSON('/fish',
            function(data) {
                $("#fish-button-style").css({"background-color":TAB_ACTIVE_COLOR})
                $("#bug-button-style").css({"background-color":TAB_INACTIVE_COLOR})
                $("#data-wrapper").empty()
                var $elem = $(document.getElementById("data-wrapper"))
                $.each(data, function(k, v) {
                    $elem.append(
                        $('<div/>', {'class': 'critter-wrapper'}).append([
                            $('<div/>', {'class': 'critter-name', 'text':k}),
                            $('<div/>', {'class': 'critter-container'}).append([
                                $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
                                $('<div/>', {'class': 'critter-data'}).append([
                                        $('<div/>', {'class': 'critter-block', 'text': v.location}),
                                        $('<div/>', {'class': 'critter-block', 'text': v.price}),
                                        $('<div/>', {'class': 'critter-block', 'text': v.shadow})
                                ])
                            ])    
                        ])
                    ) 
                })
            });
    return false;
    });
});

function refreshFish() {            
    $.getJSON('/fish',
        function(data) {
            $("#data-wrapper").empty()
            var $elem = $(document.getElementById("data-wrapper"))
            $.each(data, function(k, v) {
                $elem.append(
                    $('<div/>', {'class': 'critter-wrapper'}).append([
                        $('<div/>', {'class': 'critter-name', 'text':k}),
                        $('<div/>', {'class': 'critter-container'}).append([
                            $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
                            $('<div/>', {'class': 'critter-data'}).append([
                                    $('<div/>', {'class': 'critter-block', 'text': v.location}),
                                    $('<div/>', {'class': 'critter-block', 'text': v.price}),
                                    $('<div/>', {'class': 'critter-block', 'text': v.shadow})
                            ])
                        ])    
                    ])
                ) 
            })
        });
    return false;
}

$(function() {
    $('a#bug-button').bind('click', function() {
        $.getJSON('/bugs',
            function(data) {
                $("#bug-button-style").css({"background-color":"#EEE3B7"})
                $("#fish-button-style").css({"background-color":"#A5AC8F"})
                $("#data-wrapper").empty()
                var $elem = $(document.getElementById("data-wrapper"))
                $.each(data, function(k, v) {
                    $elem.append(
                        $('<div/>', {'class': 'critter-wrapper'}).append([
                            $('<div/>', {'class': 'critter-name', 'text':k}),
                            $('<div/>', {'class': 'critter-container'}).append([
                                $('<div/>', {'class': 'critter-icon', 'text': 'icon'}),
                                $('<div/>', {'class': 'critter-data'}).append([
                                        $('<div/>', {'class': 'critter-block', 'text': v.location}),
                                        $('<div/>', {'class': 'critter-block', 'text': v.price})
                                ])
                            ])    
                        ])
                    ) 
                })
            });
    return false;
    });
});

function refreshBugs() {
    $.getJSON('/bugs',
    function(data) {
        $("#data-wrapper").empty()
        var $elem = $(document.getElementById("data-wrapper"))
        $.each(data, function(k, v) {
            $elem.append(
                $('<div/>', {'class': 'critter-wrapper'}).append([
                    $('<div/>', {'class': 'critter-name', 'text':k}),
                    $('<div/>', {'class': 'critter-container'}).append([
                        $('<div/>', {'class': 'critter-icon', 'text': 'icon'}),
                        $('<div/>', {'class': 'critter-data'}).append([
                                $('<div/>', {'class': 'critter-block', 'text': v.location}),
                                $('<div/>', {'class': 'critter-block', 'text': v.price})
                        ])
                    ])    
                ])
            ) 
        })
    });
return false;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
  
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
  }
  
function checkCookieExists() {
    var hempisphere = getCookie("hemisphere");
    if (hempisphere == "") {
        setCookie("hemisphere", "north", 365)
    }
 }

function hemisphereCookieHandler() {
    document.getElementById("hemisphere-button").onclick = function() {
        activeTab = getActiveTab()
        var cookie = getCookie("hemisphere");
        if (cookie == "north") {
            setCookie("hemisphere", "south", 365);
            if (activeTab == "fish") {
                refreshFish();
            } else if (activeTab == "bug") {
                refreshBugs();
            }
        } else if (cookie == "south") {
            setCookie("hemisphere", "north", 365);
            if (activeTab == "fish") {
                refreshFish();
            } else if (activeTab == "bug") {
                refreshBugs();
            }
        } else {
            alert("Can't find any cookies");
        }
    }
}

function getActiveTab() {
    if ($("#fish-button-style").css("background-color") == TAB_ACTIVE_COLOR) {
        return "fish";
    }
    if ($("#bug-button-style").css("background-color") == TAB_ACTIVE_COLOR) {
        return "bug";
    }
}

$(function() {
    checkCookieExists();
    hemisphereCookieHandler();
});