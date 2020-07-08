ACTIVE_TAB = "fish";
var gotBugs = false;
var gotVillagers = false;
var gotChores = false;
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

var userState;
/*
FIREBASE FUNCTIONS -----------------------------------------------------------------
*/

async function IsLoggedIn() {
    try {
        await new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    resolve(user)
                } else {
                    reject("No one logged in.")
                }
            })
        })
    return true;
    } catch (error) {
        return false;
    }
}


$(async function() {
    userState = await IsLoggedIn();
    if (userState == true) {
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
            $.ajax ({
                url: "/logout",
                success: () => {
                    console.log("signout successful");
                }
            })
        }).catch(function(error) {
            console.log(error.message)
        })
    })
    $('#mobile-logout-button').click(() => {
        firebase.auth().signOut().then(function() {
            eraseCookie("session");
            console.log("signout successful");
        }).catch(function(error) {
            console.log(error.message)
        })
    })
});

function updateJSON(updateGroup, updateItem, updateValue) {
    if (userState != null) {
        $.ajax({
            url: "/update",
            headers: {
                group: updateGroup,
                item: updateItem,
                value: updateValue
            }
        })
    } else {
        console.log("No one signed in")
    }
}

async function getUserData(updateGroup) {
    if (userState == true) {
        return new Promise((resolve, reject) => {
            firebase.auth().currentUser.getIdToken(true).then(idToken => {
                $.ajax({
                    url: "/get",
                    headers: {
                        token: idToken,
                        group: updateGroup
                    },
                    success: data => {
                        resolve(JSON.parse(data));
                    },
                    error: () => {
                        reject(new Error("UID not in database"))
                    }
                })
            })
        })
    }
}


/*
MOBILE FUNCTIONS -----------------------------------------------------------------
*/

