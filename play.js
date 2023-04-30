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

document.getElementById("startGameButton").onclick = function() {
    if (typeof playerNickname == "undefined") {
        let request = {
            requestType: "UPDATENICKNAME",
            gameCode: gameCode,
            nickname: "",
        }
        server.send(JSON.stringify(request))
    }
    let request = {
        requestType: "STARTPIECEASSIGNMENT",
        gameCode: gameCode,
    }
    server.send(JSON.stringify(request))
}

function StartPieceAssignment(retroactive) {
    if (typeof playerTeam != "undefined") {
        // let tiles = document.querySelectorAll(".tile")
        let col = (playerTeam == "team1" ? "w" : "b")
        document.querySelectorAll(".tile").forEach(function(tile) {
            let tileID = tile.id.split(",")
            if (boardArr[alphabet.indexOf(tileID[0])][tileID[1]-1] != null && boardArr[alphabet.indexOf(tileID[0])][tileID[1]-1].colour == col) {
                tile.onclick = function() {
                    let request = {
                        requestType: "REQUESTPIECE",
                        gameCode: gameCode,
                        piece: tileID,
                    }
                    server.send(JSON.stringify(request))
                }
            }
        })
    }
    if (retroactive) {
        document.querySelectorAll(".tile").forEach(function(tile) {
            let tileID = tile.id.split(",")
            if (boardArr[alphabet.indexOf(tileID[0])][tileID[1]-1] != null) {
                let owner = boardArr[alphabet.indexOf(tileID[0])][tileID[1]-1].owner
                if (owner != "") {
                    if (owner == playerNickname) {
                        document.getElementById(tile.id).classList.add("owned")
                    } else {
                        document.getElementById(tile.id).classList.add("unowned")
                    }
                }
            }
        })
    }
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
                boardArr.forEach(function(dimension, i1) {
                    dimension.forEach(function(individual, i2) {
                        if (boardArr[i1][i2] != null) {
                            boardArr[i1][i2] = Object.assign(CreatePiece(individual.type), boardArr[i1][i2])
                        }
                    })
                })
                gameState = parseData.gameState
                CreateTiles("w")
                let team1 = parseData.team1
                team1.forEach(function(nickname){
                    let nameDOM = document.createElement("p")
                    nameDOM.id = nickname.replaceAll("&", "&amp").replaceAll("<", "&lt").replaceAll(">", "&gt")
                    nameDOM.innerHTML = nickname.replaceAll("&", "&amp").replaceAll("<", "&lt").replaceAll(">", "&gt")
                    nameDOM.classList.add("nickname")
                    document.getElementById("team1").appendChild(nameDOM)
                })
                let team2 = parseData.team2
                team2.forEach(function(nickname){
                    let nameDOM = document.createElement("p")
                    nameDOM.id = nickname.replaceAll("&", "&amp").replaceAll("<", "&lt").replaceAll(">", "&gt")
                    nameDOM.innerHTML = nickname.replaceAll("&", "&amp").replaceAll("<", "&lt").replaceAll(">", "&gt")
                    nameDOM.classList.add("nickname")
                    document.getElementById("team2").appendChild(nameDOM)
                })
                if (typeof playerNickname == "string" && team2.includes(playerNickname)) {
                    playerTeam = "team2"
                    let divs = document.querySelectorAll(".tile")
                    document.getElementById("board").classList.add("rot")
                    for (let i = 0; i < divs.length; ++i) {
                        divs[i].classList.add("rot")
                    }
                } else {
                    playerTeam = "team1"
                }
                if (gameState == "assigning") {
                    StartPieceAssignment(true)
                } else if (gameState == "playing") {

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
                nameDOM.id = nickname.replaceAll("&", "&amp").replaceAll("<", "&lt").replaceAll(">", "&gt")
                nameDOM.innerHTML = nickname.replaceAll("&", "&amp").replaceAll("<", "&lt").replaceAll(">", "&gt")
                nameDOM.classList.add("nickname")
                document.getElementById(team).appendChild(nameDOM)
                if (typeof playerNickname == "string" && nickname == playerNickname) {
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
                document.getElementById("code").innerHTML += " (" + playerNickname.replaceAll("&", "&amp").replaceAll("<", "&lt").replaceAll(">", "&gt") + ")"
                document.getElementById("nicknamePopup").style = "display: none"
                document.getElementById("boardContainer").style = ""
                break
            }
            case "PLAYERNICKNAME": {
                playerNickname = parseData.nickname
                document.getElementById("code").innerHTML += " (" + playerNickname.replaceAll("&", "&amp").replaceAll("<", "&lt").replaceAll(">", "&gt") + ")"
                document.getElementById("nicknamePopup").style = "display: none"
                document.getElementById("boardContainer").style = ""
                break
            }
            case "INVALIDNICKNAME": {
                document.getElementById("enterNickname").innerHTML = "INVALID NICKNAME"
                break
            }
            case "ASSIGNHOST": {
                document.getElementById("startGameButton").style = ""
                document.getElementsByClassName("")
                break
            }
            case "STARTPIECEASSIGNMENT": {
                gameState = "assigning"
                StartPieceAssignment(false)
                break
            }
            case "STARTGAMEPLAY": {
                gameState = "playing"
                break
            }
            case "ASSIGNPIECE": {
                let nickname = parseData.nickname
                let piece = parseData.piece
                if (nickname == playerNickname) {
                    document.getElementById(piece.toString()).classList.add("owned")
                } else {
                    document.getElementById(piece.toString()).classList.add("unowned")
                }
                boardArr[alphabet.indexOf(piece[0])][piece[1]-1].owner = nickname
            }
        }
    }
}
