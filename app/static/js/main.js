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
var isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) ||
(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
!window.MSStream
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
MOBILE FUNCTIONS -----------------------------------------------------------------
*/

$(function() {
    $('#modal-close-container').click(() => {
        document.getElementById("critter-modal").style.display ="none";
        document.getElementById("cover").style.display ="none";
        document.documentElement.style.overflowY = "hidden";
    });

})

/*
MODAL FUNCTIONS -----------------------------------------------------------------
*/

$(function() {
    $('#mobile-settings-close').click(() => {
        document.getElementById("mobile-settings").style.display ="none";
    });

    $('#cog').click(() => {
        document.getElementById("mobile-settings").style.display ="flex";
    });

    $('.mobile-login').click(() => {
        window.location.replace("/login")
    })
})

function createModal(k, data) {
    var modal = document.getElementById("critter-modal");
    var cover = document.getElementById("cover");
    $(modal).stop().css('display','flex').hide().fadeIn(300);
    $(cover).stop().css('display','flex').hide().fadeIn(300);
    modal.style.position ="fixed";
    cover.style.position ="fixed";
    document.getElementById("modal-critter-name").innerHTML = data.name_formatted;

    var icon = "./static/image/fish/" + k.id + ".webp";
    if (isIOS) {
        icon = "./static/image/fish/png/" + k.id + ".png";
    };

    document.getElementById("modal-critter-icon").style.backgroundImage = "url("+icon+")";
    document.getElementById("modal-bells-price").innerHTML = data.price;
    document.getElementById("modal-critter-time").innerHTML = getAltCritterTime(data.time);
}

/*
MOBILE FILTER FUNCTIONS -----------------------------------------------------------------
*/

$(() => {
    var searchBar = $('#search-wrapper');
    var filterButton = $('#mobile-filter-button');
    var searchButton = $('#mobile-search-button');
    filterButton.click(() => {
        searchBar.removeClass("moveElemInFromLeft");
        searchBar.addClass("moveElemOutLeft")
        filterButton.removeClass("moveFilterInFromRight");
        filterButton.addClass("moveFilterOffRight");
        searchButton.removeClass("moveElemOutLeft");
        setTimeout(() => searchButton.addClass("moveElemInFromLeft"), 200);
        searchButton.css("display","flex");
        setTimeout(() => $('.filter-option').removeClass("fadeOut").addClass("fadeIn").css("display", "flex"), 200);
    });

    searchButton.click(() => {
        filterButton.removeClass("moveFilterOffRight")
        filterButton.addClass("moveFilterInFromRight")
        filterButton.css("display", "flex");
        searchButton.removeClass("moveElemInFromLeft");
        searchButton.addClass("moveElemOutLeft");
        searchBar.removeClass("moveElemOutLeft");
        searchBar.addClass("moveElemInFromLeft");
        searchBar.css("display", "flex");
        $('.filter-option').removeClass("fadeIn").addClass("fadeOut").css("display", "none");
    });

    $('#search-clear').click(() => {
        $('#search').val('');
        $critterChildren = $('#' + getActiveTab() + '-data-wrapper').children();
        for (var i=0; i<$critterChildren.length; i++) {
            $($critterChildren[i]).removeClass('_search_filter');
        };
        $('#search-clear').css("display", "none");
    });

    $('#filter-show').click(() => {
        $('#mobile-filter-list').addClass("slideElemUp");
    })
})



/*
CHORES FUNCTIONS -----------------------------------------------------------------
*/

$(async function() {  //Chores tab click
    $('.chores-container').bind('click', async function() {
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
    var chores = await getCaught("chores");
    //if (!isMobile()) {
    //    createDesktopChores(chores);
    //}
});


function increaseBarLength(barElem, prevWidth, newWidth) {
    barElem.animate([
        {width: prevWidth + "%"},
        {width: newWidth + "%"}
    ], {
        duration: 200,
        fill: "forwards"
    });
};

$(() => {
    $('#rocks-mobile-wrapper').click(() => {
        let totalWidth = document.getElementById("rocks-bar-background").offsetWidth;
        let barElem = document.getElementById("rocks-bar");
        let prevWidth = barElem.offsetWidth > 0 ? barElem.offsetWidth / totalWidth * 100  : 0;
        let newWidth = prevWidth + 20;
        increaseBarLength(barElem, prevWidth, newWidth);
    })
})

function createDesktopChores(chores) {
    var rock = new ProgressBar.Circle("#rock",{color: '#a6ad7c',
    trailColor: '#d5ccab',
    strokeWidth: 8,
    duration: 500,
    easing: 'easeInOut'});
    var rockPercent = chores["rock"];
    rock.animate(rockPercent)
    $('#rock-wrapper').click(function() {
        if (rockPercent != 1) {
            rockPercent = rockPercent + 0.2;
            updateJSON("chores", "rock", rockPercent)
        }
        rock.animate(rockPercent);
    })

    var moneyRock = new ProgressBar.Circle("#money-rock",{color: '#e3b645',
    trailColor: '#d5ccab',
    strokeWidth: 8,
    duration: 500,
    easing: 'easeInOut'});
    if (chores["moneyrock"] === "undefined") {
        updateJSON("chores", "moneyrock", 0)
        var moneyRockPercent = 0;
    } else {

    }
        moneyRockPercent = 0;
    $('#money-rock-wrapper').click(function() {
        if (moneyRockPercent == 0) {
            moneyRock.animate(1);
            moneyRockPercent = 1
        }
    })

    var fossil = new ProgressBar.Circle("#fossils",{color: '#736cc4',
    trailColor: '#d5ccab',
    strokeWidth: 8,
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
    strokeWidth: 8,
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
    strokeWidth: 8,
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
    strokeWidth: 8,
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
                $('#turnips').fadeTo("slow", 0.4);
                $('#turnips-title-container').fadeTo("slow", 0.4);
                $('#turnip-timer-wrapper').css({"diplay": "inline-block", "z-index": "1", "opacity": "100%"});
            }
        }
    })
}




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


function addCaughtToggle(k, tab, data) {
    document.getElementById(k.id+'-modal-button').addEventListener("click", function(event) {
        event.stopPropagation();
        createModal(k, data)
    });
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
                        critter: thisCritter.id,
                        value: updateValue
                    }
                })
            } else {
                console.log("No one signed in")
            }
        }
    })
)};


