function getMatchData(historyDateMap, historyGameMap) {
    let count = 0;
    let matchDataContainer = document.getElementById("personaldata_elements_container")
    let matchTable = matchDataContainer.getElementsByClassName("csgo_scoreboard_inner_left")
    let gameTable = matchDataContainer.getElementsByClassName("csgo_scoreboard_inner_right")

    // Iterates through all the matches currently loaded on DOM
    for (var i = 0, max = matchTable.length; i < max; i++) {
        // Gets 5 html elements on left
        var matchDownloads = matchTable[i].getElementsByClassName("csgo_scoreboard_inner_left")
        var matchValues = matchTable[i].getElementsByTagName("td")
        // Get player data
        var gameValues = gameTable[i].getElementsByTagName("td")
        // If 6th element exists(VOD download link, then remove)
        if (matchValues[5]) {
            matchValues[5].parentNode.removeChild(matchValues[5]);
        }
        // Check hashtable if data of inserted already exists, if so exit the function(-1)
        if (historyDateMap[Object.assign(matchValues[1].innerHTML)]) {
            let scoreboardroot = document.getElementsByClassName("generic_kv_table csgo_scoreboard_root")
            for (var i = 0; i < 8; i++) {
                if (scoreboardroot[0].children[0].children[0]) {
                    scoreboardroot[0].children[0].removeChild(scoreboardroot[0].children[0].children[0])
                }
            }
            return -1
        }
        historyDateMap[Object.assign(matchValues[1].innerHTML)] = [...matchValues]
        historyGameMap[Object.assign(matchValues[1].innerHTML)] = [...gameValues]
        // remove the 10 match stats from right
        for (var j = 0; j < 10; j++) {
            gameValues[0].parentNode.removeChild(gameValues[0])
        }
        // Removes the 5 match stats from left
        for (var j = 0; j < 5; j++) {
            matchValues[0].parentNode.removeChild(matchValues[0])
        }
        count++
    }
    // Remove the match contents from the DOM
    let scoreboardroot = document.getElementsByClassName("generic_kv_table csgo_scoreboard_root")
    for (var i = 0; i < 8; i++) {
        if (scoreboardroot[0].children[0].children[0]) {
            scoreboardroot[0].children[0].removeChild(scoreboardroot[0].children[0].children[0])
        }
    }
    return count;
}

function logData(historyDateMap, historyGameMap, numberOfGamesRecorded) {
    //let loadbar = document.getElementById("inventory_history_loading")
    //loadbar.style["display"] = "none"
    console.log(historyDateMap)
    console.log(historyGameMap)
    console.log("Number of games:", numberOfGamesRecorded)
    console.log(Object.keys(historyDateMap).length)
    get_time_iq(historyDateMap)
    
    document.getElementById("sd_username").innerHTML = get_username(historyDateMap, historyGameMap)
    document.getElementById("sd_number_of_games").innerHTML = get_number_of_games(historyDateMap)
    document.getElementById("sd_earliest_game_recorded").innerHTML = get_earliest_game_recorded(historyDateMap, historyGameMap)

    document.getElementById("sd_time_iq").innerHTML = get_time_iq(historyDateMap) + " | " + get_longest_time_iq(historyDateMap)
    document.getElementById("sd_time_ig").innerHTML = get_time_ig(historyDateMap) + " | " + get_longest_time_ig(historyDateMap)

    document.getElementById("sd_total_kills").innerHTML = get_total_kills(historyDateMap, historyGameMap, true)
    document.getElementById("sd_total_deaths").innerHTML = get_total_deaths(historyDateMap, historyGameMap, true)
    document.getElementById("sd_kd").innerHTML = get_kd(historyDateMap, historyGameMap)
    document.getElementById("sd_highest_kill_game").innerHTML = get_highest_kill_game(historyDateMap, historyGameMap)
}

function get_username(historyDateMap, historyGameMap) {
    let username = document.getElementsByClassName("whiteLink persona_name_text_content")
    return username[0].innerHTML
}
function get_number_of_games(historyDateMap) {
    return Object.keys(historyDateMap).length + " games recorded"
}

function get_earliest_game_recorded(historyDateMap, historyGameMap) {
    let least_recent_game = Object.keys(historyDateMap)[Object.keys(historyDateMap).length - 1]
    let most_recent_game = Object.keys(historyDateMap)[0]
    return "Games from:" + least_recent_game + " -> " + most_recent_game
}

