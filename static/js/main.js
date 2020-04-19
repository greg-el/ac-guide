ACTIVE_TAB = "fish";
CURRENT_HOUR = new Date().getHours() % 12;    
CURRENT_HOUR = CURRENT_HOUR ? CURRENT_HOUR : 12;

//$(document).ready(function(){
//    $('#tabs').slick({
//      dots: false,
//      arrows: false,
//      centerMode: true,
//      centerPadding: '0px',
//      infinite: false,
//      speed: 300,
//      touchThreshold: 5,
//      waitForAnimate: true,
//      edgeFriction: 0.05,
//    });
//    $('#tabs').on('afterChange', function(slick, currentSlide){
//        setActiveTab(currentSlide.currentSlide)
//        setActiveTabIcon(currentSlide.currentSlide)
//      });
//});




/*
FISH FUNCTIONS -----------------------------------------------------------------
*/

$(function() {  //Fish tab click
    $('a#fish-button').bind('click', function() {
        setActiveTab("fish");
        setActiveTabIcon("fish");
        //$('#fish-collapse-button').bind('click', testCollapse("fish"))
    });
    return false;
});

async function generateFishHTML(element, k, v) {
    var finalTime = "";
    if (v.time.length == 24) {
        finalTime = "All day";
    } else {
        var startTime = v.time[0];
        var endTime = v.time[v.time.length-1];
        var startAMPM = startTime >= 12 ? "PM" : "AM";
        startTime = startTime % 12
        startTime = startTime ? startTime : 12;
        finalStart = startTime + startAMPM;

        var endAMPM = endTime >= 12 ? "PM" : "AM";
        endTime = endTime % 12
        endTime = endTime ? endTime : 12;
        finalEnd = endTime + endAMPM;

        finalTime = finalStart + "-" + finalEnd;
    }

    var finalLocation = {}
    var finalLocationAlt = {}

    if (v.location.includes("(")) {
        var locationSplit = v.location.split("(");
        var location = locationSplit[0];
        var locationModifier = locationSplit[1];
        if (typeof v.locationAlt == "undefined") {
            finalLocation = $('<div/>', {'class': 'location-container-mod'}).append([
                $('<div/>', {'class': 'data-text', 'text': location}),
                $('<div/>', {'class': 'data-text-modifier', 'text': "(" + locationModifier})
            ])
        } else {
            finalLocation = $('<div/>', {'class': 'location-container-mod'}).append([
                $('<div/>', {'class': 'data-text', 'text': location.trim() + ","}),
                $('<div/>', {'class': 'data-text-modifier', 'text': "(" + locationModifier})
            ])
        }
    } else {
        finalLocation = $('<div/>', {'class': 'data-text', 'text': v.location});
    }

    if (typeof v.locationAlt != "undefined") {
        if (v.locationAlt.includes("(")) {
            var locationAltSplit = v.locationAlt.split("(");
            var locationAlt = locationAltSplit[0];
            var locationAltModifier = locationAltSplit[1];
            finalLocationAlt = $('<div/>', {'class': 'location-container-mod'}).append([
                        $('<div/>', {'class': 'data-text', 'text': locationAlt}),
                        $('<div/>', {'class': 'data-text-modifier', 'text': "(" + locationAltModifier})
            ])
        } else {
            finalLocationAlt = $('<div/>', {'class': 'data-text', 'text': v.locationAlt});
        }
    }

    if (typeof v.locationAlt == "undefined") {
        element.append(
            $('<div/>', {'class': 'critter-wrapper', 'id':k}).append([
                $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
                $('<div/>', {'class': 'critter-data'}).append([
                    $('<div/>', {'class': 'critter-data-wrapper'}).append([
                        $('<div/>', {'class': 'data-grid'}).append([
                            $('<div/>', {'class': 'name-container critter-name'}).append(
                                $('<div/>', {'class': 'critter-name', 'text':k})
                            ),
                            $('<div/>', {'class': 'location-container icon-text'}).append([
                                $('<img/>', {'class': 'magnify-icon', 'src': './static/image/icons/svg/pin.svg'}),
                                finalLocation
                                ]),
                            $('<div/>', {'class': 'bell-container icon-text'}).append([
                                $('<img/>', {'class': 'bell-icon', 'src': './static/image/icons/svg/bell.svg'}),
                                $('<div/>', {'class': 'data-text', 'text': v.price})
                                ]),
                            $('<div/>', {'class': 'time-container icon-text'}).append([
                                $('<img/>', {'class': 'time-icon', 'src': './static/image/icons/svg/timer.svg'}),
                                $('<div/>', {'class': 'data-text', 'text': finalTime})
                                ]),
                            $('<div/>', {'class': 'shadow-container icon-text'}).append([
                                $('<img/>', {'class': 'shadow-icon', 'src': './static/image/icons/svg/shadow.svg'}),
                                $('<div/>', {'class': 'data-text', 'text': v.shadow})
                            ])
                        ])
                    ])
                ])
            ])
        )
    } else {
        var locationHTML = [finalLocation, finalLocationAlt];
        var comma = $('<div/>', {'class': 'data-text', 'text': ",", "style": "width:5px;"})

        if (v.location.includes("(")) {
            locationHTML = [finalLocation, finalLocationAlt];
        } 


        element.append(
            $('<div/>', {'class': 'critter-wrapper', 'id':k}).append([
                $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
                $('<div/>', {'class': 'critter-data'}).append([
                    $('<div/>', {'class': 'critter-data-wrapper'}).append([
                        $('<div/>', {'class': 'data-grid'}).append([
                            $('<div/>', {'class': 'name-container critter-name'}).append(
                                $('<div/>', {'class': 'critter-name', 'text':k})
                            ),
                            $('<div/>', {'class': 'location-container icon-text'}).append(
                                $('<img/>', {'class': 'magnify-icon', 'src': './static/image/icons/svg/pin.svg'}),
                                locationHTML[0],
                                locationHTML[1]
                            ),
                            $('<div/>', {'class': 'bell-container icon-text'}).append([
                                $('<img/>', {'class': 'bell-icon', 'src': './static/image/icons/svg/bell.svg'}),
                                $('<div/>', {'class': 'data-text', 'text': v.price})
                                ]),
                            $('<div/>', {'class': 'time-container icon-text'}).append([
                                $('<img/>', {'class': 'time-icon', 'src': './static/image/icons/svg/timer.svg'}),
                                $('<div/>', {'class': 'data-text', 'text': finalTime})
                                ]),
                            $('<div/>', {'class': 'shadow-container icon-text'}).append([
                                $('<img/>', {'class': 'shadow-icon', 'src': './static/image/icons/svg/shadow.svg'}),
                                $('<div/>', {'class': 'data-text', 'text': v.shadow})
                            ])
                        ])
                    ])
                ])
            ])
        )
    }
};

