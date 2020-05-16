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
CRITTER HTML GEN FUNCTIONS -----------------------------------------------------------------
*/

function getCritterTimePlainHTML(v, altTime) {
    var timeHTML = "";
    if (v.length == 24) {
        var timeHTML = '<div class="time-container icon-text">\n' +
                            '<img class="icon" src="./static/image/icons/svg/timer.svg">\n' +
                            '<div class="data-text" text="All Day"></div>\n' +
                        '</div>';
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
            var timeHTML = '<div class="time-container icon-text">\n' +
            '<img class="icon" src="./static/image/icons/svg/timer.svg">\n' +
            '<div class="data-text" text="'+finalTime+'"></div>\n' +
        '</div>';
        } else {
            var timeHTML = '<div class="time-container icon-text">\n' +
                                '<img class="icon" src="./static/image/icons/svg/timer.svg">\n' +
                                '<div class="time-container-mod">\n' +
                                    '<div class="data-text" text="'+finalTime+'"></div>\n' +
                                    '<div class="data-text" text="'+altTime+'"></div>\n'+
                                '</div>\n' +
                            '</div>';
        }
    }
    return timeHTML
}

function getCritterTime(v, altTime) {
    var timeHTML = "";
    if (v.length == 24) {
        var timeHTML = $('<div/>', {'class': 'time-container icon-text'}).append([
            $('<img/>', {'class': 'icon', 'src': './static/image/icons/svg/timer.svg'}),
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
                $('<img/>', {'class': 'icon', 'src': './static/image/icons/svg/timer.svg'}),
                $('<div/>', {'class': 'data-text', 'text': finalTime})
            ])
        } else {
            var timeHTML = $('<div/>', {'class': 'time-container icon-text'}).append([
                $('<img/>', {'class': 'icon', 'src': './static/image/icons/svg/timer.svg'}),
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

function getCritterLocation(location, secondLocationExists, secondLocation) {
    var locationHTML = {}
    if (secondLocationExists) {
        if (location.includes("(")) {
            var locationSplit = location.split("(");
            var location = locationSplit[0];
            var locationModifier = locationSplit[1];
            locationHTML = $('<div/>', {'class': 'location-container icon-text'}).append([
                $('<img/>', {'class': 'icon', 'src': './static/image/icons/svg/pin.svg'}),
                $('<div/>', {'class': 'location-container-mod'}).append([
                    $('<div/>', {'class': 'data-text', 'text': location.trim() + ','}),
                    $('<div/>', {'class': 'data-text-modifier', 'text': "(" + locationModifier})
                ]),
                secondLocation
            ])
        } else {
            locationHTML = $('<div/>', {'class': 'location-container'}).append([
                $('<div/>', {'class': 'data-text', 'text': location})
            ])
        }
    } else {
        if (location.includes("(")) {
            var locationSplit = location.split("(");
            var location = locationSplit[0];
            var locationModifier = locationSplit[1];
            
            locationHTML = $('<div/>', {'class': 'location-container icon-text'}).append([
                $('<img/>', {'class': 'icon', 'src': './static/image/icons/svg/pin.svg'}),
                $('<div/>', {'class': 'location-container-mod'}).append([
                    $('<div/>', {'class': 'data-text', 'text': location.trim()}),
                    $('<div/>', {'class': 'data-text-modifier', 'text': "(" + locationModifier})
                ])
            ])
        } else {
            locationHTML = $('<div/>', {'class': 'location-container icon-text'}).append(
                $('<img/>', {'class': 'icon', 'src': './static/image/icons/svg/pin.svg'}),
                $('<div/>', {'class': 'location-container'}).append(
                    $('<div/>', {'class': 'data-text', 'text': location})
                )
            )
        }
    }
    return locationHTML;
}

function getCritterLocationPlainHTML(v, secondLocationExists, secondLocation) {
    var locationHTML = {}
    if (secondLocationExists) {
        if (v.includes("(")) {
            var locationSplit = v.split("(");
            var location = locationSplit[0];
            var locationModifier = locationSplit[1];
            locationHTML = '<div class="location-container icon-text">\n' +
                                '<img class="icon" src="./static/image/icons/svg/pin.svg">\n' +
                                '<div class="location-container-mod">\n' +
                                    '<div class="data-text" text="'+location.trim()+',"></div>\n' +
                                    '<div class="data-text-modifier" text="(' + locationModifier + '></div>\n' +
                                '</div>\n' +
                            '</div>\n' + 
                            secondLocation
        } else {
            locationHTML = '<div class="location-container">\n' +
                '<div class="data-text" text="'+v+'"></div>\n' +
            '</div>'
        }
    } else {
        if (v.includes("(")) {
            var locationSplit = v.split("(");
            var location = locationSplit[0];
            var locationModifier = locationSplit[1];
            
            locationHTML = '<div class="location-container icon-text">\n' +
                                '<img class="icon" src="./static/image/icons/svg/pin.svg">\n' +
                                '<div class="location-container-mod">\n' +
                                    '<div class="data-text" text="'+location.trim()+',"></div>\n' +
                                    '<div class="data-text-modifier" text="(' + locationModifier + '></div>\n' +
                                '</div>\n' +
                            '</div>' 
        } else {
            locationHTML = '<div class="location-container icon-text">\n' +
                                '<img class="icon" src="./static/image/icons/svg/pin.svg">\n' +
                                '<div class="location-container-mod">\n' +
                                    '<div class="data-text" text="'+v+'"></div>\n' +
                                '</div>\n' +
                            '</div>\n'
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

function getAltCritterLocationPlainHTML(v) {
    var locationHTML = {}
    if (v.includes("(")) {
        var locationSplit = v.split("(");
        var location = locationSplit[0];
        var locationModifier = locationSplit[1];
        locationHTML = '<div class="location-container-mod">\n' +
        '<div class="data-text" text="'+location+'"></div>\n' +
        '<div class="data-text-modifier" text="(' + locationModifier + '></div>\n' +
    '</div>\n'
    } else {
        locationHTML = '<div class="location-container icon-text">\n' +
                            '<div class="location-container">\n' +
                                'div class="data-text" text="'+v+'">\n' +
                            '</div>\n'+
                        '</div>'
    }
    return locationHTML;
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
        if (getCookie("user") != "") {
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
        }
    })
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
                    $('<img/>', {'class': 'icon', 'src': './static/image/icons/svg/bell.svg'}),
                    $('<div/>', {'class': 'data-text', 'text': v.price})
                ]),
                timeHTML,
                $('<div/>', {'class': 'shadow-container icon-text'}).append([
                    $('<img/>', {'class': 'icon shadow', 'src': './static/image/icons/svg/shadow.svg'}),
                    $('<div/>', {'class': 'data-text', 'text': v.shadow})
                ])
            ])
            ])
        ])
    
}

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
    $('a#bugs-button, #bug-icon').click(async function() {
        setActiveTab("bugs");
        setActiveTabIcon("bugs");
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

    if (k == "divingbeetle") {
        console.log(v)
        console.log(locationHTML, altLocationHTML)
    }


    if (v.hasOwnProperty('timeAlt')) {
        var plainAltTime = getAltCritterTime(v.timeAlt);
        var plainTimeHTML = getCritterTimePlainHTML(v.time, plainAltTime);
    } else {
        altTime = false;
        var plainTimeHTML = getCritterTimePlainHTML(v.time, altTime);
    }

    
    if (v.hasOwnProperty('locationAlt')) {
        var plainAltLocationHTML = getAltCritterLocationPlainHTML(v.locationAlt)
        var plainLocationHTML = getCritterLocationPlainHTML(v.location, true, plainAltLocationHTML);
    } else {
        var plainLocationHTML = getCritterLocationPlainHTML(v.location, false);
    }
    var template = document.createElement("template");

    template.innerHTML = '<div id="' + k + '" class="critter-wrapper ' + checkedFilter + '" data-checked="' + isChecked + '" title="' + tooltip + '">\n' +
                '<img class="critter-wrapper" loading="lazy" src="' + v.icon + '">\n' +
                '<div class="critter-data">\n' +
                    '<div class="name-container critter-name">\n' +
                        '<div class="critter-name" text=' + v.name_formatted + '></div>\n' +
                    '<div class="critter-divider"></div>\n' +
                    '<div class="data-grid">\n' +
                        plainLocationHTML +
                    '<div class="bell-container icon-text">\n' +
                        '<img class="icon" src="./static/image/icons/svg/bell.svg">\n' +
                        '<div class="data-text">'+v.price+'</div>\n' +
                    '</div>\n' +
                    plainTimeHTML +
                '</div>\n' +
            '</div>\n'
        
    return template.content.firstChild;



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
                            $('<img/>', {'class': 'icon', 'src': './static/image/icons/svg/bell.svg'}),
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
        //var $elementsToAppend = [];
        //var $elem = $("#bugs-data-wrapper");
        var elem = document.getElementById("bugs-data-wrapper")
        $.each(data, function(k, v) {
            elem.appendChild(generateBugsHTML(elem, k, v, userDict));
        });
        //$elem.append($elementsToAppend);
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

async function setPrevTabIconInactive() {
    makeTabIconInactive(prevTab)
}

async function setActiveTabIcon(tab) {
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
    var dayElem = document.getElementById("day");
    var dateElem = document.getElementById("date");
    var timeElem = document.getElementById("time");
    var timeAMPM = document.getElementById("ampm");
    var d = new Date();
    var minutes = d.getMinutes();
    var hours = d.getHours();
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
    if (tab == "fish") {
        var fishDominant = ["rgb(19, 43, 53)","rgb(253, 208, 15)","rgb(99, 76, 69)","rgb(164, 65, 37)","rgb(112, 89, 82)",
    "rgb(101, 75, 47)","rgb(24, 40, 52)","rgb(40, 48, 60)","rgb(32, 49, 67)","rgb(129, 82, 67)","rgb(40, 52, 39)",
    "rgb(22, 55, 69)","rgb(11, 30, 38)","rgb(88, 77, 24)","rgb(97, 93, 76)","rgb(114, 100, 61)","rgb(43, 54, 62)",
    "rgb(100, 91, 71)","rgb(145, 110, 22)","rgb(103, 88, 72)","rgb(183, 159, 115)","rgb(222, 220, 207)","rgb(32, 46, 63)",
    "rgb(8, 43, 36)","rgb(209, 148, 119)","rgb(32, 34, 37)","rgb(36, 42, 41)","rgb(123, 96, 73)","rgb(10, 34, 52)",
    "rgb(227, 212, 193)","rgb(18, 43, 59)","rgb(53, 36, 13)","rgb(31, 32, 38)","rgb(5, 40, 57)","rgb(126, 103, 66)",
    "rgb(156, 97, 14)","rgb(27, 67, 36)","rgb(93, 87, 73)","rgb(124, 63, 41)","rgb(109, 101, 67)","rgb(120, 90, 52)",
    "rgb(77, 118, 135)","rgb(19, 28, 32)","rgb(106, 100, 62)","rgb(108, 104, 58)","rgb(23, 24, 45)","rgb(8, 48, 61)",
    "rgb(86, 82, 7)","rgb(130, 107, 50)","rgb(48, 75, 101)","rgb(60, 23, 28)","rgb(72, 75, 109)","rgb(23, 56, 31)",
    "rgb(24, 48, 27)","rgb(149, 160, 58)","rgb(71, 7, 9)","rgb(28, 33, 37)","rgb(178, 171, 118)","rgb(0, 0, 0)",
    "rgb(56, 85, 11)","rgb(29, 52, 45)","rgb(203, 160, 31)","rgb(127, 89, 64)","rgb(57, 74, 86)","rgb(107, 95, 84)"
    ,"rgb(24, 32, 41)","rgb(39, 45, 52)","rgb(147, 92, 34)","rgb(167, 157, 117)","rgb(24, 40, 63)","rgb(200, 163, 21)"
    ,"rgb(6, 38, 54)","rgb(111, 100, 58)","rgb(103, 101, 61)","rgb(108, 100, 70)","rgb(241, 152, 56)","rgb(14, 44, 39)"
    ,"rgb(29, 35, 54)","rgb(150, 87, 26)","rgb(93, 109, 47)"]
        for (var i=0; i<50; i++) {
            element.append([
                $('<div/>', {'class': 'wrapper-skeleton'}).append([
                    $('<div/>', {'class': 'image-skeleton', 'css':{'background-color': fishDominant[i], 'opacity': '50%'}}),
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
    } else if (tab == "bugs") {
        for (var i=0; i<50; i++) {
            var bugsDominant = ["rgb(102, 110, 50)","rgb(83, 87, 18)","rgb(78, 13, 16)","rgb(147, 94, 17)",
            "rgb(30, 40, 29)","rgb(11, 27, 10)","rgb(11, 30, 12)","rgb(18, 47, 11)","rgb(124, 96, 48)",
            "rgb(116, 95, 43)","rgb(87, 86, 83)","rgb(110, 84, 49)","rgb(27, 15, 17)","rgb(30, 47, 41)",
            "rgb(94, 73, 53)","rgb(157, 86, 20)","rgb(37, 14, 46)","rgb(35, 37, 35)","rgb(57, 48, 53)",
            "rgb(41, 13, 14)","rgb(215, 138, 17)","rgb(21, 34, 16)","rgb(122, 82, 45)","rgb(31, 66, 32)",
            "rgb(86, 71, 28)","rgb(38, 44, 56)","rgb(255, 255, 254)","rgb(120, 103, 69)","rgb(40, 45, 51)",
            "rgb(97, 96, 94)","rgb(124, 97, 42)","rgb(125, 95, 35)","rgb(15, 18, 34)","rgb(196, 170, 98)",
            "rgb(50, 30, 41)","rgb(27, 48, 34)","rgb(248, 236, 85)","rgb(151, 96, 29)","rgb(114, 100, 85)",
            "rgb(19, 32, 57)","rgb(128, 93, 42)","rgb(52, 29, 30)","rgb(33, 54, 119)","rgb(14, 16, 15)",
            "rgb(139, 71, 31)","rgb(87, 80, 14)","rgb(197, 165, 96)","rgb(19, 31, 52)","rgb(44, 51, 40)",
            "rgb(35, 39, 43)","rgb(19, 22, 17)","rgb(100, 90, 80)","rgb(55, 70, 51)","rgb(173, 8, 6)",
            "rgb(60, 37, 38)","rgb(123, 89, 29)","rgb(32, 46, 54)","rgb(15, 17, 30)","rgb(24, 36, 44)",
            "rgb(93, 87, 69)","rgb(161, 80, 15)","rgb(113, 76, 60)","rgb(110, 79, 53)","rgb(103, 93, 82)",
            "rgb(12, 47, 37)","rgb(53, 75, 44)","rgb(98, 50, 45)","rgb(18, 17, 15)","rgb(25, 25, 28)",
            "rgb(70, 93, 110)","rgb(134, 86, 43)","rgb(143, 176, 32)","rgb(12, 8, 7)","rgb(89, 81, 74)",
            "rgb(160, 77, 26)","rgb(138, 85, 20)","rgb(1, 0, 0)","rgb(113, 104, 62)","rgb(18, 20, 32)","rgb(134, 85, 31)"]

            element.append([
                $('<div/>', {'class': 'wrapper-skeleton'}).append([
                    $('<div/>', {'class': 'image-skeleton', 'css':{'background-color': bugsDominant[i], 'opacity': '50%'}}),
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
    } else if (tab == "villagers") {
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