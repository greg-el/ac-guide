ACTIVE_TAB = "fish";
CURRENT_HOUR = new Date().getHours() % 12;    
CURRENT_HOUR = CURRENT_HOUR ? CURRENT_HOUR : 12;
CURRENT_TIME = new Date();
var gotBugs = false;
var gotVillagers = false;
var prevTab = "fish"
/*
FIREBASE FUNCTIONS -----------------------------------------------------------------
*/

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $('#logout').css('display', 'block');
        $('#login-link').css('display', 'none');
        firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
            setCookie("user", idToken, false, "Strict");
        });
    } else {
        $('#logout').css('display', 'none');
        $('#login-link').css('display', 'block');
        console.log("No one signed in");
    }
});

$(document).ready(function() {
    $('#logout').click(function() {
        firebase.auth().signOut().then(function() {
            eraseCookie("user");
            console.log("signout successful");
        }).catch(function(error) {
            console.log(error.message)
        })
    })
});

function updateJSON(updateSpecies, updateCritter, updateValue) {
    var idToken = getCookie("user");
    if (idToken != "") {
        $.ajax({
            url: "/update",
            headers: {
                token: idToken,
                species: updateSpecies,
                critter: updateCritter,
                value: updateValue
            }
        })
    } else {
        console.log("No one signed in")
    }
}

function getCaught(speciesType) {
    return new Promise(function(resolve, reject) {
        var idToken = getCookie("user");
        if (idToken != "") {
            $.ajax({
                url: "/get",
                headers: {
                    token: idToken,
                    species: speciesType
                },
                success: function(data) {
                    resolve(JSON.parse(data));
                },
                error: function(data) {
                    reject(new Error("UID not in database"))
                }
            })
        } else {
            reject(new Error("No user"));
        }
    })
};

/*
CHORES FUNCTIONS -----------------------------------------------------------------
*/

$(function() {  //Chores tab click
    $('a#chores-button').bind('click', async function() {
        hidePrevTab();
        setPrevTabIconInactive();
        prevTab = "chores";
        choresTimers();
        setInterval(choresTimers, 1000);
        setActiveTab("chores");
        setActiveTabIcon("chores");
        showTab("chores");
        $('#search').css('display', 'none');
        $('.search-wrapper').css('justify-content', 'center');
        $('#chores-timer-wrapper').css('display', 'flex');
        $('#turnip-timer-wrapper').css('display', 'flex');
        var data = await getCaught("chores");
        $.each(data, function(k, v) {
            if (v == true) {
                $('#'+k).removeClass('chore-wrapper');
                $('#'+k).addClass('chore-wrapper-ticked');
            }
        })
    });

    function toggleChore(thisButton) {
        if (thisButton.attr('data-checked') == "false") {
            thisButton.addClass('chore-wrapper-ticked');
            thisButton.removeClass('chore-wrapper');
            thisButton.attr("data-checked", 'true');
            updateJSON("chores", thisButton[0].id, true);
        } else {
            thisButton.removeClass('chore-wrapper-ticked');
            thisButton.addClass('chore-wrapper');
            thisButton.attr("data-checked", 'false');
            updateJSON("chores", thisButton[0].id, false);
        }
    }
    
    for (var i=0; i<4; i++) {
        $('#rock' + i).click(function() {
            toggleChore($(this))
        })
        $('#fossil' + i).click(function() {
            toggleChore($(this))
        })
    }
    $('#money-rock').click(function() {
        toggleChore($(this));
    })
    $('#bottle').click(function() {
        toggleChore($(this));
    })
    $('#crack').click(function() {
        toggleChore($(this));
    })
    $('#turnip-am').click(function() {
        toggleChore($(this));
    })
    $('#turnip-pm').click(function() {
        toggleChore($(this));
    })
    
});



function minutesUntilMidnight() {
    var midnight = new Date();
    midnight.setHours(24);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    return (midnight.getTime() - new Date().getTime()) /1000/60;
}

function minutesUntilMidday() {
    var midday = new Date();
    midday.setHours(12);
    midday.setMinutes(0);
    midday.setSeconds(0);
    midday.setMilliseconds(0);
    return (midday.getTime() - new Date().getTime()) /1000/60;
}