async function getAllFish() {
    $.getJSON('/fish/all',
        function(data) {
            var $elem = $(document.getElementById("fish-data-wrapper"));
            $.each(data, function(k, v) {
                generateFishHTML($elem, k, v);
            })
        });
    return false;
};

async function getFish() {
    $.getJSON('/fish/avaliable',
        function(data) {
            var $elem = $(document.getElementById("fish-data-wrapper"));
            $.each(data, function(k, v) {
                generateFishHTML($elem, k, v);
            })
        });
    return false;
};

async function getUnavaliableFish() {
    $.getJSON('/fish/unavaliable',
            function(data) {
                var $elem = $(document.getElementById("fish-collapsible-content"))
                $.each(data, function(k, v) {
                    generateFishHTML($elem, k, v);
            });
    });
};

function refreshFish() {            
    $.getJSON('/fish/avaliable',
        function(data) {
            $("#data-wrapper").empty()
            var $elem = $(document.getElementById("fish-data-wrapper"))
            $.each(data, function(k, v) {
                generateFishHTML($elem, k, v);
            });
        });
    return false;
};


/*
bugs FUNCTIONS -----------------------------------------------------------------
*/

$(function() { //bugs tab click
    $('a#bugs-button, #bug-icon').click(function() {
        //$('#tabs').slick('slickGoTo',1);
        setActiveTab("bugs");
        setActiveTabIcon("bugs");
    });
    return false;
});

