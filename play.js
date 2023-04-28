function GetCookies() {
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
    var cookies = GetCookies()
    var UUID = cookies.UUID
    var gameCode = cookies.gameCode
    if (UUID == undefined || gameCode == undefined) {
        window.location.href = "https://chessarmies.com/"
    } else {
        document.getElementById("code").innerHTML = gameCode
        var sendReq = true
    }
}

function RequestGame() {
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
        gameCode: gameCode,
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
        RequestGame()
    }
    server.onmessage = function(data) {
        let parseData = JSON.parse(data.data)
        console.log(parseData)
        switch (parseData.responseType) {
            case "GAMEOBJECT": {
                
                break
            }
            case "TEAMCHANGE": {
                let nickname = parseData.nickname
                let team = (parseData.team == "joinTeam1" ? "team1" : "team2")
                let oldTeam = parseData.oldTeam
                if (oldTeam != undefined) {
                    // Array.from(document.getElementById(team).children).forEach(function(element, i) {
                        //     if (element.innerHTML == nickname) {
                            //         document.getElementById(team).removeChild(document.getElementById(team.children[i]))
                            //     }
                            // })
                            document.getElementById(nickname).remove()
                        }
                let name = document.createElement("p")
                name.id = nickname
                name.innerHTML = nickname
                name.classList.add("nickname")
                document.getElementById(team).appendChild(name)
                break
            }
        }
    }
}
