ACTIVE_TAB = "fish";
var gotBugs = false;
var gotVillagers = false;
var prevTab = "fish"
var fishElements = [];
var bugsElements = [];
var d = new Date();
var CURRENT_HOUR_24 = d.getHours() 
var CURRENT_HOUR = CURRENT_HOUR_24 % 12 ? CURRENT_HOUR_24 % 12 : 12;
amPm = d.getHours() >= 12 ? "PM" : "AM";
var amPm = "";
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
        var data = await getCaught("chores");
        $.each(data, function(k, v) {
            if (v == true) {
                $('#'+k).removeClass('chore-wrapper');
                $('#'+k).addClass('chore-wrapper-ticked');
            }
        })
    });

    var rock = new ProgressBar.Circle("#rock",{color: '#a6ad7c',
    trailColor: '#d5ccab',
    strokeWidth: 11,
    duration: 500,
    easing: 'easeInOut'});
    var rockPercent = 0;
    $('#rock-wrapper').click(function() {
        if (rockPercent != 1) {
            rockPercent = rockPercent + 0.25;
        }
        rock.animate(rockPercent);
    })

    var moneyRock = new ProgressBar.Circle("#money-rock",{color: '#e3b645',
    trailColor: '#d5ccab',
    strokeWidth: 11,
    duration: 500,
    easing: 'easeInOut'});
    var moneyRockPercent = 0;
    $('#money-rock-wrapper').click(function() {
        if (moneyRockPercent == 0) {
            moneyRock.animate(1);
            moneyRockPercent = 1
        }
    })

    var fossil = new ProgressBar.Circle("#fossils",{color: '#736cc4',
    trailColor: '#d5ccab',
    strokeWidth: 11,
    duration: 500,
    easing: 'easeInOut'});
    var fossilPercent = 0;
    $('#fossils-wrapper').click(function() {
        if (fossilPercent != 1) {
            fossilPercent = fossilPercent + 0.25;
        }
        fossil.animate(fossilPercent);
    })

    var bottle = new ProgressBar.Circle("#bottle",{color: '#a8bbfd',
    trailColor: '#d5ccab',
    strokeWidth: 11,
    duration: 500,
    easing: 'easeInOut'});
    var bottlePercent = 0;
    $('#bottles-wrapper').click(function() {
        if (bottlePercent == 0) {
            bottle.animate(1);
            bottlePercent = 1
        }
    })

    var crack = new ProgressBar.Circle("#crack",{color: '#e5cc52',
    trailColor: '#d5ccab',
    strokeWidth: 11,
    duration: 500,
    easing: 'easeInOut'});
    var crackPercent = 0;
    $('#crack-wrapper').click(function() {
        if (crackPercent == 0) {
            crack.animate(1);
            crackPercent = 1
        }
    })

    var turnip = new ProgressBar.Circle("#turnips",{color: '#52a525',
    trailColor: '#d5ccab',
    strokeWidth: 11,
    duration: 500,
    easing: 'easeInOut'});
    var turnipPercent = 0;
    if (amPm == "PM") {
        turnipPercent = 0.5;
        turnip.animate(turnipPercent);
        $('#turnips-wrapper').css("opacity", "40%");
        $('#turnip-timer-wrapper').css({"diplay": "inline-block", "z-index": "1"});

    }
    $('#turnips-wrapper').click(function() {
        if (turnipPercent != 1) {
            if (amPm == "AM" && turnipPercent == 0.5) {
                
                console.log("No new turnip price avilable");
            } else {
                turnipPercent = turnipPercent + 0.5;
                turnip.animate(turnipPercent);
                $('#turnips-image').fadeTo("slow", 0.4);
                $('#turnips').fadeTo("slow", 0.4);
                $('#turnips-title-container').fadeTo("slow", 0.4);
                $('#turnip-timer-wrapper').css({"diplay": "inline-block", "z-index": "1", "opacity": "100%"});
            }
        }
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

function minutesUntil8AM() {
    var midday = new Date();
    midday.setHours(8);
    midday.setMinutes(0);
    midday.setSeconds(0);
    midday.setMilliseconds(0);
    var eightAM = (midday.getTime() - new Date().getTime()) /1000/60;
    if (CURRENT_HOUR_24 > 8) {
        eightAM = eightAM + 1440;
    }
    return (eightAM)
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
    var turnipTime = formattedTime(minutesUntil8AM())
    if ( 8 < CURRENT_HOUR_24 && CURRENT_HOUR_24 < 12) {
        turnipTime = formattedTime(minutesUntilMidday())
    }
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
                            '<div class="data-text">All Day</div>\n' +
                        '</div>\n';
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
            '<div class="data-text">'+finalTime+'</div>\n' +
        '</div>\n';
        } else {
            var timeHTML = '<div class="time-container icon-text">\n' +
                                '<img class="icon" src="./static/image/icons/svg/timer.svg">\n' +
                                '<div class="time-container-mod">\n' +
                                    '<div class="data-text">'+finalTime+'</div>\n' +
                                    '<div class="data-text">'+altTime+'</div>\n'+
                                '</div>\n' +
                            '</div>\n';
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
                                '<div class="data-text">'+location.trim()+',</div>\n' +
                                    '<div class="data-text-modifier">('+locationModifier+'</div>\n' +
                                '</div>\n' +
                                secondLocation +
                            '</div>\n';
                            
        } else {
            locationHTML = '<div class="location-container">\n' +
            '<div class="data-text">'+v+'</div>\n' +
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
                                    '<div class="data-text">'+location.trim()+',</div>\n' +
                                    '<div class="data-text-modifier">(' + locationModifier + '</div>\n' +
                                '</div>\n' +
                            '</div>' 
        } else {
            locationHTML = '<div class="location-container icon-text">\n' +
                                '<img class="icon" src="./static/image/icons/svg/pin.svg">\n' +
                                '<div class="location-container-mod">\n' +
                                    '<div class="data-text">'+v+'</div>\n' +
                                '</div>\n' +
                            '</div>\n'
        }
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
                            '<div class="data-text">'+location+'</div>\n' +
                            '<div class="data-text-modifier">(+'+locationModifier+'+</div>\n' +
                        '</div>\n'
    } else {
        locationHTML = '<div class="location-container icon-text">\n' +
                            '<div class="location-container">\n' +
                            '<div class="data-text">'+v+'</div>\n' +
                            '</div>\n'+
                        '</div>\n';
    }
    return locationHTML;
}