function formattedTime(time) {
    var hours = Math.floor(time / 60)
    var mins = Math.ceil(time % 60);
    var hourText = (hours == 1) ? " Hour" : " Hours";
    var minuteText = (mins == 1) ? " Minute" : " Minutes";
    return (hours + hourText + " " + mins + minuteText)
}

function choresTimers() {
    var midnight = minutesUntilMidnight();
    var midday = minutesUntilMidday();
    var eightHours = 60 * 8;
    var turnipTime = (midday < 0) ? formattedTime(midnight + eightHours) : formattedTime(midday)
    $('#chores-time').text(formattedTime(midnight));
    $('#turnip-time').text(turnipTime)
};

/*
FISH FUNCTIONS -----------------------------------------------------------------
*/

$(function() {  //Fish tab click
    $('a#fish-button').bind('click', function() {
        if (prevTab == "chores") {
            $('#search').css('display', 'flex');
            $('.search-wrapper').css('justify-content', 'flex-start');
            $('#chores-timer-wrapper').css('display', 'none');
            $('#turnip-timer-wrapper').css('display', 'none');
        }
        hidePrevTab();
        setPrevTabIconInactive();
        prevTab = "fish"
        setActiveTab("fish");
        setActiveTabIcon("fish");
        showTab("fish");
    });
    return false;
});

function getCritterTime(v, altTime) {
    var timeHTML = "";
    if (v.length == 24) {
        var timeHTML = $('<div/>', {'class': 'time-container icon-text'}).append([
            $('<img/>', {'class': 'time-icon', 'src': './static/image/icons/svg/timer.svg'}),
            $('<div/>', {'class': 'data-text', 'text': "All day"})
            ])
    } else {
        var startTime = v[0];
        var endTime = v[v.length-1];
        var startAMPM = startTime >= 12 ? "PM" : "AM";
        startTime = startTime % 12
        startTime = startTime ? startTime : 12;
        finalStart = startTime + startAMPM;

        var endAMPM = endTime >= 12 ? "PM" : "AM";
        endTime = endTime % 12
        endTime = endTime ? endTime : 12;
        finalEnd = endTime+1 + endAMPM;

        finalTime = finalStart + "-" + finalEnd;

        if (altTime == false) {
            var timeHTML = $('<div/>', {'class': 'time-container icon-text'}).append([
                $('<img/>', {'class': 'time-icon', 'src': './static/image/icons/svg/timer.svg'}),
                $('<div/>', {'class': 'data-text', 'text': finalTime})
            ])
        } else {
            var timeHTML = $('<div/>', {'class': 'time-container icon-text'}).append([
                $('<img/>', {'class': 'time-icon', 'src': './static/image/icons/svg/timer.svg'}),
                $('<div/>', {'class': 'time-container-mod'}).append([
                    $('<div/>', {'class': 'data-text', 'text': finalTime}),
                    $('<div/>', {'class': 'data-text', 'text': altTime})
                ])
            ])
        }
    }
    return timeHTML
}

function getAltCritterTime(v) {
    var finalTime = "";
    if (v.length == 24) {
        var finalTime = "All Day";
    } else {
        var startTime = v[0];
        var endTime = v[v.length-1];
        var startAMPM = startTime >= 12 ? "PM" : "AM";
        startTime = startTime % 12
        startTime = startTime ? startTime : 12;
        finalStart = startTime + startAMPM;

        var endAMPM = endTime >= 12 ? "PM" : "AM";
        endTime = endTime % 12
        endTime = endTime ? endTime : 12;
        finalEnd = endTime+1 + endAMPM;

        finalTime = finalStart + "-" + finalEnd;

    }
    return finalTime
}

