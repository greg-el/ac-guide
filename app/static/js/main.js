ACTIVE_TAB = "fish";
CURRENT_HOUR = new Date().getHours() % 12;    
CURRENT_HOUR = CURRENT_HOUR ? CURRENT_HOUR : 12;
CURRENT_TIME = new Date();
/*
FIREBASE FUNCTIONS -----------------------------------------------------------------
*/



firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $('#logout').css('display', 'block');
        $('#login-link').css('display', 'none');
    } else {
        $('#logout').css('display', 'none');
        $('#login-link').css('display', 'block');
        console.log("No one signed in");
    }
});

$(document).ready(function() {
    $('#logout').click(function() {
        firebase.auth().signOut().then(function() {
            console.log("signout successful");
        }).catch(function(error) {
            console.log(error.message)
        })
    })
});

function updateJSON(updateSpecies, updateCritter, updateValue) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
                $.ajax({
                    url: "/update",
                    headers: {
                        token: idToken,
                        species: updateSpecies,
                        critter: updateCritter,
                        value: updateValue
                    },
                })
            })
        } else {
          console.log("No one signed in")
        }
    });
}

function getCaught(species) {
    return new Promise(function(resolve, reject) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
                    $.ajax({
                        url: "/get",
                        headers: {
                            token: idToken,
                        },
                        success: function(data) {
                            console.log("got data");
                            if (species == "fish") {
                                resolve(data.fish);
                            } else if (species == "bugs") {
                                resolve(data.bugs)
                            } else if (species == "chores") {
                                resolve(data.chores)
                            }
                        },
                        error: function(data) {
                            reject(new Error("UID not in database"))
                        }
                    })
                })
            } else {
                reject(new Error("No user"));
            }
        })
    })
};

/*
CHORES FUNCTIONS -----------------------------------------------------------------
*/