function get_highest_kill_game(historyDateMap, historyGameMap) {
    let username = get_username(historyDateMap, historyGameMap)
    let count = -1
    for (const property in historyGameMap) {
        const gameData = historyGameMap[property];
        for (var i = 0; i < gameData.length; i++) {
            if (gameData[i].innerHTML.includes(username.trim())) {
                
                if (parseInt(gameData[i + 2].innerHTML) > count) {
                    count = parseInt(gameData[i + 2].innerHTML)
                }
            }
        }
    }
    return "Highest Kill Game: " + count
}

function get_total_kills(historyDateMap, historyGameMap, toggle) {
    let username = get_username(historyDateMap, historyGameMap)
    let count = 0
    for (const property in historyGameMap) {
        const gameData = historyGameMap[property];
        for (var i = 0; i < gameData.length; i++) {
            if (gameData[i].innerHTML.includes(username.trim())) {
                count += parseInt( gameData[i + 2].innerHTML)
            }
        }
    }
    if (toggle) {
        return "Total Kills: " + count
    }
    return count
}

function get_total_deaths(historyDateMap, historyGameMap, toggle) {
    let username = get_username(historyDateMap, historyGameMap)
    let count = 0
    for (const property in historyGameMap) {
        const gameData = historyGameMap[property];
        for (var i = 0; i < gameData.length; i++) {
            if (gameData[i].innerHTML.includes(username.trim())) {
                count += parseInt(gameData[i + 4].innerHTML)
            }
        }
    }
    if (toggle) {
        return "Total Deaths: " + count
    }
    return count
}

function get_kd(historyDateMap, historyGameMap) {
    let kd = get_total_kills(historyDateMap, historyGameMap, false) / get_total_deaths(historyDateMap, historyGameMap, false)
    kd = +kd.toFixed(2);
    return "KD: " + kd
}

function get_time_ig(historyDateMap) {
    let sumSeconds = 0;
    for (const property in historyDateMap) {
        const timeArray = historyDateMap[property][4].innerHTML.split(" ");
        let time2Array = timeArray[2].split("\t\t\t\t\t")
        let time3Array = time2Array[0].split(":")

        let minutes = parseInt(time3Array[0])
        let seconds = parseInt(time3Array[1])
        sumSeconds += (minutes * 60)
        sumSeconds += seconds
    }
    sumSeconds = Number(sumSeconds);
    var h = Math.floor(sumSeconds / 3600);
    var m = Math.floor(sumSeconds % 3600 / 60);
    var s = Math.floor(sumSeconds % 3600 % 60);

    if (h != 0) {
        return "Time Spent in Game: " + h + "h " + m + "m " + s + "s";
    } else if (m != 0) {
        return "Time Spent in Game: " + m + "m " + s + "s";
    } else {
        return "Time Spent in Game: " + s + "s";
    }
}

// Returns time in match queue in string
function get_time_iq(historyDateMap) {
    let sumSeconds = 0;
    for (const property in historyDateMap) {
        const timeArray = historyDateMap[property][3].innerHTML.split(" ");
        let time2Array = timeArray[2].split("\t\t\t\t\t")
        let time3Array = time2Array[0].split(":")

        let minutes = parseInt(time3Array[0])
        let seconds = parseInt(time3Array[1])
        sumSeconds += (minutes*60)
        sumSeconds += seconds
    }
    sumSeconds = Number(sumSeconds);
    var h = Math.floor(sumSeconds / 3600);
    var m = Math.floor(sumSeconds % 3600 / 60);
    var s = Math.floor(sumSeconds % 3600 % 60);

    if (h != 0) {
        return "Time Spent in Queue: " + h + "h " + m + "m " + s + "s";
    } else if (m != 0) {
        return "Time Spent in Queue: " + m + "m " + s + "s";
    } else {
        return "Time Spent in Queue: " + s + "s";
    }
}

