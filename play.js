function getCookies() {
    let cookies = document.cookie
    let splitCookies = cookies.split("; ")
    var parseCookies = {}
    splitCookies.forEach(function(element) {
        console.log(element)
        element = (element.replace("=", ";")).split(";") // split on only the first "="
        parseCookies[element[0]] = element[1]
    })
    console.log(parseCookies)
    return parseCookies
}


{
    var cookies = getCookies()
    var UUID = cookies.UUID
    var gameCode = cookies.gameCode
    if (UUID == undefined || gameCode == undefined) {
        window.location.href = "https://chessarmies.com/"
    } else {
        document.getElementById("code").innerHTML = gameCode
        var sendReq = true
    }
}

function requestGame() {
    let request = {
        requestType: "REQUESTGAMEOBJECT",
        gameCode: gameCode,
    }
    server.send(JSON.stringify(request))
}

document.getElementById("joinTeam1").onclick = document.getElementById("joinTeam2").onclick = function() {
    console.log(this.id)
    let request = {
        requestType: "JOINTEAM",
        team: this.id,
    }
    currentTurn = (this.id == "joinTeam1" ? "w" : "b")
    server.send(JSON.stringify(request))
}

server.onopen = function(event) {
    if (sendReq == true) {
        let request = {
            requestType: "ASSIGNCLIENT",
            UUID: UUID,
            gameCode: gameCode,
        }
        server.send(JSON.stringify(request))
        requestGame()
    }
    server.onmessage = function(data) {
        let parseData = JSON.parse(data.data)
        console.log(parseData)
        switch (parseData.responseType) {
            case "GAMEOBJECT": {
                
                break
            }
            case "": {
                
                break
            }
        }
    }
}