$(function() {
    $('#modal-close-container').click(() => {
        document.getElementById("critter-modal").style.display ="none";
        document.getElementById("cover").style.display ="none";
        //document.documentElement.style.overflowY = "hidden";
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

function createModal(k, data, critter) {
    //Handles months highlighting of modal
    let months = ["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sept", "oct", "nov", "dec"];

    for (let i = 0; i<12; i++) {
        let elem = document.getElementById(months[i]);
        elem.classList.remove("month-current"); //reset for new modal
        elem.classList.remove("month-active");
        elem.classList.add("month");
    }

    for (let i = 0; i<data.months.length; i++) {
        let elem = document.getElementById(months[data.months[i]]);
        elem.classList.remove("month");
        elem.classList.add("month-active");
        let current = document.getElementById(months[d.getMonth()])
        current.classList.remove("months");
        current.classList.add("month-current");
    }
    
    
    var modal = document.getElementById("critter-modal");
    var cover = document.getElementById("cover");
    $(modal).stop().css('display','flex').hide().fadeIn(300);
    $(cover).stop().css('display','flex').hide().fadeIn(300);
    modal.style.position ="fixed";
    cover.style.position ="fixed";
    document.getElementById("modal-critter-name").innerHTML = data.name_formatted;

    var icon = "./static/image/" + critter + "/" + k.id + ".webp";
    if (isIOS) {
        icon = "./static/image/" + critter + "/png/" + k.id + ".png";
    };

    document.getElementById("modal-critter-icon").style.backgroundImage = "url("+icon+")";
    document.getElementById("modal-bells-price").innerHTML = data.price;
    document.getElementById("modal-critter-time").innerHTML = getAltCritterTime(data.time);
}

/*
MOBILE FILTER FUNCTIONS -----------------------------------------------------------------
*/

class ElementAnimator {
    constructor(elem, show, hide, hideCss = false, showCss = false, showDelay=0) {
        this.elem = $(elem);
        this.showAnim = show;
        this.hideAnim = hide;
        this.showDelay = showDelay;
        this.showCss = showCss;
        this.hideCss = hideCss;

    }

    getElem() {
        return this.elem;
    }

    show() {
        setTimeout(() => {
            this.elem.removeClass(this.hideAnim);
            this.elem.addClass(this.showAnim);
            if (this.showCss) {
                this.elem.css(this.showCss);
            }
        }, this.showDelay);
    }

    hide() {
        this.elem.removeClass(this.showAnim);
            this.elem.addClass(this.hideAnim);
        if (this.hideCss) {
            this.elem.css(this.hideCss);
        }
    }
}

$(() => {
    var searchBar = new ElementAnimator("#search-wrapper", "moveElemInFromLeft", "moveElemOutLeft");
    var filterButton = new ElementAnimator("#mobile-filter-button", "moveFilterInFromRight", "moveFilterOffRight");
    var searchButton = new ElementAnimator("#mobile-search-button", "moveElemInFromLeft", "moveElemOutLeft", 200);
    var filterOptions = new ElementAnimator(".filter-option", "fadeIn", "fadeOut", {"display": "none"}, {"display": "flex"}, 200);

    filterButton.getElem().click(() => {
        searchBar.hide();
        filterButton.hide();
        searchButton.show();
        filterOptions.show();
    });

    searchButton.getElem().click(() => {
        filterButton.show()
        searchButton.hide()
        searchBar.show()
        filterOptions.hide()
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

$(() =>  {  //Chores tab click
    $('.chores-container').bind('click', async function() {
        if (gotChores == false) {
            setInterval(choresTimers, 1000);
            let data = await getUserData("chores");
            loadMobileChores(data);
            gotChores = true;
        }

        hidePrevTab();
        setPrevTabIconInactive();
        prevTab = "chores";
        choresTimers();
        setActiveTab("chores");
        setActiveTabIcon("chores");
        showTab("chores");
        $('#search').css('display', 'none');
        $('.search-wrapper').css('justify-content', 'center');
        $('#chores-timer-wrapper').css('display', 'flex');
    });

});


class Chore {
    constructor(name, increase, choreTotal, animTime, startValue, startCount) {
        this.name = name;
        this.count = startCount;
        this.width = startValue;
        this.barElem = document.getElementById(name + "-bar");
        this.increase = increase;
        this.choreTotal = choreTotal;
        this.animTime = animTime;
        this.addClickHandler();
        this.setCounter();
        this.initalBarLength();
    }

    setCounter() {
        setTimeout(() => document.getElementById(this.name + "-count").innerHTML = this.count + "/" + this.choreTotal, this.animTime);
    }

    addClickHandler() {
        if (this.name == "turnips") {
            $('#' + this.name + '-wrapper').click(() => {
                this.setCounter()
                if (this.width < 100) {
                    if (this.count == 1 && amPm == "AM") {
                        console.log("No new turnip price available");
                    } else {
                        this.increaseBarLength();
                        this.count++;
                        updateJSON("chores", this.name, this.count);
                    }
                }
            })
        } else {
            $('#' + this.name + '-wrapper').click(() => {
                this.setCounter()
                if (this.width < 100) {
                    this.increaseBarLength();
                    this.count++
                    updateJSON("chores", this.name, this.count);
                }
            })
        }
    }

    initalBarLength() {
        this.barElem.animate([
            {width: 0 + "%"},
            {width: this.width + "%"}
        ], {
            duration: 0,
            fill: "forwards"
        });
    }

    increaseBarLength() {
        this.barElem.animate([
            {width: this.width + "%"},
            {width: this.width + this.increase + "%"}
        ], {
            duration: this.animTime,
            fill: "forwards"
        });
        this.width = this.width + this.increase;
    }

}

function loadMobileChores(data) {
    
    //Setting the values from user data
    let chores = {'rocks': 0, 'fossils': 0, 'money-rock': 0, 'diy': 0, 'glow': 0, 'turnips': 0};
    for (chore in chores) {
        if (chore in data) {
            chores[chore] = data[chore]
        } else {
            updateJSON("chores", chore, 0);
        }
    }

    var rocks = new Chore("rocks", 20, 5, 200, chores['rocks']*20, chores['rocks']);
    var fossils = new Chore("fossils", 20, 5, 200, chores['fossils']*20 ,chores['fossils']);
    var moneyRock = new Chore("money-rock", 100, 1, 200, chores['money-rock'], chores['money-rock']);
    var diy = new Chore("diy", 100, 1, 200, chores['diy']*100, chores['diy']);
    var glow = new Chore("glow", 100, 1, 200, chores['glow']*100 ,chores['glow']);

    let turnipsCount  = chores['turnips'];
    if (amPm == "PM" && turnipsCount == 0) {
        turnipsCount = 1;
    }
    turnipsLength = turnipsCount * 50;

    var turnips = new Chore("turnips", 50, 2, 200, turnipsLength, turnipsCount);
};



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
                $('<img/>', {'class': 'icon', 'src': './static/image/icons/svg/pin.svg'}),
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


function addModalToElement(k, data, critter) {
    console.log(k.id, data);
    document.getElementById(k.id+'-modal-button').addEventListener("click", function(event) {
        event.stopPropagation();
        createModal(k, data, critter)
    });
}


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


function createFishHTMLElement(k, v) {
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

    var tooltip = 'Click to mark as caught or uncaught';

    var icon = "./static/image/fish/" + k + ".webp";
    if (isIOS) {
        icon = "./static/image/fish/png/" + k + ".png";
    };

    
    return $('<div/>', {'class': 'critter-wrapper ', 'id':k, 'title': tooltip}).append([
            $('<img/>', {'class': 'critter-icon', 'loading': 'lazy', 'src':icon}),
            $('<div/>', {'class': 'critter-data'}).append([
                $('<div/>', {'class': 'name-container critter-name'}).append(
                    $('<div/>', {'class': 'critter-name', 'text':v.name_formatted}),
                    $('<div/>', {'id': k+'-modal-button', 'class': 'modal-button'})
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
                    $('<img/>', {'class': 'icon', 'src': './static/image/icons/svg/shadow.svg'}),
                    $('<div/>', {'class': 'data-text', 'text': v.shadow})
                ])
            ])
            ])
        ])
}

function createFishPlainHTMLElement(k, v) {
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


    template.innerHTML = '<div id="' + k + '" class="critter-wrapper" title="' + tooltip + '">\n' +
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

async function getAllFishPlainHTML() {
    var modalTempList = {};
    $.getJSON('/fish/all', function(data) {
        var elem = document.getElementById("fish-data-wrapper");
        $.each(data, function(k, v) {
            fishElements.push(createFishHTMLElement(k, v));
            modalTempList[k] = v;
        });
        for (var i=0; i<fishElements.length; i++) {
            elem.appendChild(fishElements[i]);
            addModalToElement(fishElements[i], modalTempList[fishElements[i].id]);
        }
        $('.wrapper-skeleton').remove();
    })
};

async function getAllFish() {
    let modalTempList = {};
    $.getJSON('/fish/all', function(data) {
        var $elementsToAppend = []
        var $elem = $("#fish-data-wrapper");
        $.each(data, function(k, v) {
            let fishElem = createFishHTMLElement(k, v);
            fishElements.push(fishElem);
            $elementsToAppend.push(fishElem)
            modalTempList[k] = v;
        });
        $elem.append($elementsToAppend);
        for (var i=0; i<fishElements.length; i++) {
            addModalToElement(fishElements[i][0], modalTempList[fishElements[i][0].id], "fish");
        }
        $('.wrapper-skeleton').remove();
    })
}

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
            getAllBugs();
            gotBugs = true;
        }
    })
});

function generateBugsPlainHTML(k, v) {
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

    template.innerHTML = '<div id="' + k + '" class="critter-wrapper" title="' + tooltip + '">\n' +
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

function createBugsHTMLElement(k, v) {
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

    var tooltip = 'Click to mark as caught or uncaught';

    var icon = "./static/image/bugs/" + k + ".webp";
    if (isIOS) {
        icon = "./static/image/bugs/png/" + k + ".png";
    };

    return $('<div/>', {'class': 'critter-wrapper ', 'id':k, 'title':tooltip}).append([
            $('<img/>', {'class': 'critter-icon', 'loading': 'lazy', 'src':icon}),
            $('<div/>', {'class': 'critter-data'}).append([
                $('<div/>', {'class': 'name-container critter-name'}).append(
                    $('<div/>', {'class': 'critter-name', 'text':v.name_formatted}),
                    $('<div/>', {'id': k+'-modal-button', 'class': 'modal-button'})
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
    let modalTempList = {};
    $.getJSON('/bugs/all', function(data) {
        var $elementsToAppend = [];
        var $elem = $("#bugs-data-wrapper");
        $.each(data, function(k, v) {
            let bugsElem = createBugsHTMLElement(k, v);
            bugsElements.push(bugsElem);
            $elementsToAppend.push(bugsElem);
            modalTempList[k] = v;
        });
        $elem.append($elementsToAppend);
        for (var i=0; i<bugsElements.length; i++) {
            addModalToElement(bugsElements[i][0], modalTempList[bugsElements[i][0].id], "bugs");
        }
        $('.wrapper-skeleton').remove();
    })
}

async function getAllBugsPlainHTML() {
    $.getJSON('/bugs/all', function(data) {
        var modalTempObj = {}
        var elem = document.getElementById("bugs-data-wrapper")
        $.each(data, function(k, v) {
            bugsElements.push(createBugsHTMLElement(k, v));
            modalTempObj[k] = v;
        });
        for (var i=0; i<bugsElements.length; i++) {
            elem.appendChild(bugsElements[i]);
            addModalToElement(fishElements[i], "bugs", modalTempObj[bugsElements[i].id]);
        }
        $('.wrapper-skeleton').remove();
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
    document.cookie = cname + "=" + cvalue + ";" + expires + "SameSite=Strict;" + "Secure=True;" + "path=/";
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

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

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
MOBILE-DROPDOWN -----------------------------------------------------------------
*/

$(document).ready(() => {
    let selected = $('#dropdown-selected');
    let cover = $('#cover');
    let dropdownContent = $('#dropdown-content');
    let allButton = $('#all-button');
    let availableButton = $('#available-button');
    allButton.click(() => {
        cover.css('display', 'none');
        unmarkAll("fish").then(() => unmarkAll("bugs"));
        selected.text('All');
        availableButton.css('order', '1');
        allButton.css('order', '0');
    })

    availableButton.click(() => {
        markAvailiable("fish").then(() => markAvailiable("bugs"));
        cover.css('display', 'none');
        selected.text('Available');
        availableButton.css('order', '0');
        allButton.css('order', '1');
    })

    //Aligns the dropdown with the text 
    let selectionHeight = $('#dropdown-selected').outerHeight()+1; 
    dropdownContent.css({'margin-top': '-' + selectionHeight + 'px', 'margin-left': '-1px'});
    $('#dropdown-selected').click(() => {
        dropdownContent.css('display', 'flex');
        cover.css('display', 'flex');
        cover.click(() => {
            cover.css('display', 'none');
            dropdownContent.css('display', 'none');
        });
        $('.dropdown-option').click(() => {
            cover.css('display', 'none');
            dropdownContent.css('display', 'none');
        })
        
    })
})

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