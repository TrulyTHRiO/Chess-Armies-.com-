const server = new WebSocket("wss://home.chessarmies.com:5074")

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZαβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ" // extra letters are used for boards bigger than 8x8 to allow the code to be extended
const boardColours = "wbwbwbwbbwbwbwbwwbwbwbwbbwbwbwbwwbwbwbwbbwbwbwbwwbwbwbwbbwbwbwbw" // the order of the black and white tiles - can be changed to allow the order of the colours of board tiles to be changed at will for aesthetic purposes
const boardPieces = "rnbqkbnrpppppppp--------------------------------PPPPPPPPRNBQKBNR" // the order of the pieces on the board at the start of the game - can be changed to allow custom starting positions
const pieceTimer = 3000 // the timer for each piece - can be changed to change how long before each piece can be moved again
const boardSize = Math.sqrt(boardColours.length)
const tileMax = (document.documentElement.clientWidth > document.documentElement.clientHeight ? "dvh" : "dvw") // determines how the board should be sized based on whether the device is in portrait or landscape

selectedTile = null

function CreateTiles() { // creates the tile divs within the board
    for (let i1 = 0; i1 < boardSize; i1++) {
        for (let i2 = 0; i2 < boardSize; i2++) {
            let col = boardColours[i1*boardSize+i2]
            tile = document.createElement("div")
            tile.classList.add("tile")
            if (col == "b") {
                tile.classList.add("black")
            } else {
                tile.classList.add("white")
            }
            tile.setAttribute("style", "height: "+(100-10)/boardSize+tileMax+"; width: "+(100-10)/boardSize+tileMax)
            pos = [alphabet[i2],(boardSize-i1)]
            tile.setAttribute("id", pos)
            document.getElementById("board").appendChild(tile)
            if (boardArr[i2][boardSize-i1-1] != null) {
                UpdateImage(([alphabet[i2],(boardSize-i1)]))
            }
        }
    }
    document.getElementById("board").setAttribute("style", "grid-template-columns: repeat("+ boardSize + ", min-content)")
}

function CreatePiece(piece, tile) { // creates a new piece object given a letter and a position on the chessboard
    let col
    if (piece == piece.toLowerCase()) {
        col = "b"
    } else {
        col = "w"
    }
    piece = piece.toLowerCase()
    if (piece == "r") {
        return new rook(tile, col)
    }
    if (piece == "n") {
        return new knight(tile, col)
    }
    if (piece == "b") {
        return new bishop(tile, col)
    }
    if (piece == "q") {
        return new queen(tile, col)
    }
    if (piece == "k") {
        return new king(tile, col)
    }
    if (piece == "p") {
        return new pawn(tile, col)
    }
    if (piece == "-") {
        return null
    }
}

function RequestMovePiece(piece, tile) { // sends a request to the server with the move that is attempting to be made
    let request = {
        requestType: "MOVEPIECE",
        gameCode: gameCode,
        from: piece.pos,
        to: tile,
    }
    server.send(JSON.stringify(request))
}

function MovePiece(piece, tile, rookDistance) { // moves a piece (or pieces) on the board and in the piece array
    if (piece instanceof pawn && (tile[1] == 1 || tile[1] == boardSize)) {
        boardArr[alphabet.indexOf(piece.pos[0])][piece.pos[1]-1].ValidateMove = (new queen).ValidateMove
        boardArr[alphabet.indexOf(piece.pos[0])][piece.pos[1]-1].img = (new queen(undefined, (boardArr[alphabet.indexOf(piece.pos[0])][piece.pos[1]-1].colour))).img
        boardArr[alphabet.indexOf(piece.pos[0])][piece.pos[1]-1] = Object.assign(new queen, boardArr[alphabet.indexOf(piece.pos[0])][piece.pos[1]-1])
    }
    document.getElementById(piece.pos).innerHTML = ""
    if ((piece instanceof king) ? (Math.abs(alphabet.indexOf(piece.pos[0])-alphabet.indexOf(tile[0])) > 1) : false) {
        piece.Castle(rookDistance, tile)
    } else {
        boardArr[alphabet.indexOf(tile[0])][tile[1]-1] = piece
        boardArr[alphabet.indexOf(piece.pos[0])][piece.pos[1]-1] = null
        piece.pos = tile
        UpdateImage(tile)
        piece.SetTimer(pieceTimer)
    }
}

function UpdateImage(tile) { // updates the image of a tile, putting the correct piece within the div of the corresponding tile
    document.getElementById(tile).innerHTML = '<img class="piece" src="'+boardArr[alphabet.indexOf(tile[0])][tile[1]-1].img+'"></img>'
}

function DivsOnClickRequest() { // defines how each tile acts when clicked
    let thisID = this.id.split(",")
    if (selectedTile != null) {
        document.getElementById(selectedTile.pos).classList.remove("selected")
        if (selectedTile == boardArr[alphabet.indexOf(thisID[0])][thisID[1]-1]) {
            selectedTile = null
        } else if (selectedTile.ValidateMove(thisID) > 0) {
            if (selectedTile.turnMovable) {
                RequestMovePiece(selectedTile, thisID)
            }
            selectedTile = null
        } else if (boardArr[alphabet.indexOf(thisID[0])][thisID[1]-1] && boardArr[alphabet.indexOf(thisID[0])][thisID[1]-1].owner == playerNickname) {
            if ((boardArr[alphabet.indexOf(thisID[0])][thisID[1]-1]).colour == (playerTeam == "team1" ? "w" : "b")) {
                selectedTile = boardArr[alphabet.indexOf(thisID[0])][thisID[1]-1]
                this.classList.add("selected")
            } else {
                selectedTile = null
            }
        } else {
            selectedTile = null
        }
    } else if (boardArr[alphabet.indexOf(thisID[0])][thisID[1]-1] && boardArr[alphabet.indexOf(thisID[0])][thisID[1]-1].owner == playerNickname){
        if ((boardArr[alphabet.indexOf(thisID[0])][thisID[1]-1]).colour == (playerTeam == "team1" ? "w" : "b")) {
            selectedTile = boardArr[alphabet.indexOf(thisID[0])][thisID[1]-1]
            this.classList.add("selected")
        }
    }
}