function get_longest_time_iq(historyDateMap) {
    let longest = 0;
    for (const property in historyDateMap) {
        let sumSeconds = 0;
        const timeArray = historyDateMap[property][3].innerHTML.split(" ");
        let time2Array = timeArray[2].split("\t\t\t\t\t")
        let time3Array = time2Array[0].split(":")

        let minutes = parseInt(time3Array[0])
        let seconds = parseInt(time3Array[1])
        sumSeconds += (minutes * 60)
        sumSeconds += seconds

        if (sumSeconds > longest) {
            longest = sumSeconds
        }
    }

    longest = Number(longest);
    var h = Math.floor(longest / 3600);
    var m = Math.floor(longest % 3600 / 60);
    var s = Math.floor(longest % 3600 % 60);

    if (h != 0) {
        return "Longest Queue: " + h + "h " + m + "m " + s + "s";
    } else if (m != 0) {
        return "Longest Queue: " + m + "m " + s + "s";
    } else {
        return "Longest Queue: " + s + "s";
    }
}

function get_longest_time_ig(historyDateMap) {
    let longest = 0;
    for (const property in historyDateMap) {
        let sumSeconds = 0;
        const timeArray = historyDateMap[property][4].innerHTML.split(" ");
        let time2Array = timeArray[2].split("\t\t\t\t\t")
        let time3Array = time2Array[0].split(":")

        let minutes = parseInt(time3Array[0])
        let seconds = parseInt(time3Array[1])
        sumSeconds += (minutes * 60)
        sumSeconds += seconds

        if (sumSeconds > longest) {
            longest = sumSeconds
        }
    }

    longest = Number(longest);
    var h = Math.floor(longest / 3600);
    var m = Math.floor(longest % 3600 / 60);
    var s = Math.floor(longest % 3600 % 60);

    if (h != 0) {
        return "Longest Game: " + h + "h " + m + "m " + s + "s";
    } else if (m != 0) {
        return "Longest Game: " + m + "m " + s + "s";
    } else {
        return "Longest Game: " + s + "s";
    }
}

export function app() {
    let historyDateMap = {}
    let historyGameMap = {}
    let scoreboardroot = document.getElementsByClassName("generic_kv_table csgo_scoreboard_root")
    let matchDataContainer = document.getElementById("personaldata_elements_container")
    let matchTable = matchDataContainer.getElementsByClassName("csgo_scoreboard_inner_left")
    let loadbar = document.getElementById("inventory_history_loading")
    let buttonParent = document.getElementsByClassName("load_more_history_area")
    let button = buttonParent[0].children[0]

    let numberOfGamesRecorded = 0;
    let count = 0

    button.style["display"] = "none"
    buttonParent[0].style["display"] = "none"
    loadbar.style["display"] = "block"

    scoreboardroot[0].children[0].removeChild(scoreboardroot[0].children[0].children[0])
    scoreboardroot[0].style["display"] = "none"
    let loadingData = document.getElementById("subtabs")
    fetch(chrome.runtime.getURL('/loading.html')).then(r => r.text()).then(html => {
        loadingData.insertAdjacentHTML('beforeEnd', html);
        let counter = 0
        var loadD = setInterval(() => {
            if (!document.getElementById("g_load_d")) {
                clearInterval(loadD)
            }
            if (counter == 1) {
                document.getElementById("g_load_d").innerHTML = "Gathering Data"
            }
            if (counter == 2) {
                document.getElementById("g_load_d").innerHTML = "Gathering Data."
            }
            if (counter == 3) {
                document.getElementById("g_load_d").innerHTML = "Gathering Data.."
            }
            if (counter == 4) {
                document.getElementById("g_load_d").innerHTML = "Gathering Data..."
            }
            if (counter == 4) {
                counter = 0
            }
            counter++
        }, 500)
    });

    var loopData = setInterval(() => {
        document.getElementById("g_load_progress").innerHTML = "Loaded " + numberOfGamesRecorded + " games"
        if (scoreboardroot[0].children[0].children[0]) {
            let buffer = getMatchData(historyDateMap, historyGameMap)
            if (!scoreboardroot[0].children[0].children[0]) {
                button.click()
                loadbar.style["display"] = "block"
                button.style["display"] = "none"
            }
            if (buffer == -1) {
                // All games have been loaded, stop requesting matches
                clearInterval(loopData)
                // Fetch stats_display HMTL page, then call logdata once elements are injected into DOM
                fetch(chrome.runtime.getURL('/stats_display.html')).then(r => r.text()).then(html => {
                    scoreboardroot[0].style["display"] = "none"
                    matchDataContainer.insertAdjacentHTML('beforeEnd', html);
                    logData(historyDateMap, historyGameMap, numberOfGamesRecorded)
                    document.getElementById("g_load").remove()
                });
            } else {
                numberOfGamesRecorded += buffer
            }
        }
        count++
    }, 100)
}
