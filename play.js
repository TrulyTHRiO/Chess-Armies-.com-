function getCookies() {
    let cookies = document.cookie
    let splitCookies = cookies.split("; ")
    var parseCookies = {}
    splitCookies.forEach(function(i) {
        console.log(i)
        parseCookies[i.split("=")[0]] = i.split("=")[1]
    })
    console.log(parseCookies)
    return parseCookies
}


{
    var cookies = getCookies()
    var UUID = cookies.UUID
    var gameCode = cookies.gameCode
    if (UUID == undefined || gameCode == undefined) {
//         window.location.href = "https://chessarmies.com/"
        console.log("redirect")
    } else {
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
}

server.onopen = function(event) {
    if (sendReq == true) {
        let request = {
            requestType: "ASSIGNCLIENT",
            UUID: "bassl",
            gameCode: "gameCode",
        }
        server.send(JSON.stringify(request))
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