function generateBugsHTML($elem, k, v) {
    var finalTime = "";
    if (v.time.length == 24) {
        finalTime = "All day";
    } else {
        var startTime = v.time[0];
        var endTime = v.time[v.time.length-1];
        var startAMPM = startTime >= 12 ? "PM" : "AM";
        startTime = startTime % 12
        startTime = startTime ? startTime : 12;
        finalStart = startTime + startAMPM;

        var endAMPM = endTime >= 12 ? "PM" : "AM";
        endTime = endTime % 12
        endTime = endTime ? endTime : 12;
        finalEnd = endTime + endAMPM;

        finalTime = finalStart + "-" + finalEnd;
    }
    $elem.append(
        $('<div/>', {'class': 'critter-wrapper', 'id':k}).append([
            $('<div/>', {'class': 'critter-name', 'text':k}),
            $('<div/>', {'class': 'critter-container'}).append([
                $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
                $('<div/>', {'class': 'critter-data'}).append([
                    $('<div/>', {'class': 'location-container icon-text'}).append([
                        $('<img/>', {'class': 'magnify-icon', 'src': './static/image/icons/pin.png'}),
                        $('<div/>', {'class': 'data-text', 'text': v.location})
                        ]),
                    $('<div/>', {'class': 'bell-container icon-text'}).append([
                        $('<img/>', {'class': 'bell-icon', 'src': './static/image/icons/bellicon.png'}),
                        $('<div/>', {'class': 'data-text', 'text': v.price})
                        ]),
                    $('<div/>', {'class': 'time-container icon-text'}).append([
                        $('<img/>', {'class': 'time-icon', 'src': './static/image/icons/timericon.png'}),
                        $('<div/>', {'class': 'data-text', 'text': finalTime})
                    ])
                ])
            ])    
        ])
    )
};

async function getAllBugs() {
    $.getJSON('/bugs/all', function(data) {
        var $elem = $("#bugs-data-wrapper");
        $.each(data, function(k, v) {
            generateBugsHTML($elem, k, v);
        });
    });
};

async function getAvaliableBugs() {
    $.getJSON('/bugs/avaliable', function(data) {
        var $elem = $("#bugs-data-wrapper");
        $.each(data, function(k, v) {
            generateBugsHTML($elem, k, v);
        });
    });
};

async function getUnavaliableBugs() {
    $.getJSON('/bugs/unavaliable', function(data) {
        var $elem = $("#bugs-collapsible-content");
        $.each(data, function(k, v) {
            generateBugsHTML($elem, k, v);
        })
    });
};

function refreshBugs() {
    $.getJSON('/bugs/avaliable',
    function(data) {
        $("#data-wrapper").empty()
        var $elem = $(document.getElementById("bugs-data-wrapper"))
        $.each(data, function(k, v) {
            generateBugsHTML($elem, k, v);
        })
    });
};

/*
BIRTHDAY FUNCTIONS -----------------------------------------------------------------
*/


$(function() { //Birthdays tab click 
    $('a#villagers-button').bind('click', function() {
        $('#tabs').slick('slickGoTo',2);
        setActiveTab();
        setActiveTabIcon(getActiveTab());
    });
    return false;
});

function generateVillagerHTML($elem, k, v) {
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
                        $('<img/>', {'class': 'villager-species-icon', 'src': './static/image/icons/pawicon.png'}),
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
};

async function getVillagers() {
    $.getJSON('/villagers-sorted/30', function(data) {
        var $elem = $("#villager-data-wrapper");
            $.each(data, function(k, v) {
                generateVillagerHTML($elem, k, v);
        });
    });
};
        