function getCritterLocation(v, secondLocationExists, secondLocation) {
    var locationHTML = {}
    var comma = ''
    if (secondLocationExists) {
        if (v.includes("(")) {
            var locationSplit = v.split("(");
            var location = locationSplit[0];
            var locationModifier = locationSplit[1];
            locationHTML = $('<div/>', {'class': 'location-container icon-text'}).append([
                $('<img/>', {'class': 'magnify-icon', 'src': './static/image/icons/svg/pin.svg'}),
                $('<div/>', {'class': 'location-container-mod'}).append([
                    $('<div/>', {'class': 'data-text', 'text': location.trim() + ','}),
                    $('<div/>', {'class': 'data-text-modifier', 'text': "(" + locationModifier})
                ]),
                secondLocation
            ])
        } else {
            locationHTML = $('<div/>', {'class': 'location-container'}).append([
                $('<div/>', {'class': 'data-text', 'text': v})
            ])
        }
    } else {
        if (v.includes("(")) {
            var locationSplit = v.split("(");
            var location = locationSplit[0];
            var locationModifier = locationSplit[1];
            
            locationHTML = $('<div/>', {'class': 'location-container icon-text'}).append([
                $('<img/>', {'class': 'magnify-icon', 'src': './static/image/icons/svg/pin.svg'}),
                $('<div/>', {'class': 'location-container-mod'}).append([
                    $('<div/>', {'class': 'data-text', 'text': location.trim()}),
                    $('<div/>', {'class': 'data-text-modifier', 'text': "(" + locationModifier})
                ])
            ])
        } else {
            locationHTML = $('<div/>', {'class': 'location-container icon-text'}).append(
                $('<img/>', {'class': 'magnify-icon', 'src': './static/image/icons/svg/pin.svg'}),
                $('<div/>', {'class': 'location-container'}).append(
                    $('<div/>', {'class': 'data-text', 'text': v})
                )
            )
        }
    }
    return locationHTML;
}

function getAltCritterLocation(v) {
    var locationHTML = {}
    if (v.includes("(")) {
        var locationSplit = v.split("(");
        var location = locationSplit[0];
        var locationModifier = locationSplit[1];
        locationHTML = $('<div/>', {'class': 'location-container-mod'}).append([
            $('<div/>', {'class': 'data-text', 'text': location.trim() + comma}),
            $('<div/>', {'class': 'data-text-modifier', 'text': "(" + locationModifier})
        ])
    } else {
        locationHTML = $('<div/>', {'class': 'location-container icon-text'}).append(
            $('<div/>', {'class': 'location-container'}).append(
                $('<div/>', {'class': 'data-text', 'text': v})
            )
        )
    }
    return locationHTML;
}



function createFishHTMLElement(element, k, v, timeHTML, locationHTML, userDict) {
    if (v.hasOwnProperty('timeAlt')) {
        altTime = getAltCritterTime(v.timeAlt);
        var timeHTML = getCritterTime(v.time, altTime);
    } else {
        altTime = false;
        var timeHTML = getCritterTime(v.time, altTime);
    }

    
    if (v.hasOwnProperty('locationAlt')) {
        var altLocationHTML = getAltCritterLocation(v.locationAlt)
        var locationHTML = getCritterLocation(v.location, true, altLocationHTML);
    } else {
        var locationHTML = getCritterLocation(v.location, false);
    }

    var checkedFilter = "critter-wrapper"
    var isChecked = false;
    if (userDict && userDict.hasOwnProperty(k)) {
        isChecked = userDict[k];
        checkedFilter = "critter-wrapper-checked";
    }

    var tooltip = 'Click to mark as caught or uncaught';
    
    return $('<div/>', {'class': 'critter-wrapper ' + checkedFilter, 'id':k, 'data-checked': isChecked, 'title': tooltip}).append([
            $('<img/>', {'class': 'critter-icon', 'loading': 'lazy', 'src':v.icon}),
            $('<div/>', {'class': 'critter-data'}).append([
                $('<div/>', {'class': 'name-container critter-name'}).append(
                $('<div/>', {'class': 'critter-name', 'text':v.name_formatted})
                ),
            $('<div/>', {'class': 'critter-divider'}),
            $('<div/>', {'class': 'data-grid'}).append([
                locationHTML,
                $('<div/>', {'class': 'bell-container icon-text'}).append([
                    $('<img/>', {'class': 'bell-icon', 'src': './static/image/icons/svg/bell.svg'}),
                    $('<div/>', {'class': 'data-text', 'text': v.price})
                ]),
                timeHTML,
                $('<div/>', {'class': 'shadow-container icon-text'}).append([
                    $('<img/>', {'class': 'shadow-icon', 'src': './static/image/icons/svg/shadow.svg'}),
                    $('<div/>', {'class': 'data-text', 'text': v.shadow})
                ])
            ])
            ])
        ])
    
}