function addCaughtToggle(k, tab) {
    k.addEventListener("click", (function() {
        var thisCritter = this
        if (thisCritter.getAttribute('data-checked') == 'true') {
            updateValue = 'false'; 
            thisCritter.classList.remove("critter-wrapper-checked")
            thisCritter.classList.add("critter-wrapper")
        }
        if (thisCritter.getAttribute('data-checked') == 'false') {
            updateValue = 'true';
            thisCritter.classList.add("critter-wrapper-checked");
            thisCritter.classList.remove("critter-wrapper");
        }
        thisCritter.setAttribute('data-checked', updateValue);
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
)};


/*
FISH FUNCTIONS -----------------------------------------------------------------
*/

$(function() {  //Fish tab click
    $('a#fish-button').bind('click', function() {
        if (prevTab == "chores") {
            $('#search').css('display', 'flex');
            $('.search-wrapper').css('justify-content', 'flex-start');
            $('#chores-timer-wrapper').css('display', 'none');

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


function createFishHTMLElement(k, v, userDict) {
    var checkedFilter = "critter-wrapper"
    var isChecked = false;
    if (userDict && userDict.hasOwnProperty(k)) {
        isChecked = userDict[k];
        checkedFilter = "critter-wrapper-checked";
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
    var tooltip = 'Click to mark as caught or uncaught';
    var template = document.createElement("template");

    template.innerHTML = '<div id="' + k + '" class="'+checkedFilter+'" data-checked="' + isChecked + '" title="' + tooltip + '">\n' +
                            '<img class="critter-icon" loading="lazy" src="' + v.icon + '">\n' +
                            '<div class="critter-data">\n' +
                                '<div class="name-container critter-name">\n' +
                                    '<div class="critter-name">'+v.name_formatted+'</div>\n' +
                                '</div>\n' + 
                                '<div class="critter-divider"></div>\n' +
                                '<div class="data-grid">\n' +
                                    plainLocationHTML +
                                    '<div class="bell-container icon-text">\n' +
                                        '<img class="icon" src="./static/image/icons/svg/bell.svg">\n' +
                                        '<div class="data-text">'+v.price+'</div>\n' +
                                    '</div>\n' +
                                    plainTimeHTML +
                                    '<div class="shadow-container icon-text">\n' +
                                        '<img class="icon" src="./static/image/icons/svg/shadow.svg">\n' +
                                        '<div class="data-text">'+v.shadow+'</div>\n' +
                                    '</div>\n' +
                                '</div>\n' +
                            '</div>\n' +
                        '</div>\n';
        
    return template.content.firstChild;
}

async function getAllFish() {
    var userDict = false;
    var idToken = getCookie("user");
    if (idToken != "") {
        userDict = await getCaught("fish");
    }
    $.getJSON('/fish/all', function(data) {
        var elem = document.getElementById("fish-data-wrapper");
        $.each(data, function(k, v) {
            fishElements.push(createFishHTMLElement(k, v, userDict));
        });
        for (var i=0; i<fishElements.length; i++) {
            elem.appendChild(fishElements[i]);
            addCaughtToggle(fishElements[i], "fish");
        }
        $('.wrapper-skeleton').remove();
    }).done(function() { //Hides/shows check off fish on page load depending on if the global hide is checked or not
        if ($('#caught-checkbox')[0].checked) {
            hideCaughtCritters();
        }else {
            showCaughtCritters();
        }
        if ($('#caught-checkbox')[0].checked) {
            markAvailiable("fish").then(() => markAvailiable("bugs"));
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

        }

        
        showTab("bugs");
        hidePrevTab();
        setPrevTabIconInactive();
        prevTab = "bugs"
        if (!gotBugs) {
            createSkeletonHTML("bugs");
        }
        if (!gotBugs) {
            getAllBugs();
            gotBugs = true;
        }
    });
});

function generateBugsHTML(k, v, userDict) {
    var checkedFilter = "critter-wrapper"
    var isChecked = false;
    if (userDict && userDict.hasOwnProperty(k)) {
        isChecked = userDict[k];
        checkedFilter = "critter-wrapper-checked";
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
    var tooltip = 'Click to mark as caught or uncaught';
    var template = document.createElement("template");

    template.innerHTML = '<div id="' + k + '" class="'+checkedFilter+'" data-checked="' + isChecked + '" title="' + tooltip + '">\n' +
                '<img class="critter-icon" loading="lazy" src="' + v.icon + '">\n' +
                '<div class="critter-data">\n' +
                    '<div class="name-container critter-name">\n' +
                        '<div class="critter-name">'+v.name_formatted+'</div>\n' +
                        '</div>\n' + 
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
}

async function getAllBugs() {
    var userDict = false;
    var idToken = getCookie("user");
    if (idToken != "") {
        userDict = await getCaught("bugs");
    }
    $.getJSON('/bugs/all', function(data) {
        var elem = document.getElementById("bugs-data-wrapper")
        $.each(data, function(k, v) {
            bugsElements.push(generateBugsHTML(k, v, userDict));
        });
        for (var i=0; i<bugsElements.length; i++) {
            elem.appendChild(bugsElements[i]);
            addCaughtToggle(bugsElements[i], "bugs")
        }
        $('.wrapper-skeleton').remove();
    }).done(function() { //Hides/shows check off fish on page load depending on if the global hide is checked or no
        if ($('#caught-checkbox')[0].checked) {
            hideCaughtCritters();
        } else {
            showCaughtCritters();
        }
    })
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
            gotVillagers = true;
        }
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
    })
    $('#search').on('blur', function() {
        this.value = "";
        $critterChildren = $('#' + getActiveTab() + '-data-wrapper').children();
        for (var i=0; i<$critterChildren.length; i++) {
            $($critterChildren[i]).removeClass('_search_filter');
        }
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
        }
    })
};


$(document).ready( () => {
    $('#availiable-checkbox').on('click', function() {
        if ($('#caught-checkbox').checked) {
            $('#caught-checkbox').prop('checked', false);
        }
        if (this.checked) {
            markAvailiable("fish").then(() => markAvailiable("bugs"));
        } else {
            unmarkAll("fish").then(() => unmarkAll("bugs"));
        }
    });
});

/*
FILTER CAUGHT CHECKBOX -----------------------------------------------------------------
*/

async function showCaughtCritters() {
    for (var i=0; i<fishElements.length; i++) {
        if (fishElements[i].getAttribute('data-checked') == 'true') {
            fishElements[i].classList.remove("_caught_filter");
        }
    }
    for (var i=0; i<bugsElements.length; i++) {
        if (fishElements[i].getAttribute('data-checked') == 'true') {
            fishElements[i].classList.remove("_caught_filter");
        }
    }
}

async function hideCaughtCritters() {
    for (var i=0; i<fishElements.length; i++) {
        if (fishElements[i].getAttribute('data-checked') == 'true') {
            fishElements[i].classList.add("_caught_filter");
        }
    }
    for (var i=0; i<bugsElements.length; i++) {
        if (fishElements[i].getAttribute('data-checked') == 'true') {
            fishElements[i].classList.add("_caught_filter");
        }
    }
}

$(document).ready( () => {
    $('#caught-checkbox').on('click', function() {
        if (!this.checked) {
            showCaughtCritters();
        } else {
            hideCaughtCritters();
        }
    })
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
    amPm = hours >= 12 ? "PM" : "AM";
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

    //setting turnip image by time of day
    if (amPm == "AM") {
        document.getElementById("turnips-image").src = "data:image/png;base64,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"
    } else if (amPm == "PM") {
        document.getElementById("turnips-image").src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAgAElEQVR4nOy9d3Tb6XkmyiRO7HXu3iR3d8/N2VhEYwVANQIgwS7NuIyn2uOxp89IIkiqDQlRvbH3CoBgkUgKAHsXxaZCimLvvVN15u7NZu+e3RPv7rl7s4n93D++71cBaKSZcWTH/p3zHhRW4Hne/n4vPDz+cP3h+l2/Xo8J/K42RnVWE60e1EWrZrXRqlmtQbWqjVY9JKKmohKIzqDc1hjUZq0hIPKd5nf+5EW/jj9cz3nFxAT+qS5GdUxjUP6tJloFIkqRkOe0BpXgsfhWa1D9J220qkJrCHj5Rb+uP1zPcBHwA45polXQGHhAsqCqePe555zvuyRLr/aIeseLfo1/uNxcjOZrvxRQJY8U3K3z94rJo4TWoPylLkYZC+CPXvTr/cPFuzjwGVBV0LIE4Gu+e3MvBF5oGbROlkI9GBy3W/qiX/cfLnppY5UHxNrqzpRzgIrBdkWMp1gTg2rjDyT4Lbk00arbfKC01AqwYMWoEHLRG2E5ckTkyYgUyhBRJENksRQRRTKEpnghOMEXGoMKztZACa3BhXX4GiRITk7+Y/0RlZfGoHpbF6NO1kar2nQG1bDWoKSi4t2qhrXR6quaaPUpbazq9dBje/79N/wW/u5e2iPav9ZGq//JpdYbVNCf80akSYqoUskzSaRZitBUBYKMfrx4QWQpeNmD1qB+ZhLoonfKdAZ1nNagatUaVP/VfawiJqGTRfq1Llo9o4lWnw+K3aP8Db/Fv92X1qCOFwZ23BumP+PzzMC7kvBsObRHXLsRESE2Xo8J/K67/zE4brdUG62u0RhUv3IFsrvAVfi8e2JoDaptjSEgJ/z4nn/3z/ne/1ZcOoO6yp0PD8+WI8pKAbU+H/j7yohElUihP+vjhgS85wzqSvH/FhUT+G+1BlWxJlr1D+J09Ona7joYdf08/39QTf7ekUBnUFY5aWS0EtrDSgI6BT6Sd38flS8Df18Zfa5MgvAcOXRH/F2Yah4QBtW7zP+ljwkI0Earv3ANqHtw3dcpnoU8KmgMyt8vEhAL4Pxm6M/7cMAz/t0qFYDsCnCxRPFuIwpl0MQINU9gpg3qv9dF75RpDAGvaKNV/+3LAXSXfrrMOlx+jUt5uVhF9/tEAo4A/OKNCqFpCoHWs27A6qzt+8s8eYQQBYwU/P30NjTN6ynmWgmtQT1BglJnTXVyAQbu67qjftCf8kHoZW+EZykQkS9HWLoXQi54I/ikL7SHn+YaXBDNoJp8WlzyL+ZyFwOEnPdmTf2+Uk9nk0+tgZO5L5XySCDlhBIgqlSC4FO+PA10pd1Pi+qJ6I76Q3/OB2GZCuyzSgXWZl+5CymTIKJAhpBL3tAd93PzN4VFK61B1fmi8fmNX0ILwJnkoHg/ZwKItZ8hAO8x93WpW4m0yKA74kojnSuQYnMddNQf4RkKjng8kFmSlUldfp3/OLJYhtBkL2jj/IUkMAizIV2sWvOiMXrmKyph91/qolX7dYaAM9oYVYk2WlWhjVFVkI6cuklnUDdpBaJs0hqUTbwAiHvxBhUii6XYR80+G/hZ+ebfUxgLCEjAA73EmQTheXK24aSNVkErIKAL8OOUCE32In+DgrifB+x+JxK4sQai5yMK5NDGuMsWlNAZlGUvGtenXkGH1Tu10coarUG1rYlW/pqYri+LhJ8lQiZvOBP47RMBvI8hgABwF5pvFQnv+aAEPzf/k/Cx7rgfokxSIbg8Auxn7vMDT1duwAUB9pWReoUoG2FvtQblL39wcuefv2icna6ohN1/qY1WmrQG9T+6T42cn9MKbp+eM4fxAkHiBjxF8QABk3EFTgSgoEdapYgs4YSxKMFnfEQm3pmkQYl+5GdEWr1fDOaXab5I9oseB8X7uXE/KmhjAw68aLzZC8AfaWMDDmijVX/nyn86A6vkge9K+9286GgVInLlLOBiAhDQpQLLsM9KzT29jSyRIsLiQqwS7LNKEHLJ24mE/B6E/pw3L5vggkkW/FKJkzZ/GQH2i4R5PizNiyWAoA8SrYTGoH7wW5EWag27d2sNygmhRjtrrtuKmZtc2HUkrER4jlwIsEh+3uyFH1byXAGj5U6gSxBhkSCyRIKIEnIbWcJPCUX/h0GJkMveiGRcjqimIM5IXNYgnlH72djBKoU25ilpokG9oYtV7XohwEclR31HG63Kcm/uXZtyrYvnnIni3iKEXPZmc38h+MQSvG6XIXFURR5bPRFlIc2gCLMUYSYpwk3kPhEJoko8EWkhJIiwSBCWo3BheYjmR1qliCyVYH8pqSHw/XxUqQSRVFxWHxnr8Azg84UpWWsNrt8zbbTqf2qiVUf/WcHXGtQhGoN642l+3VWurI31R5DRF/oL3ghN9kZoihdCU73IbboXQlK8EWz0FVoFg5AguiP+iCiQ8WIAZxKkr+zGpzd8EVUiIb7aIkGEWYrwYinCijkCRJolrERYSIUxvEDm9P8HJfghsoT3d8p4JKDiXHsQFp2eRgBXwSMRT0SZZNDGuShOid5frUHVHnY44K9+o8BHJUd9SxejytUYlL9ynS87g6477oewdAUiighokVYpvSX3I8UBmVWKCJMUISletDjiIv2KIVVBZ/DJbeKoGlnru/HaNQUiLVJElUioJSBEiDAxIkGEWYJwkwThlAThhVLu70SroD3sj4gi8r/tY6wOU3208gBnwOeXqUUkcOcGXIPPfT2yQC5yBW6KUQbV57roneG/EfBfjgn8C41Bdct96iaK7GNJyhZVwgDNv3V1XyoiB9Fe/Wlx1477G/oL3ryMgJNDPX7I2dyDU+NqLsq3ELAJ4FKe0MfFUoSbibCENqgQli3nLIaFCo0bIqxEInmEiOI9Zp8XZwNlEieTLyaAmCTh2XLOGvIGXIS1CiW00ep/0sYEXEpOTv7jbwz8kBi1QmNQbTizTuzvaZp0yhcRRVK2SMOAzTRynN8wjgDCnyFCInNxJEzuO1sCCX5ar0DO5h7kbO7B6zY5Ad8iQYTFkxCgWCoUhghmCSItEvZvBSX6IoJxGTRgZOIFhgRR9P4+notw6kZa3VuB/eWePHFPgP3lEoRnKlwEhbygmyti/Vobrap7OSbwL742+FpDQKQ2WvVfvjxAU0J3zA8hmXKEm4jJ5QCXCgBn3iQGcKEVkLh0EeEZClF1jP7tGBUi8oSZwcvlUmStEwIkDKlY4CLNEkSYXBCAERoP6GL9oaXkijCRn4my0N9h4UCPovejrJQENJXkk0BACEoAsalnwH+pQoIfVUnxukOON2rlLoPEyGIZdJ/5u1U+Foto1X/TRquyopKjvvO1wNcYVP/LZVrEvzUoEXzOG6H5JMgKo2+YGFxx716gMVaOEJwVkAgeh2UrSCVMZA20h5WIMgnz//PTAcjZ3IPsjT14pUrOEcAsQUQxkfBihgxE+8OLJQgzSaA97A9tjBKRzPMmCSJpvBDBAG7hAshIC4/cVo4UrgZWxAT4QaUUn3b74tL8TuRs7kHa8i5E9/nh+5VS926iVIKQ8+J6hRgT1a+00eqVrxwTcOCLI0+h79F95oeQLDlC8qUIyZchpECGUPrGCSZ3eJohDNq4r4ljAW7wg4shQpK8XbJff9KX/A765h+/q2TdwLF+JQnwGAKYXEt4sQRhhVJoj/pDl+iDsGIJwoqYOIF+D0sGEkiStFIIOldbIPGCOCPYVybBq3YZjvT7I2N1N3I29yBlaRc+7fLFy1ekgn6CKxKwLiFLDm2sq3iMiRNU/6AzqB3PXTZmwHeeX+OVbA1KBJ3zIaAzkkduQ4tIzh1BAyZx5MwA7JzGuXYZYksQfNpHUCJl7odny6m5l+JAly9LgMz13fh+hYzV8ohi1+CHF0sRVkQIoE9VEAIUSsgtYzFMxMqFm6QIM8kQZqKvlZdSsnEOk4byLMDbDV5IHFUhe4P8b5fnd+KjTh+8VOEiS3iGAlKUmde/MIhdpBLaaNV/1MWoX31m8INjdu7lzL6bgk2MP3RJXgjOoaCLJLSAvklmWnUrEUqkCFRX6RxHEmGOv6+UuBfiB4Xk1B31I0UfixTvNHizBMjZ3IMDXX40AKQkoNocLgI/rEAKbaw/wgq5ukEYdRPsfZMUYcUc+AwBws2clWEs0b5SCV4ql+Kj6z64OLuT/X/SVnbj/XZvAvyXgC0OCp0el0kQetmbEEDUdNMZVP+ojVbdeCbwk5OT/1gTrZpyHeXT2fzDSgSlKRCcK0Nwjgz6HA70kHwZQgulCC2UIayI5tqiEixjEl2lb6wrKOE0X9j04SwIGeUSpkCaaCX0l7wRYZHilUq5gABJ87t4YHMSWiglFosSQJ8hR1CiLyFDkZAAkcXE/IcVc2kkU10kKSRHgsgS8v+/WatA8sIuwf9yeX4nfnxNJigjswUmkb9/nlQxskCOoHg/IW4GFbQG1X96JgLoDOo4cUQpOIR53A/BmQoE58ihz5URyZMhNF+G0AIqhcQFhBbJaO5MTSFTe7fwAZbCXT1ATAynwpFVipCLzoGQ9og/+zeYTIBxA284FFSTJQgvkiCsSEKJK0VovhQhBTLoL3pDn6Kgj4lFYEgQQbOFCJOUDShZ4JkgkdYbIs0SfHrDlzX1jJweV+PlCt7rEBeKyvhAe4pu3ROA/zg8S0FjA6ocBuWvvhz8o7p/wxxscNm4OeoPXaYcQdlyBOcQCcmVITSPCiVASL4MIYXERIZTAkSwIhWmUQyoJUJg+VovrhUIyGCRQnfU32nWPjRTgXCLRGByM9Z3I+62P6v5YYWchBZIoM+VQp8rhe6kD0Jy6eMcKfR5UoQWMlZASlyDiWQ6DNARfNNvkeD7FTKcHFULgM/Z3INjd5Vk+kjchuaNpu1zmyp+uUXgCykcce/LlxJAawgwiJoMguhfl+wFXZackCCLSHA2IQET/LFSKGMra5EWJpVy0YItEWs1P+jzFBaRXMQNkVYpwrIUvCoYLUSd9EW4RYqTY2pkbxDwU1d34fx8ACItUhrceVKRICSfI0DQWW8EZ0kQlCWBPscT+mwJIYHIJYSZuOwgnEeEnzV4IW1ZaPKzN/bgYLcva82Er4W6NzcTzO7axu6aR4y12FcuQfAJX1aRv5QAGoO627nYQ81Ioi90WQoiGZQA1BKE5Mihz5MT/8+6AWIuI3jRMTGP/FYsuY0qEWq3eNSLHysIysS8NzLopK/QYhmUiCgmBEhf24201V24vLwT5xcC8HaDN8IKPRFaQCSs0BP6fE/ocyTQZ0kRdFkOfY4ngrM9oc+TIDhbguAcKULzJUISFBErwJAgqkSGw7eVTlqftb4H77V6O8U5USV8AnAxAFssKhO7AX7V0D3wfAlO9GXfk6eCrzfq/5XWoPp/ncu8KmhildBleEGXqYAuU4GgTB4BsuXQ58gRki+HPp/chhVKEV4oYXPkcOovIy207eoiKBSafk77neMAqUuJKJI5/d+hyV44MapC8souJC3vwsXFnTg7H4C4u0qE5EsQWuCJkDwquZ4IyfFEcIqUBZ6RsDwJQvJIPBBaQFxAaKEUYfmEAGEmCX5cJceZqQCkr+0W+PzsjT14t9mbrRAKikPifoGoYri/zJNIuSsRA+/8tX0WCYLj/VnL+HTtj9u1x3VZUQmt0Re6DAW06VQyFFwskCmHPpcjgD5PjtB8OUILZAgrlCG0SEYjZq7lyo8HmBRR2ANwZepdB4F80R3z5zKVaBWCT/rg+LASF5d24sLiTpxbCMCZ+QCcnlMj0iJBaD4Hvj7bE/osT+izJAjO9oQu0xNBWRIEZUugzyUSkk9cASl4SRBSIEFokQTvtnnj/MJOJK3sQurqLmSuk8JO9joBn+khRJVwWu/KkgkIz2szO2s4B3JUsQwRuXKEZyoQluqF0MveCLngw2UCvLb6Uwmgi965X9hR4pn/C97QpCugoQTQZZA4IDhbDn0WsQD6PEKEYCr6fDkhAEsCGcKdgkK+BXBuDHHVQfedQ34bOZg960desC7eD8fuqXB+MYAF/9ScGqfm1HjNJoc+dwf0OTsQnLsD+mxqAbKI6ddmeEKb5gltuieC0iTQZVJXkE3ihJB84t5i7vjj7EIAzi8G4PLyTqSsEAJkb+zBey0+bIs5khf0MqVi8esWlMhFWQGr1VZS/dOf9XExwi5+LOzXPJUAQQbV28ISL+dLtekKaNI40aYr2ABQT2+Dcyj4OQqWAKGFcpYALAnMUrYxwxSJ+ODyCeDcJHI9O8A8DklTCNPXI35IGFPh3EIAzlLwT84Seb/NG/rsHQjK2oGgzB0IziL3g7OIJdBlekKbSkST5gldhhS6dCmCMklm8IMKBYzjKpydJ7/73EIALi1xBPigzYetObBFoRKh2Re7BEExjI62s5peKCX+3M2OJEGF1k2X9qkEEGcA/Jxak6aAlgKvSSMuIChTjuAs4gKCs+UIyiHg6/OoBeC5gtBCmaBwEmHhTeRYhAHeDyvleMOhwE/rvfDzJm+83+aD99t88LpdwUufZE5pY2QJ8c3CAogSCWMqnKXanzijRsK0CvFTShj6/RCcvQNB6Tugy9wBXdoOaNN2QJtBRJPqCW3qDmgzJNDSjCAom1iBn9Z54/Qs+Z2M8AnwQZsP12gycemhmABRVs4tOI23lXmSKSMLc4rZRa3fjaY713HU/6SJVv3fT3cBMarTAuCZwYNj/qzpF8QA6QpoUhmXQCQoS4HgPDlCqITxCkPMBE6kmfOD77Z4I6bPD8ZhFS7M7ETm2m6nCFocTZ+f2Ynjd5V4t9WHEkHGEiDCIoXuuL/AfX02qqJ+PwDxUyocm1Di6IQSxydV0GfvgC59B7Tp34M27XvQpn6PkICKJm0HcQXpEgRlkEDwk24/nJ5T4wzV/LPzAcQFLATgwuJOfNjhi7AiHvgmYXmYMf38IVS+O+BmJqQIvewFbQwTxIm1W9QNdWn+ldBEq/5BE61e0hnUcV9CAHWuy77yZ34C06/N4AigS1NAmy6HLk0OXbqcECCXswB6Whzij1/96IoMsTf9kbZCwE5d2oXT42ocvqPEwW4/HOz2w0fXffDRdV98dN0XH7T74L1Wbxzq9cPZyQBBhH1uKgBv1nhxmUCJBHo60s28IceGVEicVeOzKRWOTihxZEKJIxP+ODqhxD6zFLq070GX/j0Epe9AUAYRbfoOaDN3QJfFWAUyl3d0WIlTc2qcnuPM/jke+Iab/ggrom1mk2sC8CuhESIiMBNQoekK3qFRV61ecfnbjXUwqP+XNlo9o4sJeP9Lu4HcYUxRISjBF5pUqu0MCdIo+Gm8oDBNjqBMhaA+EJxDagMRRVK8clWBj9p9EXfLHx91+ODNGi9SDrW4CvKExR9+LPBShQy/aPHB0QElkhdJsSV+SIUfVckRWSJFeJEM2hiufB03qMRnU0TrD48TiRtTInbMHz+6IoMmZQe0qd9DcMYO6HiiTaMESN+Bl60yGKdUODmrZrX/HAX90tJOXFzaiYQRFaLMtC7AN/90viDcxMt+eGQIZwhhlSA8X4agBF+edqvcgO1qIksFbbR6U2tQ3dQYVPXaaLVJFxNwTB8TEPBMm1E1BvUt8Xl0TbQKGqMvAlMV0KQoBETQpCigSZFDkyInVoBXHGIIoM+VQ58jY8uoEcxAJo0BIkskbBAYJUiNuJTQOffnBU5WCT5o90HG6m6kr+7GL5q9EVkigz7RjzWZsYP+ODapRNyYP2LG/GEY9UcMlTdqFATo9O8hKGMHgjN5JEgn4EcVSxE/SazIyVk1awHOLQTg4hJJ/c7NBuD75TJBa5kBPZK5XyQsGYfzSBFZLIX+vA8vwHMn4n6/+u+1BnWrLkYVHRS983tfCvLTCaDacDlidNIXgSkKTlIVCEwmBAhMUUCTKoeGWgE++MG0URSSSwom4ZQAkSUSLgDkmT5xeTfKySq4GRq1SvFKtRxnJkkR5pNuX4RlekFnUEFnUMEw4I/D4xzohlF/RI/4I3rEDz9r9YY2lfj6wJQd0KR+D5qU70GbQoLC8AIJjo0qYZwmBGBIcHqO+P2LSztxeWkXXq1SsD2F8GIKdLEEocUShNJZgkj+7AGPAKGpCmgP+8OV/9aKseB8/7w2duePopKjvvW1QBcQIFr9P1yZl8BTPkIC8IigSaFkSOMsAEkJZQjOlSEkT4rQXNJlCyuS0pyYAz7C4iL6LRVr/LNJVCkJ0M7OByCm3x+hnymhM6hwqN8fsWMcAaJH/HFoxA+Hhv3wfq8PNCk7EJhMCLA3eQcCL++AJmkHQrI9cXDAF0cniAs5OauGcVqFEzPEFZyZJy7gZ/Xe5HXmM6+TglxMO4355JZtPFEyRJo9eYdQ+SncU/J5g/JvNQb1wW902tfDw8NDb9T/H/w/xPc3e894IzBJQSRZgcBUOQJT5AhMlmPvZQX2JsmxN4kEgboMOYKz6YxAHiFAGAN+EQkCBZGvReJcAnVLAE7jhdZBKrj/Y5scR0eUODygRERiAD697QfDiD8MI34wjPrBMOKHQyN+ODjshwP3fKFN2UHSvbQd0KbsgCZlB4IzPPFhny+iR/wQM+qPuDF/HKOZQ/yUCsYZNU7NqvFxpw+CcyWUABKE5kkQkktJn8dVD8PySYoaVkjJUCxB0CkfZ2vrlNM7mf91baz6w29U8z08PDx0sapdwoCDiSJV2HtegT1Jcuy5TIBmwA9MlrPg770sgyaFyQSIBdAzFoDWzsOKeHNzgtSH8/9CAkjciDMxxLX1/eVSHLzjh7hhJQ7dI+Y+esQP0aPk9sCQLw4M++LAkC/C8j1J0JfhCW0aKQS93+PD/gwTM8SNkczh2KQSn02pYLjjT1vGMoRQdxecI0NQFpHgbBmCcmTQMxawUMIOmOgveDm/1+LmmygeEKZ8qv53kt/5s2+MAPq4XTrnKhKRPZdk2HNZhj1J5HZvkhyBSRwJNMlyBKaSYJBkApwl0FMiMC4ggokDeKkQUx51mqEXlIZdabwwFhC7kZfKJfjkti/1+cTkHxz2w6FhX3w6ROSTIV/sK5FAl+EJXYYngjI98U6HNw4x4DMySgLII+NKHBlX4vCIEhFFUuizJAjKlnGSybx+GXRZMuizSQwUXsDNE4ZliM78u7AC7pZRiAjxzZFAH6fSuUwtYvw5AjCSJMfey5QENAvQpMqhpRaAyQh0GeTNCM6hQ6L51BoUkYAw0iwR5r+CiF/YAnaVAQj9P1dKFWwFKZfgw5tEmw8ME83/dMgXn9zj5KUyGXSZpP7/Y7uCksSPJcEhHgHixpQ4Oq7E90vlCMqQIDhLAn0WBT9Lxr5mxgroc2UIK5CyaaE+yYud0nEu5YpI4XQQVCUiwDdoCYgFcPZFgXH+2H1Bht0XZdh9QWQBUjh3oEklwGvTiOjSiQkMzmZmBblBkdACGcKLaIu4RGgJIpjmiMgaOMcC3C1bVhWMm/MtgSfe7fPGx4M++GjQBx8NEuA/HSIu4AdXZQjOkiDSIsOnQ8RKHGStBSXAiB9ix0g28WaNF7TpEiKZEugyZQjKlEFHJZiaf302nZIqkiC8QIrg894IOuWD4AveCElWICxTjvAsOcLTFQhNJlvD9Gd8EJToC91n4vOQ7ku/uhjl1ycBZwGYaJP88sDDfth1Xord56WEAJdk2HtZhr1JMkEsoEmRQ5tKCZBOTCCjBSG5DPBMG1XKFkIY7edawq6HRPmniwTWgO8y3BBgXylpn77d7YX3Bnzw/oAP3hvwwceUBD+qliMkX4L3b/pQC+GHg0N+bKbAuIKYUX980OULTZoEmlQpaQ5lSFhTH0zBD8oSDslGmCXcsbQSYeHH1QAHMxsYUSAH2Vrmyl2IFm583X1BhADOdebAOH/sOidlSbDnIrEGey7JWNdAAkEFJYIMujQZIUAG782gBAgtIEMVEbwWKSmHEgI4gV8iQaRZhkize413uRFUNHmzr1SC/RUSvNWlwNu3vfHz2954t98HHw764hWHHG+1erFW4ROGBNQKRI8S7T941w8h+RT4TCkdF5MgmI6R6XNI9B9CW8UhBVKEF0mcjpNF0Yno/a5avbw9AmQ+kAy66M/4iub9nWMDbYzq7DdgAURugCHAOUoAHgl2X5CzJCBBoQyByTJo0mTQpspI65Saw5BcLgYILeSOV/FjAIYAkcVShJ7zQfBxFfSxOxEatwshsTsRFrcLoXG7EHpkFyJPBCD8rD/Ck/wQWSQT9tBFQaRglrBcglcaZXirW4F3bnvh53e88dMub7x/l7iGjwcJCZjbQzRziB31x/fLpXQeQIKQHE+EFEgQnC+BvoAMlIYVSMj0cBET59BKoIWQYJ+VzP2xEz5lzNSPcL8AOwBCCcCsn4nIlT+lUqiEJlr566DYgB9/QxaAFoFihQTYfYHKec4SsC4hiYKfJoM2XYagdCmCs4iE5EhpSkjerPBiYfAXWSJBeIEcERdUeP1UBF4/SeTNU1H48YkwRB7Zi9C4nQiJ3YWwuN2IOLwbkUf2IPLIHkQc3oOwU0pE5svx0y4Ffn7bC2/f9MJbXQq83inHq+0y/LBOiv1VUkSWcinny9VSvN6hwNu3CBF+dscb7/X74IO7PgR8xvyP+uHtZi8yPZRDZwhpLi8YBefX+3kzkJEWXnuXIQAfbCr8raUsAXh7B/aXSRCWqoDrmICtGj6JOhL1vz0/AWICAlylIIExSuw6K3UiwZ4LPHfA1AeSZNCkyqBLlyEoQ0qCoRwZ9NmkOKLPoyQo4g5N7LfKcKByPyo6zmJhqhFfrN/EF+u38PnaTSp9+HytD4+WezA1VouOrkJYHWdw0RyNQ8lv4IfxwQiL2w19bAAiL/vhg7u+eOe2F352ywtv9XnhzT4F3uiT4/VeOV7tluOVLjl+1CLD/iqOCC+VS/FaiwJv3/TGz2574507JE44MOSLg8O+ODDgiyiLJ0KL6ARxkQRRJgmiKLgRFgl7EjqSZ9WieL6eHfEqFWo6/3afwAJ4Cmf9eJYh9NaXdp4AACAASURBVKKXi9SQyyq0Maqir0UAYbPBHzvPSLk44IIUu3gE2HNJht2XSJEoMEkGTQqxALoMKYKyZWR8KluKkFwJQvIkNA6Q4PXSXbD2JWBtqRVfrN+ictM1AVaF8ni5B09We/B46QYeLl3H2GAV6lrScLh+Hz6654t3+33w8zte+NltL/zkJiHB670KvNpD5Mc9CrzWo8ArrXLsr5RiXwkF0+RJ4odyCV6ulOJHNhlerZXj9ToFfnhVhpesUkQU82MUT27GkXcMLIo35RvFWLlSidOmkCgBCRiQ3QyACojhSSd93cQC0ep/eu4tokGxe5ROK8joL991WspZAZ4bYOoCuy/JiQtIlmFvsgyBKZz/11MXEJwjRUS+F444XkXrYDaerPXxgKfgr91kH7siwJOVHjxe7sbjhRt4uHAdDxbacX+mFduzLdiaacLZwZfx8aAv3hvwwS/6ffCz2974yS0vvHVTgTd7CeivsiLHa1ReaSFn8EmTyhMRZk9EWjwFgxvMEoiXyshx7ZfLpXjVJsc7DV74qIPOLnT44GC3L6L7/PBKlYwsqi4lpGJnAflmXUQIDmxPAdhCEpD7UWYJXRLhXELWGlTQRivnn6tfEBaj8nSXZuxOlGPnWUqC81LsuijF7otSQYEokAIfmCKDJlmGoGQZwtP88HNTGNKbY9AzVIyHq90i0G+51P4vGPBXe/H5Wi8Bf7kHj5au48F8B+7PteP+bCs2p5uxOdWIzcl6LIxX4ZNBf3w46IP37vrg53e88ZObCrzZR+S1HgV+3C3Hqz1yvEotAEOA13sUeK1Tjv3ljPn25LSZzu3tt5I3nw0qmePe9Ht+VCnDB+0+ODdF9hFkrO7GwW5fvFQh9PkC8MWngHgj4PtcEYB5nn5PWIrChRvgLLjOoH7tmQkQlbD7L52138WEiauKlSgi/UGCHk3Xc/E5T6PdytpNVvsZrf9i7SaerPbiySo19cvdeLjYiQfz7bg/04KtmWZsTRPgN8ZrsTZqR8vIKXw8SAK4D+764Bf93vjpLS+8Qc3/az08EvTK8Uav2Boo8OPrckSVC/sOjNbtKyX+m91twFsGJe5FvG6X4/ggORxyfjoA37/KmXqXaat4+tedK+C7CSpk9NtdQ0nd81xuQGNQ/a1zP8B9e1I8oaKNVuO8+RA2Fzq/HHgeAT4XyZPVPjxe6cGjpRt4sHidAD/biq2pRmxMNmBjsh5r4zVYG3dgdcSGleFryBp+AweGfPHxoA8+vOuDd/t98M4db7x5U4HXemkM0K3AjynYr/Vyz7/Ou/8qtQTikWwGXH7Q5kqbGXJElUrw8Q0f5GzugXFYRVM6IXEE9Qze33BKCcs86cJLkkXs4xEgit1m5qJYZFD+Sns4QP7MBNBGK/vdNSBcL4lQshXDVxMj0HvL+uzAC3x9n0CerPbgwWIHAX6e+vjpRqxP1GFtvBZr4zVYGbFhZbgaK8NVWLx3FfFje0iLd8gXn9xjSECsAEsCagXe4AH+Rh8nzONX2+Q8TRMCIji9K3qOA5g74/dhhw85E9jjKyQUL/1lt5VaecMxoipnZAlZc0dOF3lye4isElFAKB7pD8h5LisgJIErF+A8vBCb+Q7uL3c9N/gug721PjxZ7cWjxU7cn2uj4DdhY7IBa2MOrI3asTJ8jYA/VIWle1dx914mjk0oEUunfQ6N+OGTe7744K4vft5PUsK3b9NgsI8Q4Q1G+/u4+2/2KfBWnxfe6lEIgOT78GcTT/AtxaFeP2Rv7ME7TV7cOtkST3YqKpzZWShaQRdllfAeS9mCErtxpESCKKsU4Zlyl66YBITq//BcBPDw8PDQxqj6ac/ZBfiCogOi036Khys9Xwl8V/n+52t9rM+/P9eKrekmbE41YGOiHmtjDiyPVGPpXiWW7l3B4uAVLN6tQOPIESRMqXBknHTsYkb9cXDYD58M+ZK6f7833rlDSPDTW154s88LP7mpYAnxVp8Cb90kdYOf3CTp4/evSrg9w240niGHeDuoOKiLKpUgcVSF9NXdeO2aDPusJMiM5C2rZDeUFcnYA7WRdJMZd8CWG6nniEBuhR96xcPKoPr75yYAsQSqflfFBn778tOUN76y5jvHAJz5f7hIov0H8x3YmmnC5mQDNibqsDbuwPJwNZbuXcXiYAUW75ZjYaAMlom3YJxW4fikCrFM73+ENHQ+vudLgsI73vjFHS/87I4Xfnbbm5SAbxEX8fYtb7x9yxvv3PHGL/q98W6/N35QzRHgyzRdIKImVBQ99v39KxIkLezE2akAWjXkwA8r4rqloQUyhBXJhCtoimXcEksTb5aSt7Mw5LI3nMx/tBIag/qrEcDDw8PDYUr4yFacAFtxAmwmobRUXcTjld6vDPzE7SvorEnBcJdFYP4fL3fh4cJ1PKQEeDDXTiwADfyWh6uwNHiVgl+O+TtWZM/sw4lpFT6bUuHIBBn3jh31h2HEHweG/Egb+B6pD7xzxwu/uOONdwcI0B/c9cH7d33wwQDpBXw06Is3WuTYVyZBeJoXguJUCGU+o+gpmr+PCdTKuM5lVIknK5EWCV67pkDm2m68YffiVssU0bOTBWSzWgg9UMuupimij+nJKuZ5ZriUnTIWnIjiL438ihbAZj6lsJsT/rsYeJspATUlidicaftKwD9c6kJr9UXYio+juvAoGitOC7T/0VInHi5eJ4We+Q7cn2sl2j9mx8pwNZaHqrA4eIWA31+KuTtWtI4cxanZABhnyJGvY5Nkaid2zB8xY8z8nz8+HfLFR+wgiB8O3ON6/kzs8G4P+RyAkHM+0MWooTUQCTnty6WApUKNF3cfScePHoM3S1ntjSiW4qN2XyTcUwkJQNfqhfBu2RNV+RxBQgsZgtCj6UXMqhoJwoukcA7ev4YFsBcbm/mab+cRYKq/6iuBPztoQ0PZKTgsCSjPNqAiJwY1lgTMDFTj87VePF7p5ggwT7KArelmrE3UYXXUhuXhaiwPEf+/cLcc8/1WzN+xYqbfjKQZHXv2L35aheOTSnZ+jyFE3BgJFOOohWDGu45OKHF0wh8HB/2wv1QGvdEfOgq8zqCGzqBCcIwaoaf9eeB7csJE60zxiILPAswIBTVxRI3vlysQVkCAJJtV6I6iAilC87gZw1Bm/Q4dptFTCaE/G0bnLcMLpaIPx/4aBHCUnAyym+N/bTOJzX88bjbnfSXwh7osuFZ0DNeKjqG25AQq8w+jMv8w6qyJmLx9hZZ5u/Bo8Qar+ffn2rA13YyNiVqsjjmwPHINS0OVWLpXicUB4v+JFSjB9dFjOE9PAJ+eCyAz/DNkhp+5H0/dRPyUCp9NqvDZlBLxU0ocn1Ti2IQKnzZqcCTnTQI+9afM2YKgGDWCYgIQcoZ8YhkT4DEkIBE7d+aBXS3HHI8v5LT7pVIFDnb5k0GZHCq5PMmjs5R0CVco//k80WwFjzSug8CvQACbyTjsyvQ3XTn/lfz+/D0HruTGojwrGlUFR9BSeR5ddemwmT5DjSUBQ10WQoCVbkqCTjxcICXf7ekmbEzWY2O8DqujdiwPVWFpkGQAC3fLMT9Qivl+K2Zvm9E9mIikOQ3Ozgewh0FP846Dn6RESJwlJ4QZiZ9SIaE7DLOD5ZgeKMePEvRccYtaAJ2BECAoJgChF3zYwsy+Mk9ElRI/z0Tq4UWcrw4rJLuSiH/nBmLervFBZJGcHR9jiUDJoM9hNq8QMjCr+PTZdNqazliGMB3WTDlcpuvPSwCb5cQbfJNvL+buzw7av5L215acgDXjAKwZB9BQdgr3bpjxcLELN2pSUVeaiKn+Sny+1kvKvys9eLxEA8GF69iabsTGZD3Wx2uwNuqgQSBJ/+YHyjB3x4q52xbM3jZj9pYJY7ezUTj5Q3YfwOk54U4AIRnIAY9LQ+FYuldJagsj1ahruIggg5rJo6kFCEBwTAD7OIJ+ZA13spfk9WHFhADsdhQKODMhxI7F5cjwskUBfTY3Qh6cw80SMmQIzpHR01ZkyljHGzkPziMSkitF0CUFXGVtz00Ae7Fxho38qdiLE9B+LfkrgV9fdhLWjAOwpH0CW/Fx3G7Np1+7idaqC6gpMeJOW74gEGQswcP5DmxNN2F9vI4EgqMOrI3YsHSvkgaBVszdKaEE4Egwe8uExhEDLi7sdloMwWwHIRKAy5PBmLlrwdK9K1geriIVxpFqHM/8GRsDaKn268iyReIajihJ/s4Uc3jbxsMKpbyVufTEUB6nrYww84PsGYJM7jHznC5LBm2mHNoMMmSjy5LRcTS6n5HZanbG9e7k58oCHJaTMqe0j95fHmt8bvCn+6tgTvkI5pSPcCU3BtftyXi03M3m/7UlJ+AwJ+BOK58AvRwBFjuxPduCjck6rNOmz+rINSwPVxEL0G/F3G1CgLnbJSwJZm6ZMH2zCP0Dl5A9F+60G+j0HLl/YW4P7t3LJDUFagFWqRUYvmlCaOxOov08N6A1qNmyePBJX7paVoZwmq6F0Mg9hO5PJCadAK7PJW1xfS4P/EwyO6lNZwgghS5DBm2mDNoMKQu8Jo0M22jTZdDSMwfEWpBZRF2Crwh8pm6j3nxmAtSYEk6KAz+7KQHddZlfSftLMw+h8PJ7sKR9gtqSE9gQpY5tVRfhMMdjoKNIQIAnK72UANdxf7YFW9PNWJ+oxdqYHasjNizfq8TiYAUJAG9beBaAI8LMLRNmbpkwebsAbSNHcWXybaTPhuAsc55/MQDXR4xYuFuGxcErWLp3lVQYh6pYIpzI+gV+mhCBIIMaQTHUGoiqo/pkL5KrM8WcPGFAp8+REr+dTe4zI3Is+JkycqQuTQ4dHafTpEqhSZNCk0qAD0ylbXb6WJtBhm6ZsfvgLKngrIGoEtjy7ObfnDDOmHx+2rc22fzc4FfkGGBK/hCFl95DVcERdNakOH1PnTUR1YVH0deURfv/ffh8tRdP6PAH6QZ24P5cGzanSC9gdfgaWwlcuFuOhf5SzhXc4azB3G0L+9zsbQtmb5kxe9uCsYFcdI0k4vpoPP16KRYGyrB4txyL9wgRVigJhrqLUVZ0GJGHd7NxgJbGBqzE+iM0hy7Dotqvz5WxO5SDc+g5gSwpgrOFZp85QcScpdCmyaFJI5PVmlRuviIwhUxaaVI4AgRlyKDLIgdQdKLPDOAf8dcaVJefCfzOqtP/2m5K+LU452+qOPfc4N9qyUNx8gcoTv4A1owDqC875XI2oNORArspHu3XLju1hZ+s9uLxcjceLFzH/blWbE41YX28FqujDqyMVGP5XhVHhP4yzN+xYp4hASP9VszdsWCWFQL4XL+VLSLN3SH35wfKsXi3AstDV7E8VEVkuBpNFWdwOe09NgvQGdTOfZFjfuyGdH2+lETt2cJzgkGZ5NwA81iXQTU/nbMA2lRywEZDD99qUmXspHVgCpm01lI3EJgmgzaF/F7NEX+XR/q0ZCjkJ89EAEfJySCbSPPtxQkYvG56LvC3566jMv8wipM/RHHyh6gpMWJ20Obye3sbs1BjMeJGbSobFwhmApa6cX++DdszzehvzcXdjnwSC4zVYG2UBGsrI8QiLAySrIAFllqB2Ts893CnBHMDVsz1ExLM3bZi7k4pIUB/KXUDhAAkI7DhVhP5H98/+RKCYgIEXVC+JdAl+pLDIcwZQZ6JD8qiB0YYzU2nR+hYzVdQEnALODT0zOVeegxvbzJ1AdQy7GUWc5zzEhzkFc1t/ENQvPr/fCYC2EzGA4LAj8YBKxNNz0WAOmsiLGmfwJL2CRyWBPQ0uI8frtuTYTfF47o9WWgh1m7iyUovHi7dwIOFdjRWnEKtJQFNFacw0lXMkmB11IbVUdIaXrpXiYW7xC0QzS5hYwJiESyY6y/B3EAp5gbKyP07pZjvL8PCQBkW7laQYHDwKpaHrmJlpBqro3aM91nhsBhxteg4fnBU5yLS5h4HXfCmPpkz8UEZMvacpC5DDl26gmh6CifE9JMdTIHJ9IBNEpG9SXLsTSYECEwmWs8QQZMshzbWX6D1wglhdfUzge/h4eFhsySkM+DbqRuoLUl8LvDbbZdRlnUIpuQPcTUvDr1PAf+L9VuwFR+Hw5KArto0AQE+X7uJL1Z68Wi5C23V53E1LwZXcmNwregoWirP0rpALZkIGrVhZYSUiRfvXeGCwzslBHxq7omUsaZ+YaAcCwOEMIt3K7B49wqWBqkMVRFyjTmwNlaD2pITsJnikZ9zCMExLlwAq4H0MxRY/y5HUAa3QEubRsDlH6lj5bKLx0nc6eu9l+XYc4nOYSbJSVxwzI/19S4mtn4dFLtH+cwEsJtPXBVX/tptz5f7203xMCV/CEvqx2isOOMU9QvlJq7mxaG68Chu1KTiyWof+/wXdC5weaweLZXnUFVwBFdyDKjMi0NdiRFTt8toVuDA2pgDK6M2rIxco42iCizcLcPCQClu1ifDVnQYjWVG4h7ulhHAB8sp8JQM9JYjQCVWRq5hddSOjck6dNiS2IzodNI7XIDlal4i1p+s1T3jA12KgjX1mjSySieQajUf7L1Jcuy9RE09FZYAl4klCLwsw+5LMvagbmCiOO8Xj/M/R/Tv4eHhYTcZ28Uu4FZL/jODP9hpgjX9AAovv4eyrEMY7i556ve3VV/E1bxYOCwJuNWSyyMAJ6sTTWirvog66wlU5sehPDsaVflxuNWUhY2JWqyP19AKoR2rY3asjFRjaYjOCty7isayE7iSE41rhYfRW5dMzPxdOkdwt4wUkwbKOSsweIUOm1zFynA11sZqsDnVgFtNOYK6yIcnX3YZcImLMNp4P+gyifYT305MPrtTge/jRcJYir2XiOy+RA/hnJUj8JgfxOZeYPpj1P9Bd1T3b56LAA5TwojY/w/3lD4T+KO9paguPApT8ocwp36MqoIjT/3+heEaXCs6hqqCI2i/dgm3W/NcEqCzJgWtVRdIB9Ecj7LMgyjLOgRb8THMDlwh4FMrQIS0jJeGqrA0VIka82cozzqIyrwYtF49TdO8K5QEFVgYvIIFqvkrw5Vsu3lluBqrIzasT9Rhc6oRw10WQWm8qug4fnAs6Nfup6S5eUlyYlpBwOSDnCQS/nPJcrJ7iXn+kpwewJEhMM5PBLjQ/+uiVf8UHKeOei7wPTw8PGxm47KtOJ59kTZTAibvVLoFcbi7BB22JHTWpKAy/zAKL7+Hosvvw5L2CRrKTwu+9wltII30WFFnTcS1omO4mhcHhzkenTUpmOqvcmoyPVi4gcaKM2irJsWi+rKTuJoXi9KMAyjNOIBO+yWsj9WwVmB9ogbrE3VYGSUk6Kg+h8q8GJRlHkB51kE4zMexNFSJRXaaqIKL+ocrsTxchdXRa1gdtWFt3EHKz5P12JxuxEz/VfY9YaQs/wiCYnZuutZEFZODQ3vGB9o0DuQ9l7hVOwzogck00Etytgj8791zQQ7XpOPl/dGq1OcG38PDw8NhNi7ztd9uSsDcPYdbAtxuzUPTlbOoLjyK4uQPkXf+5yi89C5K0j+F3RSPDlsS6stOosZiRJ01EQ3lp2ErPk5awsXHUVd6EjdqUjHaW4onK70sSRjpby9AY8UZ1JacQEP5KXTXpqGt+gKu5sXCkvoxKrKjca+zkE4L1WFjsgGbkw1YH6/B6pgDLVdPw1Z0BFdzDSjNOICq/Fha6avE0hCT7pHHy0NE49dG7VifqGU1f3OqEZvTTVibaABRjnjBbERKxoevag3KVYHZjyYnc3RMunjUnwP3MkcCvraTWIBkAHuTKEkucuDvYX7mtJt6P0e6rwY+ZwG4LMBmSsDyuPv6//b8dXTWpOBa0TEUJb2Pgkvvojj5A1QVHEFVwRHYTJ+x/f/KgsO4VnwcV/PiUGs9gcaKM5gfck+uL9ZvoachE61VF1BfdhItlefR316AW825aL5yFlUFh3ElNwZLIw5sz7Rgc4oOjk7VY32yDh3VF1BfakRDWSKqCw6jLJO4gXvX87BMR8mXhivZgs/KyDWsjdqxNubA+ngtIdRUA7ZmmvFgrg0PF67DbjJCHCM5TMZ3v38s9N8zJBCPzjOPA896OxOA0XK+5icpCNgXue9hgsa9l+QIPOrnJuJXfj3wPTw8PGwmsQWIx/p061NBWh5vQFdtGsqyDqE08yDsps/QUnkedaUnYSs+zmp+bckJ3KhJRacjGV21aRi/VfHU3/v52k3caslD89VzqCkxorchE2M3yzHSY0W77TKqCg6jLPMQaq0n8GCuHdtTTWR4dKoed1qy0VRxCg2lJ9BWdQ6N5SdRlR+H6oLDGGjPIb2EkWosj1zD6ghpLq2OXqPgO7A+UYvNqXpsTjVia6YZ9+fb8XipGw3lZwTNMVtxAmzmxPeam5v/5JXjUd8LMgRcE4BvUEPLFGYO+7Pa7eT3+VouDgYpOQLPK6CJ439OsPDwjtag/q9fe2+gzWxcZkwc8wJdFYE+dxGo1ViM6KpLx1R/FZbHGnC7NQ/ddem43ZqHW825uHfD7LYa6C5IvG5PQmPFGTSUn8ZARxEWR+rwcKkb0wPVuFZ0DObUj1GaeRAdtkvYniFnBLemm9BWdR6tlefQU5uCka5i1JeeQHn2IVTmx6K3LoWcJBqxYWXUhtUxOy0m2WgQWYO18RqsTxACbM+24uHCdTxZ7kGHLZmtjzDvkcNifH9wMPlbzc3JfxYVp4li3QAzQ8DrHGqO+2HvJS+XBODAV5DHF6nmX1Qg8ASzPlYpIgB/9l/Z+7XAJwRIWBbXAeaHap4K1L0uCxrKT6P56jkMdj5fyfhpsj13HbXWE3BYEtB89RyGuiy4zztu1m67DFvxcVTmH0aNJQHDXSZsz7aiqyYFrVXn0V2bjJn+K9icakRb1TmUZhxAWeZBtFedo/3+a1gdowQYs2FtzE7ApwRYG6/FxmQDtmdbWAL0NmZz4BcnwFYcLyBAr9n8bV2M+paWto111AIwzSMtzQoCT/hib5KCA54GhXsuyrHnnAJ7Tnthr9EHmsPCM3/MiJqT6TeofqmNVf3oGyCAcfl5hj83plvR15SNWusJNF89h625jqeb9ecgwJ22AjgsCagqOIIOWxKm7lRim/f7l8cbUF92ig6afIye+nTM3a3Cdftl3KhJxuStcnqAtBm3mzJRlnkQ1vRP0FiWyJaPGc1ntH911MFagfXxWmxOMQTowJPlbvQ1Zgta5HaRBeg1m7+9/7hGpzUof8UMjujYFjJ7ZJumh0ryaacxpHCkifGH+3TSda5PTL/yl9rYnV8ffA8P2goWzQIMdbkv5jxY7CIpXfFxtFZdeDqoa89nAW4258Bhjkd14VH0NmRheqBakCZ+vtaH3oZMlKR9AnPqx6jIMaD5ylm0X7uEvsZMEhfMtuD+XBvWJxtQlnUI5pQPYTcdY+sFfAKsjtpZWRuroXFAI7bnWvBosRNPVntw3ZHCxkbM+8QQoLfX/O1eM5Gww7vf0caofkU2dai5KSKDqFjk1LjhNN1daikoPBlU3xz4Hh4eHg6TsUtoAeLRVZfxVKDqShNJLb8u/Rsz/1+s30Jb9SVUFx5FdeFRdNakYObuNTY4ZAiwNtGIa0VHUZL+Ccqzo9FQdgqtVedx70YxHsy34f4ckbmBSpRlHURx0vuwFx/D4r1qlgSECHzwHVgbr8HGJEkD78+34clyDz5f60PLlQvkveEFgQwBBgeTv8UQYPBa8nfCDu9+R2NQ/kobrYSO0X5qCVydsHLZYTQ4m3suxvgGNZ+57Cajje//7cUJqC874xakyTuVqC87hdaqCxi7Wf71QOdZiK3ZdthN8bBmHEBVwRH0NWZhdbyRTgl10xUx3Xi02IlbzTm4mheLqoLDqLOeQKc9Cduzrbg/10rOFNCDpRXZ0bCmfwpb0VEsDlZSf++gpt9OzT/x/esTtZQATbg/14bHKz10fC1R4P/FBGDcAJ8EWoPqV04Bm1MVz0Ud38XXtKyFUK/oDLt8vlHwCQESkgSTQJTprnz7g8Uu3GrJQ0vledxsysH23HURoMxZv2dYEOHC/FcXHkVFjgH1pScxM1CF1YkGPFrqwqOlG3i42EnlOh4udqKt+gJqS4xounIGA+357HmC+7Nt2JptxtZMM6oK4kgxqCAOc/1XaCuZgj/mIF2/8Vpa/asj/n+G8f89eLzSy1YC+e+P3Wx8ebai4k/5JGCEdQfR6i9c9wzclI9dpHnU3z8OilZlvR4T+N1vHHwPDw+PGnPCq/wAkBkNG795RRjMrd3Eo+UeDHQUoas2zanpw871rZLVLl88hQRCgpCRsA4a4V/JjUVXbSqm+yuxNdvKA/86OzL+cPE67l4vws2mLIz1WvFgvp3uFGgjCyWmm7A13QRb8TGUZhyArfgYxnstPAKIg78abEzWY2ua5P+PFrvwZLUXW7MdwjMSTMu85IQPB37znzQ3N//JbEXFnzLS3Jz8ZwnJb/2lPjbgssag+u9umzdiEx+t/J/aaNWmxqC+pTWoM4OiAwJ/I6Dzr2brqb+28wtB9Lar1rV/f7Lah5HeUjxc7HIGf4XM9z9Z7WVP/vKB/mKdfyKYWwnzeKUHrVUXYDcRAvQ2ZGC6v5I7LMIHf+E6Hix04P58O5aGHbg/18YRYK6N1gYasDXdiKu5MShO+gCVebEY6izkmX8qYw6s0jRwY7KOVADnO/B4qQufr/Vh/p6DNyLP1UqaK878hdACNP8Jc18sB0+/8a/fOR7+7/Yb9X8T8dlu74jPgrxDYgIVITGBCu3hAHnY4QC59nCA/JkneH4Tl92c8IBfDLIXJ8BhOeH2NND2XAdP4/vYwU4+AfjCbvuiB0CerJAAi/n+xyvdaL56FtWFR1BjSUBvYyYWhux4tNTFM/uc9pPTw1zAxwjZKVCPzUlS0LmSa0DhpXdRnnUIo90mHvh2lgBM9L8xWc9VAFe68WS1F3faCoWmvzgB9mLj/xi8lvydwWvJ32F8f3Nz8p+JCcEXThyJzAAADeJJREFU/nNA8h8D+CMAf/TCABdfDrPRZOeZOIYI7ppCn6/dxJOVbrK6baWbAtlNlzvxwF/pwWPm6Bez6m25iwp9jj5fZ01EWRYp895qzsHKeAMeLd2gLoABv5NbGkW3iNyfayVmn2o+s1RiY7IeFTnRKLr8HkrSPsYNRxIv+LOzccA6vwI404KHi514vNyNJys9aL5KMgAHrw9gNyU8cEUAVyQgYLuS3zIC2MzGHwgbQiTavdmU68YNkLGtR0s38HCpE4+Xuthg7fFKFyHEag8bwXPSRUGlJFjhvtZYcRplWYfQUnke9zpNwuCP2Ruw0EGPj7ezWv9grp2afdIQ2pgkt+vjtSjLPIDCS+/CkvoxuhyXufyfSQPHiO/fmGzANjX/jxZv4NFyF8lKmPeDcY/meNhMxhvuCMAnwe8UAXrN5m87eDsBmIqX3WzE1myHQPM/523yesiPzpc6WYAYzWWAfrLCaT4DLPkaR4D60kRczYtFT306xm+WC7T/wUIHuzFse7YFm9OkCbQ914rtmRZsTDUQ4YG/Pl6LqoLDsKZ/gsr8WAx25GFlhF//d2BtjJj+zakmUv9fIuA/Xu7GvRtm1uzzXaPdlHD8liPvz7sqkr/b1ZX83ebmwn/V22v+dm+v0BV8Gfi/VQTw8PDwcJgTOsQlYZspgXcs/CY9vEGOcz9c4lIyYpbpIkcakD1cpERYJkQhgHfi0RInrCtY7oLd9BlqS4y405rHEYAhF/X52zMt2JxuZE09aQc30tkAYvrXJ+rIxNB4DRrKElGedQgO83GMdZucff84rfzNthDfv0zc2dZcO2qY/F+UHjvKTqq7KpK/21VBwO/qSv7u4LXk77gmAAe2WF403k5XjTnhA36qw9w6zEZszrazmv+ENeVdeMQLzu7Pt9NcvJX00ueoOV2kQC50shH8wwUeQZa60N9WgKqCw6gtMaKvMQuzd6s58Bc7ScDH8/Mbk/Vkf9BUPZHJemIBJuqwPu4gU8NjdtRbjSjNOID6UiMmb5VwVT8m9Zuqx9YMKR0/WrrBbiftby/ktJ+1AvGwFRu/YMz/l7mApxHgRWPt8hocTP6W3Wy8L3ADlPW9jdkCf/5oqQuPqW9+ME9Ssu25FtZE359rIQc7aIp2f66dlGnn2/BgvgMPWRJ04tFiJ9qqL+JKbgw6HUnoqU/H0mgtG/3fn28jDZ6ZZmxMNZAtoZN1WJ8Ugr85WY/1SbJLkIn0rxUeQWnGp7AVH8VYj4mt/Ami/rlWPJjvwBNa+duabYfD7DwEQhTiRDIDuivwXRHgReP6XFeN+cTH4sVQjEtYHKklvpzKo6VO3J/vIAsd51pJIDZNzPL2TDO2Z1qxOd2E7dkWbNNI/f5cG+siCCna8WDhOjquXUJlfhx66tNwqzmbWpV2bM+0cOviJuupia9no/wNJuqfYraJ1QoifVvREZRlHkSN+TMC/qiDFn3q2L7/g/l2PFzoJMWr9Vu42ZwnAJ4XBP5dXenZv+JX/NyBz0/3XjSmz3VRK7DFAs87LNJSdZEWeHrw+WoPHi7ewP2Fdtyfa2E3em7S+bwN6pM3pxqwNdOErelmbM+04P5sGyVCK7k/34r78+2os55AjSUegx0FGOmxYHuOkGZ7mu/j64mJp5E+8zdIFE9XyI45uAh/1I6m8pO4mmtAvdVIv1aD9fE6bE43YGu6Cffp4MejpS58vnYTK+ONsFPtt4sOyzrMJxLcFXvEef/vJPjM5bCceEdQ/OAFQKN9ZTS966IbPdvpyvZmbE01UrPcSDW1BpsTdWxVbmummV3vTixEM7anif/tsF1Ea9U5jPVZsTRsZ13J9nQTtmigxxBgjZkGHq9lb9cm+EfGOOlrSMO1oiO4fu0iHfggE8QM+A/m2/Fo6QaerHTj4VI3GsvPOa3Hoe/BY4fj5J8z4IoB/xcBfl1JosRRbDTZzQn/H1sSLo4XZAW11pPYmmsTuICt2RZsM9E41UZyaIOAszFei83JemxPN2F7uhmbjFZTd7ExUY+++nTc7cgj8300yt+YIhaFkIAGeBNkXQzTvyeg11CNt5E5P0ZGyQmfjmsXMNN/hQV/Y7Ke5vxteLTE1Cz60F2fxVk9/vwfKQR9JK7i/U4Eds9y1ZmNOrs5od5hMv4jMw/A5b7xPH9I7o/frCBxwFIXPcJN0zPGH0/WE5CYKtt4DTYm6rA11UjcBN39Q/x3PTan6nG7OQuzA1e4oUyWIA10X3A9NiZqsTZBRr9X6YkgQgQ7OR42XIWV4Sp2lzA54mXDaHcxO/RJGj6NRPsXrpO0b7UXo73lwo6fIAA0jhLwf4dBdnU5HCf/3GZKmOb7e7HG89+ImpJETPVXkyUOq6T0+4ie4r0/y+XoG5P1tM3KP7xBR65p1W1jsg5rE3XsFvCZ2xX0a9SK0Pl8Nsofr+dM/lgN1sbsJN0bo0SgE7/MFnEG/NVRO2b7r1DNb2CnfR4sENP/eLkLiyO1XNQvav3aTQn/xVFxxvNFY/WNXwz4go1gvIBPfFSspeoiNkSj4tx2bxoMztIN35MN2BivJWf4JkhFjphv4g7WJ2pJtW6CkGBjoo5E9VRDN8bI9xNXQqp6qxTsdTrCzUz1MKtjVkausbJKwV8bo5ZnupF1OduzraQOsdiJR0s3sD7ZhDrrSV6ljzf2ZUr4td1kfPNFY/WNXw7HyT93UM13JwwRGivOYaq/yu2AB+nwdePR4g08nL+OB3Pks3y2pmnOPlGHTQZkqsEbE1SjJ8infqwzI9mMhtMTOoQ8dqzT9I2b4HHQwxzEzzPavsIMfI6R72NO+WzNNHH5/kIHW73cmm1Dc8V5jvii9Ndhii980Vj9Rq5m66m/tpsTfmk3iTSeF/U3VpzD+M0rLg9uOhFgpRuPaVbwkFYD2cxgppnk8UwKN16DjXGi/evsWX8uqt+YrGODPXYjyBjx+2ujNl4ZlzP/a6N2nkVwsOZ+i8YPTJn3wUI721Hcmm2jI+Zi4OPpc8aBwcHkb71orH4jV7P11F87zAm/5Ad2jLTbkjBz1/aMn/lDmkOPeZs+SWWwjeTws6RRwxJhqpHk8OPEBbABI40H1hjtZwgxVssSZHXMgfUxO63xU/dCrccqc1Scuo2taaLx2zTtvD/Xxpn9xU6sTTah6cp50T7EeF7Hz7jVXHHmL140Tr+xq9l66q/tpvhf8rpbqClJxOrE828E+4J+whdDgkdLXXRap40Wfdpo374VWzMt2KYf+sSAtDndjI1pesiTcQnjNVifZD4ippb9qBhycreWzQw22XoDEzM0kMrjDClM3ecNiTJ9h4UhB+pLTwncnE0Q/xj/c43V6PWiMfqNXowL4Ma/4tFQdgaPlr/Kp3/cpJM9PcQVLNF4gPbsH8zxpQ3352lZeK6VxAuzLdieJtaBrfhNNGBzso5HjFq2+rdFhzaYrGOLB/gWA/xcK+lK8jR/e64dt/glXnGpm5j9/1xjOhHyovH5jV/8GID/RrRWXcJARzFm7trwYPHGc1kBkhpyroDs/KWDHHPkwx8ezLeTGGG+HQ9ox5CxEPfnW/GAySKo+SYWgvQBtqYasTXbTLR6voPOCJAu5ONl3tDIQgdtNl1nTf70QBUay84IwOZbPxL3/J6A7+HBuABiAWymeKdDD0xQ1Fp1EXc7TVgarXcdDPJm+h8u3cDaZBNmBq5hpMeKO20FGLphwfZsG/kcAN4074MFYg0eMMOcC7Q7yHxYBJ3yeTDfga25VmzNtuD+bDvuz1/H48UbeLzSTeYSVrh5Q0K+HpZ8jxZvYKq/Em1Vl9gIXzzyxrZ6TQm/P+B7eAhdgNNHwrDaES8gBSkDn0JD+Vk0VZxH05XzaL5yHnWlp1BrPSncMciPLSyJuN2ah5Xxem4ugGrvg/kOPFjsoNNEZPLn0SKPLAvMNHAHHTvjZg6ZqWLuDAIJWrfnOzDSU4amK+dhNxthNzvvPxSswy023q8rP+X9ojH5Z78cppNquynhl0zlz3nylZ8WCTMFmwuLwVUSeR1E3mObKQFt1Zcw3leO7Zk2PF7gpokeLd0gWku1l2gxmSJ6vNyFR8s32JItcTUM+IQAa5MtGO0rR/u1ZKEVEw248l8H+f+MA/UVif/2RWPxwi5H2Um1nU0HRYFRsRBs8akhYRQtfGOdfo5/3oCcqkFr1SXcvW7CwlAN1iebcX+OtGRJp5EnzOPVPmzNdWBppB6Tdyox0FGEDnsKaiwnXJeueX/fqbppNv69zWSM+RdX2/8ql8N0Um2zGI12c0K93Wz8j25BdkEKZ7fhpqrIJ5ir38GrvztMRtRaT7FSYznB/R6zmwietT7x7v+/4ng4TPG/tpmMrfYy49+86Pf9t/aqtRgD7GbjKbvZOOAwGf9BrMWu3mCxBtpN8U5WxV2DyWX84YYcfEKJK5hOFU0Tr7BTbPxHuzmhsbY4UTtbUfGnL/o9/p26Oq4l/6W9zPg3daVG+ZfL2b+qNSf/7w7HyT+vMRuPOejiCSHY8Wzm4QpIZ7LEO7kVJwvDb1nznneYjU8cZmO+veSET6/Z/O0/gP8CLpspMdBuTii3mRP+H1d5uHtQXWi/qFUtPrRhMyX8L5vZOGe3nMhzlJwMEk/qvOj34vf6ApL/uKYkYa/NdOKcvTjhpt1sXLWZEv7ORqePnNxFcbwgdhAR4td2c8L/ZTclDNlNxmqH+USCrSQxovn/36pCzoH25yggA6xatYp56bQKQUIYVozD8GgrfhSMglEwCogFAKLMfMSQJpeeAAAAAElFTkSuQmCC"
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