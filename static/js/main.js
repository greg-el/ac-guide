ACTIVE_TAB = "fish";
CURRENT_HOUR = new Date().getHours() % 12;

$(function() {
    $('a#fish-button').bind('click', function() {
        $.getJSON('/fish',
            function(data) {
                ACTIVE_TAB = "fish"; 
                setActiveTabIcon(ACTIVE_TAB);
                $("#data-wrapper").empty()
                var $elem = $(document.getElementById("data-wrapper"))
                $.each(data, function(k, v) {
                    $elem.append(
                        $('<div/>', {'class': 'critter-wrapper'}).append([
                            $('<div/>', {'class': 'critter-name', 'text':k}),
                            $('<div/>', {'class': 'critter-container'}).append([
                                $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
                                $('<div/>', {'class': 'critter-data'}).append([
                                        $('<div/>', {'class': 'critter-block', 'text': "Location: " + v.location}),
                                        $('<div/>', {'class': 'critter-block', 'text': "Price: " + v.price}),
                                        $('<div/>', {'class': 'critter-block', 'text': "Shadow Size: " + v.shadow})
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
                                    $('<div/>', {'class': 'critter-block', 'text': "Location: " + v.location}),
                                    $('<div/>', {'class': 'critter-block', 'text': "Price: " + v.price}),
                                    $('<div/>', {'class': 'critter-block', 'text': "Shadow Size: " + v.shadow})
                            ])
                        ])    
                    ])
                ) 
            })
        });
    return false;
};

$(function() {
    $('a#bug-button').bind('click', function() {
        $.getJSON('/bugs',
            function(data) {
                ACTIVE_TAB = "bug"
                setActiveTabIcon(ACTIVE_TAB);
                $("#data-wrapper").empty()
                var $elem = $(document.getElementById("data-wrapper"))
                $.each(data, function(k, v) {
                    console.log(v)
                    $elem.append(
                        $('<div/>', {'class': 'critter-wrapper'}).append([
                            $('<div/>', {'class': 'critter-name', 'text':k}),
                            $('<div/>', {'class': 'critter-container'}).append([
                                $('<img/>', {'class': 'critter-icon', 'src': v.icon}),
                                $('<div/>', {'class': 'critter-data'}).append([
                                        $('<div/>', {'class': 'critter-block', 'text': "Location: " +v.location}),
                                        $('<div/>', {'class': 'critter-block', 'text': "Price: " + v.price})
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
                        $('<img/>', {'class': 'critter-icon', 'src': v.icon}),
                        $('<div/>', {'class': 'critter-data'}).append([
                                $('<div/>', {'class': 'critter-block', 'text': "Location: " +v.location}),
                                $('<div/>', {'class': 'critter-block', 'text': "Price: " + v.price})
                        ])
                    ])    
                ])
            ) 
        })
    });
return false;
};

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
  
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
  
function checkCookieExists() {
    var hempisphere = getCookie("hemisphere");
    if (hempisphere == "") {
        setCookie("hemisphere", "north", 365)
    }
};

function hemisphereCookieHandler() {
    document.getElementById("hemisphere-button").onclick = function() {
        var cookie = getCookie("hemisphere");
        if (cookie == "north") {
            setHempisphereIcon("south");
            setCookie("hemisphere", "south", 365);
            if (ACTIVE_TAB == "fish") {
                refreshFish();
            } else if (ACTIVE_TAB == "bug") {
                refreshBugs();
            }
        } else if (cookie == "south") {
            setHempisphereIcon("north");
            setCookie("hemisphere", "north", 365);
            if (ACTIVE_TAB == "fish") {
                refreshFish();
            } else if (ACTIVE_TAB == "bug") {
                refreshBugs();
            }
        } else {
            alert("Can't find any cookies");
        }
    }
};

function setHempisphereIcon(hemisphere) {
    if (hemisphere == "north") {
        $("#nhemisphere-icon").css("display", "block")
        $("#shemisphere-icon").css("display", "none");
    } else if (hemisphere == "south") {
        $("#shemisphere-icon").css("display", "block")
        $("#nhemisphere-icon").css("display", "none");
    } else {
        console.log("Can't change hemisphere button");
    }
};

function setActiveTabIcon(tab) {
    if (tab == "fish") {
        $("#fish-dark-icon").css("display", "none")
        $("#fish-light-icon").css("display", "block");
        $("#bug-light-icon").css("display", "none");
        $("#bug-dark-icon").css("display", "block")
    } else if (tab == "bug") {
        $("#bug-dark-icon").css("display", "none")
        $("#bug-light-icon").css("display", "block");
        $("#fish-light-icon").css("display", "none");
        $("#fish-dark-icon").css("display", "block")
    } else {
        console.log("Error setting tab icon")
    }
};

function refreshCurrentTab() {
    if (ACTIVE_TAB == "fish") {
        refreshFish();
    }
    if (ACTIVE_TAB == "bug") {
        refreshBugs();
    }
}

function datetime() {
    var days = ['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var dayElem = document.getElementById("day")
    var dateElem = document.getElementById("date")
    var timeElem = document.getElementById("time")
    var timeAMPM = document.getElementById("ampm")
    var d = new Date();
    var minutes = d.getMinutes()
    var hours = d.getHours()
    var date = d.getDate();
    var amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes;
    timeElem.textContent = strTime;
    timeAMPM.textContent = amPm;
    dayElem.textContent = days[d.getDay()];
    dateElem.textContent = date + " " + months[d.getMonth()];
    if (CURRENT_HOUR != hours) {
        refreshCurrentTab();
        CURRENT_HOUR = hours;
    }
    var t = setTimeout(datetime, 500);
}

$(function() {
    checkCookieExists();
    setHempisphereIcon(getCookie("hemisphere"));
    hemisphereCookieHandler();
    datetime();
    document.getElementById("fish-button").click();
});