function addCaughtToggle(k, tab) {
    $('#'+k).click(function() {
        var $thisCritter = $(this)
        if ($thisCritter.attr('data-checked') == 'true') {
            updateValue = 'false'; 
            $thisCritter.removeClass("critter-wrapper-checked")
            $thisCritter.addClass("critter-wrapper")
        }
        if ($thisCritter.attr('data-checked') == 'false') {
            updateValue = 'true';
            $thisCritter.addClass("critter-wrapper-checked")
            $thisCritter.removeClass("critter-wrapper")
        }
        $thisCritter.attr('data-checked', updateValue);
        var idToken = getCookie("user");
        if (idToken != "") {
            $.ajax({
                url: "/update",
                headers: {
                    token: idToken,
                    species: tab,
                    critter: $thisCritter.id,
                    value: updateValue
                }
            })
        } else {
            console.log("No one signed in")
        }
    });
};


async function getAllFish() {
    var userDict = false;
    var idToken = getCookie("user");
    if (idToken != "") {
        userDict = await getCaught("fish");
    }
    $.getJSON('/fish/all', function(data) {
        var $elementsToAppend = []
        var $elem = $(document.getElementById("fish-data-wrapper"));
        $.each(data, function(k, v) {
            $elementsToAppend.push(createFishHTMLElement($elem, k, v, userDict));
        });
        $elem.append($elementsToAppend);
        $.each(data, function(k, v) {
            addCaughtToggle(k, "fish");
        });
        $('.wrapper-skeleton').remove();
    }).done(function() { //Hides/shows check off fish on page load depending on if the global hide is checked or not
        if ($('#caught-checkbox')[0].checked) {
            hideCaughtCritters()
        }else {
            showCaughtCritters()
        }
        if ($('#caught-checkbox')[0].checked) {
            markAvailiable("fish").then(() => markAvailiable("bugs")).then(() => classFilterManager("fish")).then(() => classFilterManager("bugs"));
        }
        
    })
};

async function getFish() {
    var date = new Date();
    var h = date.getHours();
    var m = date.getMonth()+1;
    $.ajax({
        url: '/fish/available',
        dataType: 'json',
        headers: {
            hour: h,
            month: m
        },
        success: function(data) {
            var $elem = $(document.getElementById("fish-data-wrapper"));
            $.each(data, function(k, v) {
                generateFishHTML($elem, k, v);
            })
        }
    })
};


/*
BUGS FUNCTIONS -----------------------------------------------------------------
*/

$(function() { //bugs tab click
    $('a#bugs-button, #bug-icon').click(function() {
        if (prevTab == "chores") {
            $('#search').css('display', 'flex');
            $('.search-wrapper').css('justify-content', 'flex-start');
            $('#chores-timer-wrapper').css('display', 'none');
            $('#turnip-timer-wrapper').css('display', 'none');
        }
        hidePrevTab();
        setPrevTabIconInactive();
        prevTab = "bugs"
        showTab("bugs");
        setActiveTab("bugs");
        setActiveTabIcon("bugs");
        if (!gotBugs) {
            createSkeletonHTML("bugs");
        }
        if (!gotBugs) {
            getAllBugs();
        }
        $('#search').css('display', 'flex');
        $('.search-wrapper').css('justify-content', 'flex-start');
    });
});