async function getBirthdaysAfterN() {
    $.getJSON('/villagers-sorted-after/30',function(data) {
        var $elem = $("#villager-data-wrapper");
        $.each(data, function(k, v) {
            generateVillagerHTML($elem, k , v);
        });
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
            } else if (getActiveTab() == "bugs") {
                refreshBugs();
            }
        } else if (cookie == "south") {
            setHempisphereIcon("north");
            setCookie("hemisphere", "north", 365);
            if (getActiveTab() == "fish") {
                refreshFish();
            } else if (getActiveTab() == "bugs") {
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
        console.log("fish")
        makeTabIconActive("fish");
        makeTabIconInactive("bugs");
        makeTabIconInactive("villagers");
    } else if (tab == "bugs") {
        console.log("bugs")
        makeTabIconActive("bugs");
        makeTabIconInactive("fish");
        makeTabIconInactive("villagers");
    } else if (tab == "villagers") {
        console.log("villagers")
        makeTabIconActive("villagers");
        makeTabIconInactive("bugs");
        makeTabIconInactive("fish");
    } else {
        console.log("Error setting tab icon")
    }
};

function makeTabIconActive(tab) {
    $('#' + tab + '-container').css('background-color', '#32A4A4');
    $('#' + tab + '-icon').css('opacity', '1');

}

function makeTabIconInactive(tab) {
    $('#' + tab + '-container').css('background-color', '#5CB9AD');
    $('#' + tab + '-icon').css('opacity', '0.5');
}

/*
SEARCH BOX -----------------------------------------------------------------
*/

$(document).ready( () => {
    $('#fish-search').on('keyup', function() {
        var value = $(this).val().toLowerCase();
        $.getJSON('/fish/all', function(data) { 
            $.each(data, function(k, v) {
                if (k.toLowerCase().includes(value)) {
                    document.getElementById(k).style.display = "flex";
                } else {
                    document.getElementById(k).style.display = "none";
                }
            })
        })
    });
    $('#fish-search').on('click', function() {
        $('#fish-toggle').click();
        checkboxFilterShowAll("fish");
    });
});


/*
CHECK BOX -----------------------------------------------------------------
*/

function checkboxFilterShowAll(tab) {
    var $elemChildren = $("#" + tab + "-data-wrapper").children();
    for (var i=0; i < $elemChildren.length; i++) {
        $elemChildren[i].style.display = "flex";
    }
    
}

function checkboxFilterShowAvaliable(tab) {
    var $alreadyChecked = [];
    var $elemChildren = $("#" + tab + "-data-wrapper").children();
    $.getJSON('/' + tab + '/avaliable', function(data) { 
        $.each(data, function(k, v) {
            for (var i=0; i < $elemChildren.length; i++) {
                if (k == $elemChildren[i].id) {
                    $elemChildren[i].style.display = "flex";
                    $alreadyChecked.push($elemChildren[i].id);
                    break;
                } else if (!$alreadyChecked.includes($elemChildren[i].id)) {
                    $elemChildren[i].style.display = "none";
                }
            }
        });
    });
};


$(document).ready( () => {
    $('#avaliable-checkbox').on('click', function() {
        if (this.checked) {
            checkboxFilterShowAvaliable("fish");
        } else {
            checkboxFilterShowAll("fish");
        };
    });

});



/*
OTHER -----------------------------------------------------------------
*/


function refreshCurrentTab() {
    if (getActiveTab() == "fish") {
        refreshFish();
    }
    if (getActiveTab() == "bugs") {
        refreshBugs();
    }
    if (getActiveTab() == "villagers") {
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


function datetime() {
    var dayIcons = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
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
    dateElem.textContent = date + " " + months[d.getMonth()];
    if (CURRENT_HOUR != hours) {
        refreshCurrentTab();
        CURRENT_HOUR = hours;
    }
    var t = setTimeout(datetime, 1000);

    if (dayElem.data === "") {
        dayElem.data = "./static/image/icons/days/" + dayIcons[d.getDay()] + ".svg"
    }


    if (document.getElementById("day").data != dayElem.data) {
        dayElem.data = "./static/image/icons/days/" + dayIcons[d.getDay()] + ".svg"
    }
    
}

function isMobile() {
     if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        return true
     } 
     return false
}

function getActiveTab() {
    return ACTIVE_TAB;
}

function setActiveTab(tab) {
    ACTIVE_TAB = tab;
}



$(function() {
    checkCookieExists();
    setHempisphereIcon(getCookie("hemisphere"));
    hemisphereCookieHandler();
    datetime();
    getAllFish();
    getAllBugs();
    getVillagers();
    checkboxFilterShowAvaliable("fish");
});