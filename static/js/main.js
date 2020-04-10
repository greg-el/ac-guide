ACTIVE_TAB = "fish";
CURRENT_HOUR = new Date().getHours() % 12;

/*
FISH FUNCTIONS -----------------------------------------------------------------
*/

$(function() {  //Fish tab click
    $('a#fish-button').bind('click', function() {
        $.getJSON('/fish/avaliable',
            function(data) {
                ACTIVE_TAB = "fish"; 
                setActiveTabIcon(ACTIVE_TAB);
                $('#collapse-button').unbind("click");
                $('#collapse-button').html("Unavaliable Fish")
                assignCollapseable();
                $("#data-wrapper").empty()
                $("#collapsible-content").empty();
                var $elem = $(document.getElementById("data-wrapper"))
                $.each(data, function(k, v) {
                    $elem.append(
                        $('<div/>', {'class': 'critter-wrapper'}).append([
                            $('<div/>', {'class': 'critter-name', 'text':k}),
                            $('<div/>', {'class': 'critter-container'}).append([
                                $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
                                $('<div/>', {'class': 'critter-data'}).append([
                                        $('<div/>', {'class': 'icon-container'}).append([
                                            $('<img/>', {'class': 'magnify-icon', 'src': './static/image/icons/pin.png'}).append(
                                                $('<span/>', {'class': 'tooltip', 'text': 'Location'})
                                            ),
                                            $('<img/>', {'class': 'bell-icon', 'src': './static/image/icons/bellicon.png'}).append(
                                                $('<span/>', {'class': 'tooltip', 'text': 'Price'})
                                            ),
                                            $('<img/>', {'class': 'shadow-icon', 'src': './static/image/icons/shadow.png'}).append(
                                                $('<span/>', {'class': 'tooltip', 'text': 'Shadow Size'})
                                            ),
                                        ]),                                        
                                        $('<div/>', {'class': 'text-container'}).append([
                                            $('<div/>', {'class': 'data-text', 'text': v.location}),
                                            $('<div/>', {'class': 'data-text', 'text': v.price}),
                                            $('<div/>', {'class': 'data-text', 'text': v.shadow})
                                        ]),

                                ])
                            ])    
                        ])
                    ) 
                })
            });
    return false;
    });
});

async function getUnavaliableFish() {
    $.getJSON('/fish/unavaliable',
            function(data) {
                var $elem = $(document.getElementById("collapsible-content"))
                $.each(data, function(k, v) {
                    $elem.append(
                        $('<div/>', {'class': 'critter-wrapper'}).append([
                            $('<div/>', {'class': 'critter-name', 'text':k}),
                            $('<div/>', {'class': 'critter-container'}).append([
                                $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
                                $('<div/>', {'class': 'critter-data'}).append([
                                        $('<div/>', {'class': 'icon-container'}).append([
                                            $('<img/>', {'class': 'magnify-icon', 'src': './static/image/icons/pin.png'}).append(
                                                $('<span/>', {'class': 'tooltip', 'text': 'Location'})
                                            ),
                                            $('<img/>', {'class': 'bell-icon', 'src': './static/image/icons/bellicon.png'}).append(
                                                $('<span/>', {'class': 'tooltip', 'text': 'Price'})
                                            ),
                                            $('<img/>', {'class': 'shadow-icon', 'src': './static/image/icons/shadow.png'}).append(
                                                $('<span/>', {'class': 'tooltip', 'text': 'Shadow Size'})
                                            ),
                                        ]),                                        
                                        $('<div/>', {'class': 'text-container'}).append([
                                            $('<div/>', {'class': 'data-text', 'text': v.location}),
                                            $('<div/>', {'class': 'data-text', 'text': v.price}),
                                            $('<div/>', {'class': 'data-text', 'text': v.shadow})
                                        ]),
                                ])
                            ])    
                        ])
                    ) 
                })
            });
}

function refreshFish() {            
    $.getJSON('/fish/avaliable',
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
                                    $('<div/>', {'class': 'icon-container'}).append([
                                        $('<img/>', {'class': 'magnify-icon', 'src': './static/image/icons/pin.png'}).append(
                                            $('<span/>', {'class': 'tooltip', 'text': 'Location'})
                                        ),
                                        $('<img/>', {'class': 'bell-icon', 'src': './static/image/icons/bellicon.png'}).append(
                                            $('<span/>', {'class': 'tooltip', 'text': 'Price'})
                                        ),
                                        $('<img/>', {'class': 'shadow-icon', 'src': './static/image/icons/shadow.png'}).append(
                                            $('<span/>', {'class': 'tooltip', 'text': 'Shadow Size'})
                                        ),
                                    ]),                                        
                                    $('<div/>', {'class': 'text-container'}).append([
                                        $('<div/>', {'class': 'data-text', 'text': v.location}),
                                        $('<div/>', {'class': 'data-text', 'text': v.price}),
                                        $('<div/>', {'class': 'data-text', 'text': v.shadow})
                                    ]),

                            ])
                        ])    
                    ])
                ) 
            })
        });
    return false;
};