function generateBugsHTML($elem, k, v, userDict) {
    if (v.hasOwnProperty('timeAlt')) {
        altTime = getAltCritterTime(v.timeAlt);
        var timeHTML = getCritterTime(v.time, altTime);
    } else {
        altTime = false;
        var timeHTML = getCritterTime(v.time, altTime);
    }

    if (v.hasOwnProperty('locationAlt')) {
        var altLocationHTML = getAltCritterLocation(v.locationAlt)
        var locationHTML = getCritterLocation(v.location, true, altLocationHTML);
    } else {
        var locationHTML = getCritterLocation(v.location, false);
    }
    

    var checkedFilter = "critter-wrapper"
    var isChecked = false;
    if (userDict && userDict.hasOwnProperty(k)) {
        isChecked = userDict[k];
        checkedFilter = "critter-wrapper-checked";
    }

    var tooltip = 'Click to mark as caught or uncaught';

    

    return $('<div/>', {'class': 'critter-wrapper ' + checkedFilter, 'id':k, 'data-checked': isChecked, 'title':tooltip}).append([
            $('<img/>', {'class': 'critter-icon', 'loading': 'lazy', 'src':v.icon}),
            $('<div/>', {'class': 'critter-data'}).append([
                $('<div/>', {'class': 'name-container critter-name'}).append(
                    $('<div/>', {'class': 'critter-name', 'text':v.name_formatted})
                ),
                    $('<div/>', {'class': 'critter-divider'}),
                    $('<div/>', {'class': 'data-grid'}).append([
                        locationHTML,
                        $('<div/>', {'class': 'bell-container icon-text'}).append([
                            $('<img/>', {'class': 'bell-icon', 'src': './static/image/icons/svg/bell.svg'}),
                            $('<div/>', {'class': 'data-text', 'text': v.price})
                            ]),
                        timeHTML
                    ])
                ])
            ])
}



async function getAllBugs() {
    var userDict = false;
    var idToken = getCookie("user");
    if (idToken != "") {
        userDict = await getCaught("bugs");
    }
    $.getJSON('/bugs/all', function(data) {
        var $elementsToAppend = [];
        var $elem = $("#bugs-data-wrapper");
        $.each(data, function(k, v) {
            $elementsToAppend.push(generateBugsHTML($elem, k, v, userDict));
        });
        $elem.append($elementsToAppend);
        $.each(data, function(k, v) {
            addCaughtToggle(k, "bugs");
        });
        $('.wrapper-skeleton').remove();
    }).done(function() { //Hides/shows check off fish on page load depending on if the global hide is checked or not
        
        if ($('#caught-checkbox')[0].checked) {
            hideCaughtCritters().then(() => classFilterManager("bugs"));
        } else {
            showCaughtCritters().then(() => classFilterManager("bugs"));
        }
        gotBugs = true;
    })
};

async function getAvaliableBugs() {
    $.getJSON('/bugs/available', function(data) {
        var $elem = $("#bugs-data-wrapper");
        $.each(data, function(k, v) {
            generateBugsHTML($elem, k, v);
        });
    });
};


function refreshBugs() {
    $.getJSON('/bugs/available',
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
        if (prevTab == "chores") {
            $('#search').css('display', 'flex');
            $('.search-wrapper').css('justify-content', 'flex-start');
            $('#chores-timer-wrapper').css('display', 'none');
            $('#turnip-timer-wrapper').css('display', 'none');
        }
        hidePrevTab();
        setPrevTabIconInactive();
        prevTab = "villagers";
        if (!gotVillagers) {
            createSkeletonHTML("villagers")
        }
        showTab("villagers");
        setActiveTab("villagers");
        setActiveTabIcon("villagers");

        if (!gotVillagers) {
            getVillagers();
        }
        $('#search').css('display', 'flex');
        $('.search-wrapper').css('justify-content', 'flex-start');
        $('#chores-timer-wrapper').css('display', 'none');
    });
    return false;
});

