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
        // window.location.href = "https://chessarmies.com/"
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

document.getElementById("submitNickname").onclick = function() {
    let request = {
        requestType: "UPDATENICKNAME",
        gameCode: gameCode,
        nickname: document.getElementById("nicknameField").value,
    }
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
                boardArr = parseData.boardArr
                CreateTiles("w")
                let team1 = parseData.team1
                team1.forEach(function(nickname){
                    let nameDOM = document.createElement("p")
                    nameDOM.id = nickname
                    nameDOM.innerHTML = nickname
                    nameDOM.classList.add("nickname")
                    document.getElementById("team1").appendChild(nameDOM)
                })
                let team2 = parseData.team2
                team2.forEach(function(nickname){
                    let nameDOM = document.createElement("p")
                    nameDOM.id = nickname
                    nameDOM.innerHTML = nickname
                    nameDOM.classList.add("nickname")
                    document.getElementById("team2").appendChild(nameDOM)
                })
                if (team2.includes(playerNickname)) {
                    let divs = document.querySelectorAll(".tile")
                    if (team == "team1") {
                        document.getElementById("board").classList.remove("rot")
                        for (let i = 0; i < divs.length; ++i) {
                            divs[i].classList.remove("rot")
                        }
                    } else {
                        document.getElementById("board").classList.add("rot")
                        for (let i = 0; i < divs.length; ++i) {
                            divs[i].classList.add("rot")
                        }
                    }
                }
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
                let nameDOM = document.createElement("p")
                nameDOM.id = nickname
                nameDOM.innerHTML = nickname
                nameDOM.classList.add("nickname")
                document.getElementById(team).appendChild(nameDOM)
                if (nickname == playerNickname) {
                    let divs = document.querySelectorAll(".tile")
                    if (team == "team1") {
                        document.getElementById("board").classList.remove("rot")
                        for (let i = 0; i < divs.length; ++i) {
                            divs[i].classList.remove("rot")
                        }
                    } else {
                        document.getElementById("board").classList.add("rot")
                        for (let i = 0; i < divs.length; ++i) {
                            divs[i].classList.add("rot")
                        }
                    }
                }
                break
            }
            case "NICKNAMESET": {
                playerNickname = parseData.nickname
                document.getElementById("code").innerHTML += " (" + playerNickname + ")"
                document.getElementById("nicknamePopup").style = "display: none"
                document.getElementById("boardContainer").style = ""
                break
            }
            case "PLAYERNICKNAME": {
                playerNickname = parseData.nickname
                document.getElementById("code").innerHTML += " (" + playerNickname + ")"
                document.getElementById("nicknamePopup").style = "display: none"
                document.getElementById("boardContainer").style = ""
                break
            }
            case "INVALIDNICKNAME": {
                document.getElementById("enterNickname").innerHTML = "INVALID NICKNAME"
                break
            }
        }
    }
}
