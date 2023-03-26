const server = new WebSocket("wss://82.20.58.71:5072");

const joinGame = document.getElementById("joinGame")
const codeField = document.getElementById("codeField")
const createGame = document.getElementById("createGame")
const codeBox = document.getElementById("codeBox")
const codeCharSet = "ABCDEFGHJKLMNOPQRSTUVWXYZ1234567890"

function sendEnteredCode() {
    codeField.value = codeField.value.toUpperCase()
    codeField.value = codeField.value.replaceAll("O", "0")
    if (codeField.value.length == 8) {
        for (i = 0; i < 8; i++) {
            if (!codeCharSet.includes(codeField.value[i])) {
                incorrectCode()
                return
            }
        }
        request = {
            requestType: "JOIN",
            gameCode: codeField.value,
            UUID: retrieveCookie("UUID"),
        }
        server.send(JSON.stringify(request))
    } else {
        incorrectCode() 
    }
}

function retrieveCookie(type) {
    let cookies = getCookies()
    if (type == "UUID") {
        let UUID = cookies.UUID
        return UUID
    } else if (type == "gameCode") {
        let gameCode = cookies.gameCode
        return gameCode
    } else {
        return gameCode, UUID
    }
}

// function requestSessionID() {
//     request = {
//         requestType: "REQUESTUUID",
//     }
//     server.send(JSON.stringify(request))
// }

function createGameCookie(cookieData, cookieType) {
    let expiration = new Date()
    expiration.setTime(expiration.getTime()+(1*24*60*60*1000))
    var expires = ";expires=" + expiration.toGMTString()
    if (cookieType == "gameCode") {
        document.cookie = "gameCode=" + cookieData + expires + ";path=/"
    } else if (cookieType == "UUID") {
        document.cookie = "UUID=" + cookieData + expires + ";path=/"
    }
}

function incorrectCode() {
    joinGame.classList.add("incorrectCode")
    setTimeout(function() {
        joinGame.classList.remove("incorrectCode")
    },400)
}

// codeBox.onclick = null

createGame.onmouseover = function() {
    document.getElementById("createButtonHoverPadding").classList.add("hoverFloat")
}

document.getElementById("joinClickArea").onclick = function() {
    document.getElementById("joinClickArea").onclick = function() {
        sendEnteredCode()
    }
    console.log(codeField.value)
    joinGame.classList.add("enterButtonClicked")
    codeBox.classList.remove("moveUp")
    codeBox.classList.add("moveDown")
    setTimeout(function() {
        codeBox.classList.remove("behind")
        },200)
}

codeField.onkeydown = function(keyboardEvent) {
    console.log(keyboardEvent)
    if (keyboardEvent.key == "Enter") {
        sendEnteredCode()
    }
}

server.onopen = function(event) {
    server.onmessage = function(data) {
        let parseData = JSON.parse(data.data)
        console.log(parseData)
        switch (parseData.responseType) {
            case "JOINGAME": {
                createGameCookie(parseData.gameCode, "gameCode")
                createGameCookie(parseData.UUID, "UUID")
                window.location.href = "https://chessarmies.com/play.html/"
                break
            }
            case "NOGAMEFOUND": {
                incorrectCode()
                break
            }
        }
    }
}

createGame.onclick = function() {
    request = {
        requestType: "CREATE",
    }
    server.send(JSON.stringify(request))

    createGame.onclick = null
}