function generateVillagerHTML($elem, k, v) {
    var genderIcon = './static/image/icons/svg/female.svg';
    if (v.gender == "m") {
        genderIcon = './static/image/icons/svg/male.svg';
    };
    return $('<div/>', {'class': 'critter-wrapper', 'id':v.name}).append([
            $('<img/>', {'class': 'critter-icon', 'loading': 'lazy', 'src':v.icon}),
            $('<div/>', {'class': 'critter-data'}).append([
                $('<div/>', {'class': 'name-container critter-name'}).append([
                    $('<div/>', {'class': 'villager-name', 'text':v.name}),
                    $('<img/>', {'class': 'villager-gender-icon', 'src': genderIcon})
                ]),
                $('<div/>', {'class': 'critter-divider'}),
                $('<div/>', {'class': 'data-grid'}).append([
                    $('<div/>', {'class': 'birthday-container icon-text'}).append([
                        $('<img/>', {'class': 'villager-birthday-icon', 'src': './static/image/icons/svg/cake.svg'}),
                        $('<div/>', {'class': 'villager-block', 'text':  v.month + " " + ordinalSuffixOf(v.date)})
                        ]),
                    $('<div/>', {'class': 'villager-species-container'}).append([
                        $('<img/>', {'class': 'villager-species-icon', 'src': './static/image/icons/svg/paw.svg'}),
                        $('<div/>', {'class': 'villager-block', 'text':  v.species})
                    ]),
                    $('<div/>', {'class': 'villager-personality-container'}).append([
                        $('<img/>', {'class': 'villager-personality-icon', 'src': './static/image/icons/svg/star.svg'}),
                        $('<div/>', {'class': 'villager-block', 'text':  v.personality})
                    ]),
                        $('<div/>', {'class': 'villager-block', 'text':  '"' + v.catchphrase + '"'})
                ])
            ])
        ])
};


async function getVillagers() {
    var date = new Date();
    var m = date.getMonth()+1;
    var d = date.getDate();
    $.ajax({
        url: '/villagers-sorted',
        dataType: 'json',
        headers: {
            n: 100,
            day: d,
            month: m
        },
        success: function(data) {
            var $elementsToAppend = [];
            var $elem = $("#villagers-data-wrapper");
            $.each(data, function(k, v) {
                $elementsToAppend.push(generateVillagerHTML($elem, k , v));
            })
            $elem.append($elementsToAppend)
            $('.wrapper-skeleton').remove();
            gotVillagers = true;
        },
        error: function(data) {
            console.log(data)
        }
    })
}
        
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
    if (exdays !== false) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString() + ";";
    }
    document.cookie = cname + "=" + cvalue + ";" + expires + "SameSite=Strict;" + "path=/";
};
  
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    console.log(ca)
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

async function setDefaultHemisphereCookie() {
    setCookie("hemisphere", "north", 365);
    setHemisphereIcon("north");
    if ($('#availiable-checkbox')[0].checked) {
        if (getActiveTab() == "fish") {
            markAvailiable("fish");
        } else if (getActiveTab() == "bugs") {
            markAvailiable("bugs");
        }
    }
}

$(function() {
    $("#hemisphere-button").click(() => {
        var cookie = getCookie("hemisphere");
        console.log(cookie)
        if (cookie == "north") {
            setHemisphereIcon("south");
            setCookie("hemisphere", "south", 365);
            if ($('#availiable-checkbox')[0].checked) {
                if (getActiveTab() == "fish") {
                    markAvailiable("fish");
                } else if (getActiveTab() == "bugs") {
                    markAvailiable("bugs");
                }
            }
        } else if (cookie == "south") {
            setHemisphereIcon("north");
            setCookie("hemisphere", "north", 365);
            if ($('#availiable-checkbox')[0].checked) {
                if (getActiveTab() == "fish") {
                    markAvailiable("fish");
                } else if (getActiveTab() == "bugs") {
                    markAvailiable("bugs");
                }
            }
        } else {
            alert("Can't find any cookies");
        }
    })
});

function setHemisphereIcon(hemisphere) {
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

/*
TAB VIEW FUNCTIONS -----------------------------------------------------------------
*/

async function hidePrevTab() {
    $('#' + prevTab + '-tab').css('display', 'none');
}

async function showTab(tab) {
    $('#' + tab + '-tab').css('display', 'flex');
};


/*
TAB ICON FUNCTIONS -----------------------------------------------------------------
*/

function setPrevTabIconInactive() {
    makeTabIconInactive(prevTab)
}

function setActiveTabIcon(tab) {
   makeTabIconActive(tab);
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
    $('#search').on('keyup', function() {
        $critterChildren = $('#' + getActiveTab() + '-data-wrapper').children();
        for (var i=0; i<$critterChildren.length; i++) {
            if (!$critterChildren[i].id.includes(this.value)) {
                $($critterChildren[i]).addClass('_search_filter');
            } else {
                $($critterChildren[i]).removeClass('_search_filter');
            }
        }
        classFilterManager(getActiveTab());
    })
    $('#search').on('blur', function() {
        this.value = "";
        $critterChildren = $('#' + getActiveTab() + '-data-wrapper').children();
        for (var i=0; i<$critterChildren.length; i++) {
            $($critterChildren[i]).removeClass('_search_filter');
        }
        classFilterManager(getActiveTab());
    })
})