$(function() {  //Chores tab click
    $('a#chores-button').bind('click', async function() {
        setActiveTab("chores");
        setActiveTabIcon("chores");
        showTab("chores");
        $('#search').css('display', 'none');
        $('.search-wrapper').css('justify-content', 'center');
        var data = await getCaught("chores");
        $.each(data, function(k, v) {
            if (v == true) {
                $('#'+k).addClass('_chore_ticked');
                $('#'+k+'-tick').css('display', 'flex');
                $('#'+k+'-tick').css('display', 'flex');
            }
        })
    });

    function toggleChore(thisButton) {
        if (thisButton.attr('data-checked') == "false") {
            thisButton.addClass("_chore_ticked");
            thisButton.attr("data-checked", 'true');
            updateJSON("chores", thisButton[0].id, true);
            $('#'+thisButton[0].id+'-tick').css('display', 'flex');
        } else {
            thisButton.removeClass("_chore_ticked");
            thisButton.attr("data-checked", 'false');
            updateJSON("chores", thisButton[0].id, false);
            $('#'+thisButton[0].id+'-tick').css('display', 'none');
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

choresTimers();
setInterval(choresTimers, 1000);

var now = new Date();
var delay = 60 * 60 * 1000; // 1 hour
var start = delay - (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();

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
        setActiveTab("fish");
        setActiveTabIcon("fish");
        showTab("fish");
        $('#search').css('display', 'flex');
        $('.search-wrapper').css('justify-content', 'flex-start');
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



async function createHTMLElement(element, k, v, timeHTML, locationHTML, userDict) {
    var opacity = '100%';
    var isChecked = false;
    if (userDict && userDict.hasOwnProperty(k)) {
        isChecked = userDict[k];
        opacity = '40%';
    }
    var nameLength = '_name_short'
    if (k.length > 18) {
        nameLength = '_name_long'
    }

    var tooltip = 'Click to mark as caught or uncaught';
    element.append(
        $('<div/>', {'class': 'critter-wrapper ' + nameLength, 'id':k, 'data-checked': isChecked, 'title': tooltip, css: {'opacity': opacity}}).append([
            $('<img/>', {'class': 'critter-icon', 'src':v.icon, 'loading':'lazy'}),
            $('<div/>', {'class': 'critter-data'}).append([
                $('<div/>', {'class': 'critter-data-wrapper'}).append([
                    $('<div/>', {'class': 'data-grid'}).append([
                        $('<div/>', {'class': 'name-container critter-name'}).append(
                            $('<div/>', {'class': 'critter-name', 'text':v.name_formatted})
                        ),
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
        ])
    )
}

async function generateFishHTML(element, k, v, userDict) {
    
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
    
    createHTMLElement(element, k, v, timeHTML, locationHTML, userDict);


    $('#'+k).click(function() {
        var $thisCritter = $(this)[0]
        if ($($thisCritter).attr('data-checked') == 'true') {
            updateValue = 'false'; 
            $($thisCritter).css('opacity', '100%');
        }
        if ($($thisCritter).attr('data-checked') == 'false') {
            updateValue = 'true';
            $($thisCritter).css('opacity', '40%')
        }
        $($thisCritter).attr('data-checked', updateValue);
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
                    $.ajax({
                        url: "/update",
                        headers: {
                            token: idToken,
                            species: "fish",
                            critter: $thisCritter.id,
                            value: updateValue
                        },
                    })
                })
            } else {
              console.log("No one signed in")
            }
          });
    });
};

async function getAllFish() {
    var userDict = false;
    firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
            try {
                userDict = await getCaught("fish");
                $.getJSON('/fish/all', function(data) {
                    var $elem = $(document.getElementById("fish-data-wrapper"));
                    $.each(data, function(k, v) {
                        generateFishHTML($elem, k, v, userDict)
                    })
                }).done(function() { //Hides/shows check off fish on page load depending on if the global hide is checked or not
                    if ($('#caught-checkbox')[0].checked) {
                        hideCaughtCritters()
                    }else {
                        console.log("its not ticked")
                        showCaughtCritters()
                    }
                    if ($('#caught-checkbox')[0].checked) {
                        markAvailiable("fish").then(() => markAvailiable("bugs")).then(() => classFilterManager("fish")).then(() => classFilterManager("bugs"));
                    }
                })
            } catch(err) {
                console.log(err)
            }
        } else {
            $.getJSON('/fish/all', function(data) {
                var $elem = $(document.getElementById("fish-data-wrapper"));
                $.each(data, function(k, v) {
                    generateFishHTML($elem, k, v, userDict);
                })
            }).done(function() { //Hides/shows check off fish on page load depending on if the global hide is checked or not
                if ($('#caught-checkbox')[0].checked) {
                    hideCaughtCritters().then(() => classFilterManager("fish"));
                }else {
                    console.log("its not ticked")
                    showCaughtCritters().then(() => classFilterManager("fish"));
                }
            })
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
        setActiveTab("bugs");
        setActiveTabIcon("bugs");
        showTab("bugs");
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
    

    var isChecked = false;
    if (userDict && userDict.hasOwnProperty(k)) {
        isChecked = userDict[k];
    }

    var nameLength = '_name_short'
    if (k.length > 18) {
        nameLength = '_name_long'
    }

    var tooltip = 'Click to mark as caught or uncaught';

    $elem.append(
        $('<div/>', {'class': 'critter-wrapper ' + nameLength, 'id':k, 'data-checked': isChecked, 'title':tooltip}).append([
            $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
            $('<div/>', {'class': 'critter-data'}).append([
                $('<div/>', {'class': 'critter-data-wrapper'}).append([
                    $('<div/>', {'class': 'data-grid'}).append([
                        $('<div/>', {'class': 'name-container critter-name'}).append(
                            $('<div/>', {'class': 'critter-name', 'text':v.name_formatted})
                        ),
                        locationHTML,
                        $('<div/>', {'class': 'bell-container icon-text'}).append([
                            $('<img/>', {'class': 'bell-icon', 'src': './static/image/icons/svg/bell.svg'}),
                            $('<div/>', {'class': 'data-text', 'text': v.price})
                            ]),
                        timeHTML
                    ])
                ])
            ])
        ])
    )

    $('#'+k).click(function() {
        var $thisCritter = $(this)[0]
        if ($($thisCritter).attr('data-checked') == 'true') {
            updateValue = 'false';
            $($thisCritter).css('opacity', '100%');
        }
        if ($($thisCritter).attr('data-checked') == 'false') {
            updateValue = 'true';
            $($thisCritter).css('opacity', '40%');

        }
        $($thisCritter).attr('data-checked', updateValue);
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
                    $.ajax({
                        url: "/update",
                        headers: {
                            token: idToken,
                            species: "bugs",
                            critter: $thisCritter.id,
                            value: updateValue
                        },
                    })
                })
            } else {
              console.log("No one signed in")
            }
          });
    });
};

async function getAllBugs() {
    var userDict = false;
    firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
            try {
                userDict = await getCaught("bugs");
                $.getJSON('/bugs/all', function(data) {
                    var $elem = $("#bugs-data-wrapper");
                    $.each(data, function(k, v) {
                        generateBugsHTML($elem, k, v, userDict);
                    });
                }).done(function() { //Hides/shows checked off fish on page load depending on if the global hide is checked or not
                    if ($('#caught-checkbox')[0].checked) {
                        hideCaughtCritters().then(() => classFilterManager("bugs"));
                    }else {
                        console.log("its not ticked")
                        showCaughtCritters().then(() => classFilterManager("bugs"));
                    }
                });
            } catch(err) {
                console.log(err)
            }
        } else {
            $.getJSON('/bugs/all', function(data) {
                var $elem = $("#bugs-data-wrapper");
                $.each(data, function(k, v) {
                    generateBugsHTML($elem, k, v, userDict);
                });
            }).done(function() { //Hides/shows check off fish on page load depending on if the global hide is checked or not
                if ($('#caught-checkbox')[0].checked) {
                    hideCaughtCritters().then(() => classFilterManager("bugs"));
                }else {
                    console.log("its not ticked")
                    showCaughtCritters().then(() => classFilterManager("bugs"));
                }
            });
        }
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
        setActiveTab("villagers");
        setActiveTabIcon("villagers");
        showTab("villagers");
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
    $elem.append(
        $('<div/>', {'class': 'critter-wrapper', 'id':v.name}).append([
            $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
            $('<div/>', {'class': 'critter-data'}).append([
                $('<div/>', {'class': 'critter-data-wrapper'}).append([
                    $('<div/>', {'class': 'data-grid'}).append([
                        $('<div/>', {'class': 'name-container critter-name'}).append(
                            $('<div/>', {'class': 'critter-name', 'text':v.name}),
                            $('<img/>', {'class': 'villager-gender-icon', 'src': genderIcon})
                        ),
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
        ])
    )
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
            var $elem = $("#villagers-data-wrapper");
            $.each(data, function(k, v) {
                generateVillagerHTML($elem, k , v);
            })
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
            if ($('#availiable-checkbox')[0].checked) {
                if (getActiveTab() == "fish") {
                    markAvailiable("fish");
                } else if (getActiveTab() == "bugs") {
                    markAvailiable("bugs");
                }
            }
        } else if (cookie == "south") {
            setHempisphereIcon("north");
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
    }
};

/*
TAB VIEW FUNCTIONS -----------------------------------------------------------------
*/

function showTab(tab) {
    if (tab == "fish") {
        $('#chores-tab').css('display', 'none');
        $('#fish-tab').css('display', 'flex');
        $('#bugs-tab').css('display', 'none');
        $('#villagers-tab').css('display', 'none');
    } else if (tab == "bugs") {
        $('#chores-tab').css('display', 'none');
        $('#fish-tab').css('display', 'none');
        $('#bugs-tab').css('display', 'flex');
        $('#villagers-tab').css('display', 'none');
    } else if (tab == "villagers") {
        $('#chores-tab').css('display', 'none');
        $('#fish-tab').css('display', 'none');
        $('#bugs-tab').css('display', 'none');
        $('#villagers-tab').css('display', 'flex');
    } else if (tab == "chores") {
        $('#chores-tab').css('display', 'flex');
        $('#fish-tab').css('display', 'none');
        $('#bugs-tab').css('display', 'none');
        $('#villagers-tab').css('display', 'none');
    } else {
        console.log("Error showing tab")
    }
};


/*
TAB ICON FUNCTIONS -----------------------------------------------------------------
*/

function setActiveTabIcon(tab) {
    if (tab == "fish") {
        makeTabIconInactive("chores");
        makeTabIconActive("fish");
        makeTabIconInactive("bugs");
        makeTabIconInactive("villagers");
    } else if (tab == "bugs") {
        makeTabIconInactive("chores");
        makeTabIconInactive("fish");
        makeTabIconActive("bugs");
        makeTabIconInactive("villagers");
    } else if (tab == "villagers") {
        makeTabIconInactive("chores");
        makeTabIconInactive("bugs");
        makeTabIconInactive("fish");
        makeTabIconActive("villagers");
    } else if (tab == "chores") {
        makeTabIconActive("chores");
        makeTabIconInactive("bugs");
        makeTabIconInactive("fish");
        makeTabIconInactive("villagers");
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
            //$elemChildren[i].style.display = "none";
            $('#' + $elemChildren[i].id).fadeOut(500)
        } else {
            $('#' + $elemChildren[i].id).fadeIn(500)
            //$elemChildren[i].style.display = "flex";
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



$(function() {
    checkCookieExists();
    setHempisphereIcon(getCookie("hemisphere"));
    hemisphereCookieHandler();
    datetime();
    getAllFish();
    getAllBugs();
    getVillagers();
    showTab("fish");
});