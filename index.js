// const server = new WebSocket("wss://home.chessarmies.com:5072")

const joinGame = document.getElementById("joinGame")
const joinGameClick = document.getElementById("joinClickArea")
const codeField = document.getElementById("codeField")
const createGame = document.getElementById("createGame")
const codeBox = document.getElementById("codeBox")
const codeCharSet = "ABCDEFGHJKLMNOPQRSTUVWXYZ1234567890"

// function SendEnteredCode() {
//     codeField.value = codeField.value.toUpperCase()
//     codeField.value = codeField.value.replaceAll("O", "0")
//     if (codeField.value.length == 8) {
//         for (i = 0; i < 8; i++) {
//             if (!codeCharSet.includes(codeField.value[i])) {
//                 IncorrectCode()
//                 return
//             }
//         }
//         request = {
//             requestType: "JOIN",
//             gameCode: codeField.value,
//             UUID: RetrieveCookie("UUID"),
//         }
//         server.send(JSON.stringify(request))
//     } else {
//         IncorrectCode() 
//     }
// }

function JoinGameHandler() {
    console.log(this)
    var response = JSON.parse(this.responseText)
    if (response.responseType == "NOGAMEFOUND") {
        IncorrectCode()
    } else {
        window.location.href = "https://chessarmies.com/play.html"
    }
}

function SendEnteredCode() {
    codeField.value = codeField.value.toUpperCase()
    codeField.value = codeField.value.replaceAll("O", "0")
    var enterCodeReq = new XMLHttpRequest()
    enterCodeReq.open("POST", "https://home.chessarmies.com:5072")
    enterCodeReq.withCredentials = true
    enterCodeReq.addEventListener("load", JoinGameHandler)
    enterCodeReq.addEventListener("abort", incorrectCode)
    enterCodeReq.addEventListener("error", incorrectCode)
    if (codeField.value.length == 8) {
        for (i = 0; i < 8; i++) {
            if (!codeCharSet.includes(codeField.value[i])) {
                IncorrectCode()
                return
            }
        }
        request = {
            requestType: "JOIN",
            gameCode: codeField.value,
            // UUID: RetrieveCookie("UUID"),
        }
        // server.send(JSON.stringify(request))
        enterCodeReq.send(JSON.stringify(request))
    } else {
        IncorrectCode() 
    }
}


// function RetrieveCookie(type) {
//     let cookies = getCookies()
//     if (type == "UUID") {
//         let UUID = cookies.UUID
//         return UUID
//     } else if (type == "gameCode") {
//         let gameCode = cookies.gameCode
//         return gameCode
//     } else {
//         return gameCode, UUID
//     }
// }

// function requestSessionID() {
//     request = {
//         requestType: "REQUESTUUID",
//     }
//     server.send(JSON.stringify(request))
// }

function IncorrectCode() {
    joinGame.classList.add("incorrectCode")
    setTimeout(function() {
        joinGame.classList.remove("incorrectCode")
    },400)
    joinGameClick.onclick = function() {
        joinGameClick.onclick = null
        console.log(joinGameClick.onclick)
        SendEnteredCode()
    }
    console.log(joinGameClick.onclick)
}

// codeBox.onclick = null

createGame.onmouseover = function() {
    document.getElementById("createButtonHoverPadding").classList.add("hoverFloat")
}

joinGameClick.onclick = function() {
    joinGameClick.onclick = function() {
        joinGameClick.onclick = null
        console.log(joinGameClick.onclick)
        SendEnteredCode()
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
        if (joinGameClick.onclick != null) {
            joinGameClick.onclick()
        }
    }
}

// server.onopen = function(event) {
//     server.onmessage = function(data) {
//         let parseData = JSON.parse(data.data)
//         console.log(parseData)
//         switch (parseData.responseType) {
//             case "JOINGAME": {
//                 createGameCookie(parseData.gameCode, "gameCode")
//                 createGameCookie(parseData.UUID, "UUID")
//                 window.location.href = "https://chessarmies.com/play/"
//                 break
//             }
//             case "NOGAMEFOUND": {
//                 IncorrectCode()
//                 break
//             }
//         }
//     }
// }

function ResetCreateClick() {
    createGame.onclick = function() {
        createGame.onclick = null
        var joinGameReq = new XMLHttpRequest()
        joinGameReq.open("POST", "https://home.chessarmies.com:5072")
        joinGameReq.withCredentials = true
        joinGameReq.addEventListener("load", JoinGameHandler)
        joinGameReq.addEventListener("abort", ResetCreateClick)
        joinGameReq.addEventListener("error", ResetCreateClick)
        request = {
            requestType: "CREATE",
        }
        joinGameReq.send(JSON.stringify(request))
    }    
}

createGame.onclick = function() {
    createGame.onclick = null
    var joinGameReq = new XMLHttpRequest()
    joinGameReq.open("POST", "https://home.chessarmies.com:5072")
    joinGameReq.withCredentials = true
    joinGameReq.addEventListener("load", JoinGameHandler)
    joinGameReq.addEventListener("abort", ResetCreateClick)
    joinGameReq.addEventListener("error", ResetCreateClick)
    request = {
        requestType: "CREATE",
    }
    joinGameReq.send(JSON.stringify(request))
}