/*
SHOW ALL CHECK BOX -----------------------------------------------------------------
*/

async function markAll(tab) {
    var $elemChildren = $("#" + tab + "-data-wrapper").children();
    for (var i=0; i < $elemChildren.length; i++) {
        $("#" + $elemChildren[i].id).addClass('_all_filter');
    }
}

async function unmarkAll(tab) {
    var $elemChildren = $("#" + tab + "-data-wrapper").children();
    for (var i=0; i < $elemChildren.length; i++) {
        $("#" + $elemChildren[i].id).removeClass('_all_filter');
    }
}

async function markAvailiable(tab) {
    var date = new Date();
    var h = date.getHours();
    var m = date.getMonth()+1;
    var $alreadyChecked = [];
    var $elemChildren = $("#" + tab + "-data-wrapper").children();
    $.ajax({
        url: '/' + tab + '/available',
        dataType: 'json',
        headers: {
            hour: h,
            month: m
        },
        success: function(data) {
            $.each(data, function(k, v) {
                for (var i=0; i < $elemChildren.length; i++) {
                    if (k == $elemChildren[i].id) {
                        $("#" + $elemChildren[i].id).removeClass('_all_filter');
                        $alreadyChecked.push($elemChildren[i].id);
                        break;
                    } else if (!$alreadyChecked.includes($elemChildren[i].id)) {
                        $("#" + $elemChildren[i].id).addClass('_all_filter');
                    }
                }
            })
            classFilterManager(tab);
        }
    })
};



$(document).ready( () => {
    $('#availiable-checkbox').on('click', function() {
        if ($('#caught-checkbox').checked) {
            $('#caught-checkbox').prop('checked', false);
        }
        if (this.checked) {
            markAvailiable("fish").then(() => markAvailiable("bugs")).then(() => classFilterManager("fish")).then(() => classFilterManager("bugs"));
        } else {
            unmarkAll("fish").then(() => unmarkAll("bugs")).then(() => classFilterManager("fish")).then(() => classFilterManager("bugs"));
        }
    });
});

/*
FILTER CAUGHT CHECKBOX -----------------------------------------------------------------
*/



async function showCaughtCritters() {
    var $elemChildren = $("#fish-data-wrapper").children();
    for (var i=0; i<$elemChildren.length; i++) {
        if ($('#' + $elemChildren[i].id).attr('data-checked') == 'true') {
            $('#' + $elemChildren[i].id).removeClass("_caught_filter");
        }
    }
    var $elemChildren = $("#bugs-data-wrapper").children();
    for (var i=0; i<$elemChildren.length; i++) {
        if ($('#' + $elemChildren[i].id).attr('data-checked') == 'true') {
            $('#' + $elemChildren[i].id).removeClass("_caught_filter");
        }
    }
}

async function hideCaughtCritters() {
    var $elemChildren = $("#fish-data-wrapper").children();
    for (var i=0; i<$elemChildren.length; i++) {
        if ($('#' + $elemChildren[i].id).attr('data-checked') == 'true') {
            $('#' + $elemChildren[i].id).addClass("_caught_filter");
        }
    }
    var $elemChildren = $("#bugs-data-wrapper").children();
    for (var i=0; i<$elemChildren.length; i++) {
        if ($('#' + $elemChildren[i].id).attr('data-checked') == 'true') {
            $('#' + $elemChildren[i].id).addClass("_caught_filter");
        }
    }
}

