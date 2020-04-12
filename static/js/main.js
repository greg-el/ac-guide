ACTIVE_TAB = 0;
CURRENT_HOUR = new Date().getHours() % 12;    
CURRENT_HOUR = CURRENT_HOUR ? CURRENT_HOUR : 12;

$(document).ready(function(){
    $('#tabs').slick({
      dots: false,
      arrows: false,
      centerMode: true,
      centerPadding: '0px',
      infinite: false,
      speed: 300,
      touchThreshold: 5,
      waitForAnimate: true,
      edgeFriction: 0.05,
    });
    $('#tabs').on('afterChange', function(slick, currentSlide){
        setActiveTab(currentSlide.currentSlide)
        setActiveTabIcon(currentSlide.currentSlide)
      });
});




/*
FISH FUNCTIONS -----------------------------------------------------------------
*/

$(function() {  //Fish tab click
    $('a#fish-button').bind('click', function() {
        $('#tabs').slick('slickGoTo',0);
        setActiveTab();
        setActiveTabIcon(getActiveTab());
        //$('#fish-collapse-button').bind('click', testCollapse("fish"))
    });
    return false;
});

async function getFish() {
    console.log("hi")
    $.getJSON('/fish/avaliable',
        function(data) {
            var $elem = $(document.getElementById("fish-data-wrapper"));
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

async function getUnavaliableFish() {
    $.getJSON('/fish/unavaliable',
            function(data) {
                var $elem = $(document.getElementById("fish-collapsible-content"))
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
    console.log("hi2")
    $.getJSON('/fish/avaliable',
        function(data) {
            $("#data-wrapper").empty()
            var $elem = $(document.getElementById("fish-data-wrapper"))
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
        $('#tabs').slick('slickGoTo',1);
        setActiveTab();
        setActiveTabIcon(getActiveTab());
    });
    return false;
});

async function getBugs() {
    $.getJSON('/bugs/avaliable',
    function(data) {
        var $elem = $(document.getElementById("bug-data-wrapper"))
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
}

async function getUnavaliableBugs() {
    $.getJSON('/bugs/unavaliable',
        function(data) {
            var $elem = $(document.getElementById("bug-collapsible-content"))
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
        var $elem = $(document.getElementById("bug-data-wrapper"))
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
        $('#tabs').slick('slickGoTo',2);
        setActiveTab();
        setActiveTabIcon(getActiveTab());
    });
    return false;
});

async function getBirthdays() {
    $.getJSON('/villagers-sorted/30',
        function(data) {
            var $elem = $(document.getElementById("birth-data-wrapper"))
            $.each(data, function(k, v) {
                $elem.append(
                    $('<div/>', {'class': 'villager-wrapper'}).append([
                        $('<div/>', {'class': 'villager-name', 'text':v.name}),
                        $('<div/>', {'class': 'villager-container'}).append([
                            $('<img/>', {'class': 'villager-icon', 'src':v.icon}),
                            $('<div/>', {'class': 'villager-data'}).append([
                                $('<img/>', {'class': 'villager-gender-icon', 'src': v.gender}),
                                $('<div/>', {'class': 'villager-birthday-container'}).append([
                                    $('<img/>', {'class': 'villager-birthday-icon', 'src': './static/image/icons/birthdayicon.png'}),
                                    $('<div/>', {'class': 'villager-block', 'text':  v.month + " " + ordinalSuffixOf(v.date)})
                                ])
                            ]).append(
                                $('<div/>', {'class': 'villager-species-container'}).append([
                                    $('<img/>', {'class': 'villager-species-icon', 'src': './static/image/icons/birthdayicon.png'}),
                                    $('<div/>', {'class': 'villager-block', 'text':  v.species})
                                ])
                            ).append(
                                $('<div/>', {'class': 'villager-personality-container'}).append([
                                    $('<img/>', {'class': 'villager-personality-icon', 'src': './static/image/icons/personalityicon.png'}),
                                    $('<div/>', {'class': 'villager-block', 'text':  v.personality})
                                ])
                            ).append(
                                    $('<div/>', {'class': 'villager-block', 'text':  '"' + v.catchphrase + '"'})
                            )
                        ])
                    ])
                ) 
            });
        });
    return true;
};
        

async function getBirthdaysAfterN() {
        $.getJSON('/villagers-sorted-after/30',
            function(data) {
                var $elem = $(document.getElementById("birth-collapsible-content"))
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
        return false;
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
            if (getActiveTab() == "fish") {
                refreshFish();
            } else if (getActiveTab() == "bug") {
                refreshBugs();
            }
        } else if (cookie == "south") {
            setHempisphereIcon("north");
            setCookie("hemisphere", "north", 365);
            if (getActiveTab() == "fish") {
                refreshFish();
            } else if (getActiveTab() == "bug") {
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

function setActiveTabIcon() {
    var tab = getActiveTab()
    if (tab == "fish") {
        console.log("fish")
        makeTabIconActive("fish");
        makeTabIconInactive("bug");
        makeTabIconInactive("birth");
    } else if (tab == "bug") {
        console.log("bug")
        makeTabIconActive("bug");
        makeTabIconInactive("fish");
        makeTabIconInactive("birth");
    } else if (tab == "birth") {
        console.log("birth")
        makeTabIconActive("birth");
        makeTabIconInactive("bug");
        makeTabIconInactive("fish");
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
    if (getActiveTab() == "fish") {
        refreshFish();
    }
    if (getActiveTab() == "bug") {
        refreshBugs();
    }
    if (getActiveTab() == "birth") {
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



async function testCollapse(tab) {
    var elem = document.getElementById(tab + "-collapse-button");
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

function isMobile() {
     if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        return true
     } 
     return false
}

function getActiveTab() {
    if (ACTIVE_TAB == 0) {
        return "fish";
    } else if (ACTIVE_TAB == 1) {
        return "bug";
    } else if (ACTIVE_TAB == 2) {
        return "birth";
    }
}

function setActiveTab() {
    ACTIVE_TAB = $('#tabs').slick('slickCurrentSlide');
}

$(function() {
    checkCookieExists();
    setHempisphereIcon(getCookie("hemisphere"));
    hemisphereCookieHandler();
    datetime();
    getFish();
    getBugs();
    getBirthdays();
    //document.getElementById("fish-button").click();
});