/*
BUG FUNCTIONS -----------------------------------------------------------------
*/

$(function() { //Bug tab click
    $('a#bug-button').bind('click', function() {
        $.getJSON('/bugs/avaliable',
            function(data) {
                ACTIVE_TAB = "bug"
                setActiveTabIcon(ACTIVE_TAB);
                $('#collapse-button').unbind("click");
                $('#collapse-button').html("Unavaliable Bugs")
                assignCollapseable();
                $("#data-wrapper").empty()
                $("#collapsible-content").empty();
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
    });
});

async function getUnavaliableBugs() {
    $.getJSON('/bugs/unavaliable',
        function(data) {
            console.log(data)
            var $elem = $(document.getElementById("collapsible-content"))
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
};

function refreshBugs() {
    $.getJSON('/bugs/avaliable',
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

/*
BIRTHDAY FUNCTIONS -----------------------------------------------------------------
*/


$(function() { //Birthdays tab click 
    $('a#birth-button').bind('click', function() {
        $.getJSON('/villagers-sorted/30',
            function(data) {
                ACTIVE_TAB = "birth"; 
                setActiveTabIcon(ACTIVE_TAB);
                $('#collapse-button').unbind("click");
                $('#collapse-button').html("Other Birthdays")
                assignCollapseable();
                $("#data-wrapper").empty()
                $("#collapsible-content").empty();
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
                                        $('<div/>', {'class': 'critter-block', 'text':  v.month + " " + ordinalSuffixOf(v.date)}),
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

async function getBirthdaysAfterN() {
        $.getJSON('/villagers-sorted-after/30',
            function(data) {
                var $elem = $(document.getElementById("collapsible-content"))
                $.each(data, function(k, v) {
                    $elem.append(
                        $('<div/>', {'class': 'critter-wrapper'}).append([
                            $('<div/>', {'class': 'critter-name', 'text':v.name}),
                            $('<div/>', {'class': 'critter-container'}).append([
                                $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
                                $('<div/>', {'class': 'critter-data'}).append([
                                        $('<div/>', {'class': 'critter-block', 'text':  v.gender}),
                                        $('<div/>', {'class': 'critter-block', 'text':  v.personality}),
                                        $('<div/>', {'class': 'critter-block', 'text':  v.species}),
                                        $('<div/>', {'class': 'critter-block', 'text':  v.month + " " + ordinalSuffixOf(v.date)}),
                                        $('<div/>', {'class': 'critter-block', 'text':  '"' + v.catchphrase + '"'})
                                ])
                            ])    
                        ])
                    ) 
                })
    });
};



/*
COOKIE FUNCTIONS -----------------------------------------------------------------
*/

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

/*
TAB ICON FUNCTIONS -----------------------------------------------------------------
*/

function setActiveTabIcon(tab) {
    if (tab == "fish") {
        makeTabIconActive("fish")
        makeTabIconInactive("bug")
        makeTabIconInactive("birth")
    } else if (tab == "bug") {
        makeTabIconActive("bug")
        makeTabIconInactive("fish")
        makeTabIconInactive("birth")
    } else if (tab == "birth") {
        makeTabIconActive("birth")
        makeTabIconInactive("bug")
        makeTabIconInactive("fish")
    } else {
        console.log("Error setting tab icon")
    }
};

function makeTabIconActive(tab) {
    $("#" + tab + "-dark-icon").css("display", "none")
    $("#" + tab + "-light-icon").css("display", "block");
}

function makeTabIconInactive(tab) {
    $("#" + tab + "-dark-icon").css("display", "block")
    $("#" + tab + "-light-icon").css("display", "none");
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

function ordinalSuffixOf(i) {
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



function assignCollapseable() {
    $('#collapse-button').bind('click', async function() {
        if (ACTIVE_TAB == "fish") {
            await getUnavaliableFish();
            testCollapse();
        } else if (ACTIVE_TAB == "bug") {
            await getUnavaliableBugs();
            testCollapse();
        } else if (ACTIVE_TAB == "birth") {
            await getBirthdaysAfterN();
            testCollapse();
        }
    })
};


async function testCollapse() {
    var elem = document.getElementById("collapse-button");
    elem.classList.toggle("active");
    var panel = elem.nextElementSibling;
    if (panel.style.display === "flex") {
      panel.style.display = "none";
      $("#collapsible-content").empty();
    } else {
      panel.style.display = "flex";
    }
    //elem.classList.toggle("active");
    //var panel = elem.nextElementSibling;
    //if (panel.style.maxHeight) {
    //    panel.style.maxHeight = null;
    //} else {
    //    panel.style.maxHeight = panel.scrollHeight + "px";
    //    //panel.style.maxHeight = "1000" + "px";
    //};
};


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