$(document).ready( () => {
    $('#caught-checkbox').on('click', function() {
        if (!this.checked) {
            showCaughtCritters().then(() => classFilterManager("fish")).then(() => classFilterManager("bugs"));
        } else {
            hideCaughtCritters().then(() => classFilterManager("fish")).then(() => classFilterManager("bugs"));
        }
    })
});
        

/*
OTHER -----------------------------------------------------------------
*/

function classFilterManager(tab) {
    var $elemChildren = $("#" + tab + "-data-wrapper").children();
    for (var i=0; i < $elemChildren.length; i++) {
        $elemClasses = Array.from($elemChildren[i].classList);
        if ($elemClasses.includes("_caught_filter") ||
         $elemClasses.includes("_all_filter") ||
         $elemClasses.includes("_search_filter")) {
            $elemChildren[i].style.display = "none";
        } else {
            $elemChildren[i].style.display = "flex";
        }
    }
}


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
    CURRENT_TIME = d;

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

function createSkeletonHTML(tab) {
    var element = $("#" + tab + "-data-wrapper");
    if (tab == "fish" || tab == "villagers") {
        for (var i=0; i<50; i++) {
            element.append([
                $('<div/>', {'class': 'wrapper-skeleton'}).append([
                    $('<div/>', {'class': 'image-skeleton'}),
                    $('<div/>', {'class': 'skeleton-data'}).append([
                        $('<div/>', {'class': 'name-container critter-name'}).append(
                            $('<div/>', {'class': 'name-skeleton name-animation'})
                        ),
                        $('<div/>', {'class': 'critter-divider'}),
                        $('<div/>', {'class': 'data-grid'}).append([
                            $('<div/>', {'class': 'data-container-skeleton'}).append([
                                $('<div/>', {'class': 'icon-skeleton'}),
                                $('<div/>', {'class': 'text-skeleton text-animation'})
                            ]),
                            $('<div/>', {'class': 'data-container-skeleton'}).append([
                                $('<div/>', {'class': 'icon-skeleton'}),
                                $('<div/>', {'class': 'text-skeleton text-animation'})
                            ]),
                            $('<div/>', {'class': 'data-container-skeleton'}).append([
                                $('<div/>', {'class': 'icon-skeleton'}),
                                $('<div/>', {'class': 'text-skeleton text-animation'})
                            ]),
                            $('<div/>', {'class': 'data-container-skeleton'}).append([
                                $('<div/>', {'class': 'icon-skeleton'}),
                                $('<div/>', {'class': 'text-skeleton text-animation'})
                            ])
                        ])
                    ])
                ])
            ])
        }
    } else {
        for (var i=0; i<50; i++) {
            element.append([
                $('<div/>', {'class': 'wrapper-skeleton'}).append([
                    $('<div/>', {'class': 'image-skeleton'}),
                    $('<div/>', {'class': 'skeleton-data'}).append([
                        $('<div/>', {'class': 'name-container critter-name'}).append(
                            $('<div/>', {'class': 'name-skeleton name-animation'})
                        ),
                        $('<div/>', {'class': 'critter-divider'}),
                        $('<div/>', {'class': 'data-grid'}).append([
                            $('<div/>', {'class': 'data-container-skeleton'}).append([
                                $('<div/>', {'class': 'icon-skeleton'}),
                                $('<div/>', {'class': 'text-skeleton text-animation'})
                            ]),
                            $('<div/>', {'class': 'data-container-skeleton'}).append([
                                $('<div/>', {'class': 'icon-skeleton'}),
                                $('<div/>', {'class': 'text-skeleton text-animation'})
                            ]),
                            $('<div/>', {'class': 'data-container-skeleton'}).append([
                                $('<div/>', {'class': 'icon-skeleton'}),
                                $('<div/>', {'class': 'text-skeleton text-animation'})
                            ])
                        ])
                    ])
                ])
            ])
        }
    }
}


$(function() {
    if (getCookie("hemisphere") == "") {
        setDefaultHemisphereCookie().then(() => setHemisphereIcon(getCookie("hemisphere")));
    } else {
        setHemisphereIcon(getCookie("hemisphere"));
    }
    createSkeletonHTML("fish");
    datetime();
    getAllFish();
    showTab("fish");
});