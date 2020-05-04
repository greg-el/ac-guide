ACTIVE_TAB = "fish";
CURRENT_HOUR = new Date().getHours() % 12;    
CURRENT_HOUR = CURRENT_HOUR ? CURRENT_HOUR : 12;
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
})

/*
FISH FUNCTIONS -----------------------------------------------------------------
*/

$(function() {  //Fish tab click
    $('a#fish-button').bind('click', function() {
        setActiveTab("fish");
        setActiveTabIcon("fish");
        showTab("fish");
    });
    return false;
});

function getCritterTime(v) {
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
    return finalTime
}

function getCritterLocation(v) {
    var finalLocation = {}
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
    return finalLocation;
}



function getCritterLocationAlt(v) {
    var finalLocationAlt = {}
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
    return finalLocationAlt;
}

function getUserDict() {
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
                            resolve(data);
                        },
                        error: function(data) {
                            resolve(false)
                        }
                    })
                })
            } else {
                reject(new Error("No user"));
            }
        })
    })
};

function createHTMLElement(element, k, v, finalTime, finalLocation, finalLocationAlt, userDict) {
    var isChecked = false;
    if (userDict && userDict.fish.hasOwnProperty(k)) {
        isChecked = true;
    }
    if (typeof v.locationAlt == "undefined") {
        element.append(
            $('<div/>', {'class': 'critter-wrapper', 'id':k}).append([
                $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
                $('<div/>', {'class': 'critter-data'}).append([
                    $('<div/>', {'class': 'critter-data-wrapper'}).append([
                        $('<div/>', {'class': 'data-grid'}).append([
                            $('<div/>', {'class': 'name-container critter-name'}).append(
                                $('<div/>', {'class': 'critter-name', 'text':v.name_formatted}),
                                $('<input/>', {'type': 'checkbox', 'class': 'critter-checkbox', 'id': k+'-checkbox', 'checked': isChecked})
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
                                $('<div/>', {'class': 'critter-name', 'text':v.name_formatted}),
                                $('<input/>', {'type': 'checkbox', 'class': 'critter-checkbox', 'id': k+'-checkbox'})
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
}

async function generateFishHTML(element, k, v, userDict) {

    var finalTime = getCritterTime(v);
    var finalLocation = getCritterLocation(v);
    var finalLocationAlt = getCritterLocationAlt(v);
    createHTMLElement(element, k, v, finalTime, finalLocation, finalLocationAlt, userDict);


    $('#'+k+'-checkbox').click(function() {
        var thisCheckbox = this;
        console.log(thisCheckbox)
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var updateValue = false;
                if (thisCheckbox.checked) {
                    updateValue = true; 
                }
                firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
                    $.ajax({
                        url: "/update",
                        headers: {
                            token: idToken,
                            species: "fish",
                            critter: thisCheckbox.parentElement.parentElement.parentElement.parentElement.parentElement.id,
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
    var userDict = await getUserDict();
    console.log(userDict)
    $.getJSON('/fish/all', function(data) {
        var $elem = $(document.getElementById("fish-data-wrapper"));
        $.each(data, function(k, v) {
            generateFishHTML($elem, k, v, userDict);
        })
    });
    return false;
};

async function getFish() {
    $.getJSON('/fish/available',
        function(data) {
            var $elem = $(document.getElementById("fish-data-wrapper"));
            $.each(data, function(k, v) {
                generateFishHTML($elem, k, v);
            })
        });
    return false;
};

async function getUnavailableFish() {
    $.getJSON('/fish/unavailable',
            function(data) {
                var $elem = $(document.getElementById("fish-collapsible-content"))
                $.each(data, function(k, v) {
                    generateFishHTML($elem, k, v);
            });
    });
};

function refreshFish() {            
    $.getJSON('/fish/available',
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
        setActiveTab("bugs");
        setActiveTabIcon("bugs");
        showTab("bugs")
    });
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

    $elem.append(
        $('<div/>', {'class': 'critter-wrapper', 'id':k}).append([
            $('<img/>', {'class': 'critter-icon', 'src':v.icon}),
            $('<div/>', {'class': 'critter-data'}).append([
                $('<div/>', {'class': 'critter-data-wrapper'}).append([
                    $('<div/>', {'class': 'data-grid'}).append([
                        $('<div/>', {'class': 'name-container critter-name'}).append(
                            $('<div/>', {'class': 'critter-name', 'text':v.name_formatted})
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
                            ])
                    ])
                ])
            ])
        ])
    )
    $('#'+k+'-checkbox').click(function() {
        critterContainer = this.id.slice(0, -9);
        checked_fish.push($('#'+critterContainer));
    });
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
                            $('<img/>', {'class': 'villager-birthday-icon', 'src': './static/image/icons/birthdayicon.png'}),
                            $('<div/>', {'class': 'villager-block', 'text':  v.month + " " + ordinalSuffixOf(v.date)})
                            ]),
                        $('<div/>', {'class': 'villager-species-container'}).append([
                            $('<img/>', {'class': 'villager-species-icon', 'src': './static/image/icons/pawicon.png'}),
                            $('<div/>', {'class': 'villager-block', 'text':  v.species})
                        ]),
                        $('<div/>', {'class': 'villager-personality-container'}).append([
                            $('<img/>', {'class': 'villager-personality-icon', 'src': './static/image/icons/personalityicon.png'}),
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
    $.getJSON('/villagers-sorted/100', function(data) {
        var $elem = $("#villagers-data-wrapper");
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
        $('#fish-tab').css('display', 'flex');
        $('#bugs-tab').css('display', 'none');
        $('#villagers-tab').css('display', 'none');
    } else if (tab == "bugs") {
        $('#fish-tab').css('display', 'none');
        $('#bugs-tab').css('display', 'flex');
        $('#villagers-tab').css('display', 'none');
    } else if (tab == "villagers") {
        $('#fish-tab').css('display', 'none');
        $('#bugs-tab').css('display', 'none');
        $('#villagers-tab').css('display', 'flex');
    } else {
        console.log("Error showing tab")
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
                var kLower = k.replace(/\s+/g, '').toLowerCase();
                if (kLower.includes(value)) {
                    document.getElementById(kLower).style.display = "flex";
                } else {
                    document.getElementById(kLower).style.display = "none";
                }
            })
        })
    });
    $('#fish-search').on('click', function() {
        $('#fish-toggle').click();
        showAll("fish");
    });
});


/*
SHOW ALL CHECK BOX -----------------------------------------------------------------
*/

async function markAll(tab) {
    var $elemChildren = $("#" + tab + "-data-wrapper").children();
    for (var i=0; i < $elemChildren.length; i++) {
        $("#" + $elemChildren[i].id).addClass('_all_filter');
    }
}

async function unMarkAll(tab) {
    var $elemChildren = $("#" + tab + "-data-wrapper").children();
    for (var i=0; i < $elemChildren.length; i++) {
        $("#" + $elemChildren[i].id).removeClass('_all_filter');
    }
}

async function markAvailiable(tab) {
    var $alreadyChecked = [];
    var $elemChildren = $("#" + tab + "-data-wrapper").children();
    $.getJSON('/' + tab + '/available', function(data) {
        $.each(data, function(k, v) {
            var kLower = k.replace(/\s+/g, '').toLowerCase();
            for (var i=0; i < $elemChildren.length; i++) {
                if (kLower == $elemChildren[i].id) {
                    $("#" + $elemChildren[i].id).removeClass('_all_filter');
                    $alreadyChecked.push($elemChildren[i].id);
                    break;
                } else if (!$alreadyChecked.includes($elemChildren[i].id)) {
                    $("#" + $elemChildren[i].id).addClass('_all_filter');
                }
            }
        });
    }).done(function() {classFilterManager(tab)});
};


$(document).ready( () => {
    $('#availiable-checkbox').on('click', function() {
        if ($('#caught-checkbox').checked) {
            $('#caught-checkbox').prop('checked', false);
        }
        if (this.checked) {
            markAvailiable(getActiveTab());
        } else {
            unMarkAll(getActiveTab()).then(() => classFilterManager(getActiveTab()))
        };
    });
});

/*
FILTER CAUGHT CHECKBOX -----------------------------------------------------------------
*/


async function showCaughtFish() {
    for (var i=0; i<checked_fish.length; i++) {
        var fishLower = checked_fish[i][0].id.replace(/\s+/g, '').toLowerCase();
        $('#'+fishLower).removeClass("_caught_filter");
    }
}

async function hideCaughtFish() {
    for (var i=0; i<checked_fish.length; i++) {
        var fishLower = checked_fish[i][0].id.replace(/\s+/g, '').toLowerCase();
        $('#'+fishLower).addClass("_caught_filter");
    }
}

$(document).ready( () => {
    $('#caught-checkbox').on('click', function() {
        if (!this.checked) {
            showCaughtFish().then(() => classFilterManager("fish"));
        } else {
            hideCaughtFish().then(() => classFilterManager("fish"));
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
        if ($elemClasses.includes("_caught_filter") || $elemClasses.includes("_all_filter")) {
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
    showTab("fish");
});