function clearSearch(tab) {
    $('#search').val("");
    $('#search-clear').css('display', 'none');
    $critterChildren = $('#' + tab + '-data-wrapper').children();
    for (var i=0; i<$critterChildren.length; i++) {
        $($critterChildren[i]).removeClass('_search_filter');
    }
    
}

/*
FISH FUNCTIONS -----------------------------------------------------------------
*/

$(function() {  //Fish tab click
    $('.fish-container').bind('click', function() {
        if (prevTab == "chores") {
            $('#search').css('display', 'flex');
            $('.search-wrapper').css('justify-content', 'flex-start');
            $('#chores-timer-wrapper').css('display', 'none');
        }
        
        hidePrevTab();
        setPrevTabIconInactive();
        prevTab = "fish"
        clearSearch("bugs");
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

    var icon = "./static/image/fish/" + k + ".webp";
    if (isIOS) {
        icon = "./static/image/fish/png/" + k + ".png";
    };


    template.innerHTML = '<div id="' + k + '" class="'+checkedFilter+'" data-checked="' + isChecked + '" title="' + tooltip + '">\n' +
                            '<img class="critter-icon" loading="lazy" src="' + icon + '">\n' +
                            '<div class="critter-data">\n' +
                                '<div class="name-container critter-name">\n' +
                                    '<div class="critter-name">'+v.name_formatted+'</div>\n' +
                                    '<div id="'+k+'-modal-button" class="modal-button"></div>\n' +
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
    var modalTempList = {};
    var userDict = false;
    var idToken = getCookie("user");
    if (idToken != "") {
        userDict = await getCaught("fish");
    }
    $.getJSON('/fish/all', function(data) {
        var elem = document.getElementById("fish-data-wrapper");
        $.each(data, function(k, v) {
            fishElements.push(createFishHTMLElement(k, v, userDict));
            modalTempList[k] = v;
        });
        for (var i=0; i<fishElements.length; i++) {
            elem.appendChild(fishElements[i]);
            addCaughtToggle(fishElements[i], "fish", modalTempList[fishElements[i].id]);
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
    $('.bugs-container, #bug-icon').click(async function() {
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
        clearSearch("fish");
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

    var icon = "./static/image/bugs/" + k + ".webp";
    if (isIOS) {
        icon = "./static/image/bugs/png/" + k + ".png";
    };

    template.innerHTML = '<div id="' + k + '" class="'+checkedFilter+'" data-checked="' + isChecked + '" title="' + tooltip + '">\n' +
                '<img class="critter-icon" loading="lazy" src="' + icon + '">\n' +
                '<div class="critter-data">\n' +
                    '<div class="name-container critter-name">\n' +
                        '<div class="critter-name">'+v.name_formatted+'</div>\n' +
                        '<div id="'+k+'-modal-button" class="modal-button"></div>\n' +
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
        var modalTempObj = {}
        var elem = document.getElementById("bugs-data-wrapper")
        $.each(data, function(k, v) {
            bugsElements.push(generateBugsHTML(k, v, userDict));
            modalTempObj[k] = v;
        });
        for (var i=0; i<bugsElements.length; i++) {
            elem.appendChild(bugsElements[i]);
            addCaughtToggle(fishElements[i], "bugs", modalTempObj[bugsElements[i].id]);
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
    $('.villagers-container').bind('click', function() {
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

function generateVillagerHTML(k, v) {
    var genderIcon = './static/image/icons/svg/female.svg';
    if (v.gender == "m") {
        genderIcon = './static/image/icons/svg/male.svg';
    };
    
    var icon = "./static/image/villagers/" + v.name + ".webp";
    if (isIOS) {
        icon = "./static/image/villagers/png/" + v.name + ".png";
    };


    return $('<div/>', {'class': 'critter-wrapper', 'id':v.name}).append([
            $('<img/>', {'class': 'critter-icon', 'loading': 'lazy', 'src':icon}),
            $('<div/>', {'class': 'critter-data'}).append([
                $('<div/>', {'class': 'name-container critter-name'}).append([
                    $('<div/>', {'class': 'villager-name', 'text':v.name_formatted}),
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
            n: 0,
            day: d,
            month: m
        },
        success: function(data) {
            console.log(data)
            var $elementsToAppend = [];
            var $elem = $("#villagers-data-wrapper");
            $.each(data, function(k, v) {
                $elementsToAppend.push(generateVillagerHTML(k, v));
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
    $('.' + tab + '-icon').css('opacity', '1');
}

function makeTabIconInactive(tab) {
    $('.' + tab + '-icon').css('opacity', '0.5');
}

/*
SEARCH BOX -----------------------------------------------------------------
*/

$(document).ready( () => {
    $('#search').on('input', function() {
        if ($('#search').val().length > 0) {
            $('#search-clear').css('display', 'block');
        } else {
            $('#search-clear').css('display', 'none');
        }
        critterChildren = document.getElementById(getActiveTab() + '-data-wrapper').children;
        for (var i=0; i<critterChildren.length; i++) {
            let formatted_name = critterChildren[i].children[1].children[0].children[0].innerHTML.toLowerCase().trim();
            if (!formatted_name.includes(this.value.toLowerCase().trim())) {
                critterChildren[i].classList.add('_search_filter');
            } else {
                critterChildren[i].classList.remove('_search_filter');
            }
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
        for (var i=0; i<50; i++) {
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