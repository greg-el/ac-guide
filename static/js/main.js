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
                                        $('<div/>', {'class': 'location-container'}).append([
                                            $('<img/>', {'class': 'magnify-icon', 'src': './static/image/icons/magnifyicon.png'}),
                                            $('<div/>', {'class': 'critter-block', 'text': v.location})
                                        ]),                                        
                                        $('<div/>', {'class': 'price-container'}).append([
                                            $('<img/>', {'class': 'bell-icon', 'src': './static/image/icons/bellicon.png'}),
                                            $('<div/>', {'class': 'critter-block', 'text': v.price})
                                        ]),
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
                                    $('<div/>', {'class': 'location-container'}).append([
                                        $('<img/>', {'class': 'magnify-icon', 'src': './static/image/icons/magnifyicon.png'}),
                                        $('<div/>', {'class': 'critter-block', 'text': v.location})
                                    ]),                                        
                                    $('<div/>', {'class': 'price-container'}).append([
                                        $('<img/>', {'class': 'bell-icon', 'src': './static/image/icons/bellicon.png'}),
                                        $('<div/>', {'class': 'critter-block', 'text': v.price})
                                    ]),
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

$(function() {
    $('a#birth-button').bind('click', function() {
        $.getJSON('/villagers-sorted',
            function(data) {
                ACTIVE_TAB = "birth"; 
                setActiveTabIcon(ACTIVE_TAB);
                $("#data-wrapper").empty()
                var $elem = $(document.getElementById("data-wrapper"))
                $.each(data, function(k, v) {
                    console.log(v)
                    $elem.append(
                        $('<div/>', {'class': 'critter-wrapper'}).append([
                            $('<div/>', {'class': 'critter-name', 'text':v.name}),
                            $('<div/>', {'class': 'critter-container'}).append([
                                $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
                                $('<div/>', {'class': 'critter-data'}).append([
                                        $('<div/>', {'class': 'critter-block', 'text':  v.gender}),
                                        $('<div/>', {'class': 'critter-block', 'text':  v.personality}),
                                        $('<div/>', {'class': 'critter-block', 'text':  v.species}),
                                        $('<div/>', {'class': 'critter-block', 'text':  v.month + " " + ordinal_suffix_of(v.date)}),
                                        $('<div/>', {'class': 'critter-block', 'text':  '"' + v.catchphrase + '"'})
                                ])
                            ])    
                        ])
                    ) 
                })
            });
    return false;
    });
});

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

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
        fishTabActive()
        bugTabInactive()
        birthTabInactive()
    } else if (tab == "bug") {
        bugTabActive()
        fishTabInactive()
        birthTabInactive()
    } else if (tab == "birth") {
        bugTabInactive()
        fishTabInactive()
        birthTabActive()
    } else {
        console.log("Error setting tab icon")
    }
};

function bugTabActive() {
    $("#bug-dark-icon").css("display", "none")
    $("#bug-light-icon").css("display", "block");
}

function bugTabInactive() {
    $("#bug-light-icon").css("display", "none");
    $("#bug-dark-icon").css("display", "block")
}

function fishTabActive() {
    $("#fish-dark-icon").css("display", "none")
    $("#fish-light-icon").css("display", "block");
}

function fishTabInactive() {
    $("#fish-light-icon").css("display", "none");
    $("#fish-dark-icon").css("display", "block")
}

function birthTabInactive() {
    $("#birth-light-icon").css("display", "none");
    $("#birth-dark-icon").css("display", "block")
}

function birthTabActive() {
    $("#birth-light-icon").css("display", "block");
    $("#birth-dark-icon").css("display", "none")
}


function refreshCurrentTab() {
    if (ACTIVE_TAB == "fish") {
        refreshFish();
    }
    if (ACTIVE_TAB == "bug") {
        refreshBugs();
    }
    if (ACTIVE_TAB == "birth") {
        refreshBirthdays();
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