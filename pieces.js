class piece {

    constructor(tile, colour) {
        this.pos = tile
        this.colour = colour
    }

    turnMovable = true
    lastMoved = undefined
    owner = ""

    SetTimer(time) {
        this.turnMovable = false
        setTimeout(this.SetTurnMovable, time, this)
    }

    SetTurnMovable(piece) {
        piece.turnMovable = true
    }
    
}

class rook extends piece {

    constructor(tile, colour) {
        super(tile, colour)
        this.pos = tile
        this.colour = colour
        this.img = "pieces/"+(colour == "w" ? "white-rook.png" : "black-rook.png")
    }

    moved = false
    type = "R"

    printShit() {
        console.log(this.pos)
        console.log(this.colour)
    }

    ValidateMove(posTo) {
        if (((this.pos[0] == posTo[0]) && (this.pos[1] != posTo[1]) || (this.pos[0] != posTo[0]) && (this.pos[1] == posTo[1])) && (boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1] == null ? true : boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1].colour != this.colour)) {
            for (let i = 1; i < Math.abs(this.pos[1]-posTo[1]+(alphabet.indexOf(this.pos[0])-alphabet.indexOf(posTo[0]))); i++) {
                if (boardArr[alphabet.indexOf(this.pos[0])+(Math.sign(alphabet.indexOf(this.pos[0])-alphabet.indexOf(posTo[0]))*-i)][parseInt(this.pos[1])+(Math.sign(this.pos[1]-posTo[1])*-i)-1] != null) {
                    return false
                }
            }
            this.moved = true
            return true
        } else {
            return false
        }
    }

}

class knight extends piece {

    constructor(tile, colour) {
        super(tile, colour)
        this.pos = tile
        this.colour = colour
        this.img = "pieces/"+(colour == "w" ? "white-knight.png" : "black-knight.png")
    }
    
    type = "N"

    printShit() {
        console.log(this.pos)
        console.log(this.colour)
    }

    ValidateMove(posTo) {
        if (((alphabet.indexOf(this.pos[0])-alphabet.indexOf(posTo[0]))**2+(this.pos[1]-posTo[1])**2 == 5) && ((boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1]) == null ? true : (boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1]).colour != this.colour)) {
            return true
        } else {
            return false
        }
    }

}

class bishop extends piece {

    constructor(tile, colour) {
        super(tile, colour)
        this.pos = tile
        this.colour = colour
        this.img = "pieces/"+(colour == "w" ? "white-bishop.png" : "black-bishop.png")
    }
    
    type = "B"

    printShit() {
        console.log(this.pos)
        console.log(this.colour)
    }

    ValidateMove(posTo) {
        if (Math.abs(alphabet.indexOf(this.pos[0])-alphabet.indexOf(posTo[0])) == Math.abs(this.pos[1]-posTo[1]) && (boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1] == null ? true : boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1].colour != this.colour)) {
            for (let i = 1; i < Math.abs(this.pos[1]-posTo[1]); i++) {
                if (boardArr[alphabet.indexOf(this.pos[0])+(Math.sign(alphabet.indexOf(this.pos[0])-alphabet.indexOf(posTo[0]))*-i)][parseInt(this.pos[1])+(Math.sign(this.pos[1]-posTo[1])*-i)-1] != null) {
                    return false
                }
            }
            return true
        } else {
            return false
        }
    }

}

class queen extends piece {

    constructor(tile, colour) {
        super(tile, colour)
        this.pos = tile
        this.colour = colour
        this.img = "pieces/"+(colour == "w" ? "white-queen.png" : "black-queen.jpg")
    }

    type = "Q"

    printShit() {
        console.log(this.pos)
        console.log(this.colour)
    }

    ValidateMove(posTo) {
        if (((this.pos[0] == posTo[0]) && (this.pos[1] != posTo[1]) || (this.pos[0] != posTo[0]) && (this.pos[1] == posTo[1])) && (boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1] == null ? true : boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1].colour != this.colour)) {
            for (let i = 1; i < Math.abs(this.pos[1]-posTo[1]+(alphabet.indexOf(this.pos[0])-alphabet.indexOf(posTo[0]))); i++) {
                if (boardArr[alphabet.indexOf(this.pos[0])+(Math.sign(alphabet.indexOf(this.pos[0])-alphabet.indexOf(posTo[0]))*-i)][parseInt(this.pos[1])+(Math.sign(this.pos[1]-posTo[1])*-i)-1] != null) {
                    return false
                }
            }
            return true
        } else if (Math.abs(alphabet.indexOf(this.pos[0])-alphabet.indexOf(posTo[0])) == Math.abs(this.pos[1]-posTo[1]) && (boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1] == null ? true : boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1].colour != this.colour)) {
            for (let i = 1; i < Math.abs(this.pos[1]-posTo[1]); i++) {
                if (boardArr[alphabet.indexOf(this.pos[0])+(Math.sign(alphabet.indexOf(this.pos[0])-alphabet.indexOf(posTo[0]))*-i)][parseInt(this.pos[1])+(Math.sign(this.pos[1]-posTo[1])*-i)-1] != null) {
                    return false
                }
            }
            return true
        } else {
            return false
        }
    }

}

class king extends piece {

    constructor(tile, colour) {
        super(tile, colour)
        this.pos = tile
        this.colour = colour
        this.img = "pieces/"+(colour == "w" ? "white-king.png" : "black-king.jpg")
    }

    moved = false
    type = "K"

    printShit() {
        console.log(this.pos)
        console.log(this.colour)
    }

    Castle(rookDistance, castleDir) {
        document.getElementById(this.pos[0]+","+this.pos[1]).innerHTML = ""
        document.getElementById(alphabet[alphabet.indexOf(this.pos[0])+rookDistance*Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))]+","+this.pos[1]).innerHTML = ""
        boardArr[alphabet.indexOf(this.pos[0])+rookDistance*Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1]
        boardArr[alphabet.indexOf(this.pos[0])+Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1] = boardArr[alphabet.indexOf(this.pos[0])+rookDistance*Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1]
        boardArr[alphabet.indexOf(this.pos[0])+rookDistance*Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1].pos = (alphabet[alphabet.indexOf(this.pos[0])+Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))]+","+this.pos[1]).split(",")
        boardArr[alphabet.indexOf(this.pos[0])+rookDistance*Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1].turnMovable = false
        boardArr[alphabet.indexOf(this.pos[0])+rookDistance*Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1].moved = true
        boardArr[alphabet.indexOf(this.pos[0])+rookDistance*Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1] = null
        boardArr[alphabet.indexOf(this.pos[0])+2*Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1] = this
        boardArr[alphabet.indexOf(this.pos[0])][this.pos[1]-1] = null
        console.log(alphabet[alphabet.indexOf(this.pos[0])+Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))]+this.pos[1],"asdcvsvzxxxxxxxx")
        UpdateImage((alphabet[alphabet.indexOf(this.pos[0])+Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))]+","+this.pos[1]).split(","))
        if (document.getElementById("board").classList.contains("rot")) {
            document.getElementById(alphabet[alphabet.indexOf(this.pos[0])+Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))]+","+this.pos[1]).classList.remove("rot")
        } else {
            document.getElementById(alphabet[alphabet.indexOf(this.pos[0])+Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))]+","+this.pos[1]).children[0].classList.add("rot")
        }
        this.pos = (alphabet[alphabet.indexOf(this.pos[0])+2*Math.sign(alphabet.indexOf(castleDir[0])-alphabet.indexOf(this.pos[0]))] + "," + this.pos[1]).split(",")
        this.turnMovable = false
        this.moved = true
        UpdateImage(this.pos)
        if (document.getElementById("board").classList.contains("rot")) {
            document.getElementById(this.pos).classList.remove("rot")
        } else {
            document.getElementById(this.pos).children[0].classList.add("rot")
        }
        // UpdateImage()
        console.log(this)
    }

    ValidateMove(posTo) {
        // if (((alphabet.indexOf(this.pos[0])-alphabet.indexOf(posTo[0]))**2+(this.pos[1]-posTo[1])**2 < 2) && (boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1]) == null) {
        if ((Math.abs(alphabet.indexOf(this.pos[0])-alphabet.indexOf(posTo[0])) < 2) && (Math.abs(this.pos[1]-posTo[1]) < 2) && ((boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1] == null ? true : boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1]).colour !== this.colour)) {
            this.moved = true
            return true
        } else if ((this.pos[1] == posTo[1]) && (this.moved == false)) {
            let i = 0
            console.log("elseifin")
            while (boardArr[alphabet.indexOf(this.pos[0])+i*Math.sign(alphabet.indexOf(posTo[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1] !== undefined) {
                i += 1
                console.log("loopin", boardArr[alphabet.indexOf(this.pos[0])+i*Math.sign(alphabet.indexOf(posTo[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1],this.pos[1]-1)
                if (boardArr[alphabet.indexOf(this.pos[0])+i*Math.sign(alphabet.indexOf(posTo[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1] == null) {
                } else if (boardArr[alphabet.indexOf(this.pos[0])+i*Math.sign(alphabet.indexOf(posTo[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1] instanceof rook) {
                    console.log("OROOOROOKK")
                    if ((boardArr[alphabet.indexOf(this.pos[0])+i*Math.sign(alphabet.indexOf(posTo[0])-alphabet.indexOf(this.pos[0]))][this.pos[1]-1].colour == this.colour) && ((boardArr[alphabet.indexOf(this.pos[0])+i*Math.sign(alphabet.indexOf(posTo[0])-alphabet.indexOf(this.pos[0]))][parseInt(this.pos[1]-1)].moved == false))) {
                        console.log("truesch")
                        // MAKE CASTLING SECTION IN MOVE PIECE FUNCTION
                        // this.moved = true
                        // this.Castle(i, posTo)
                        return true
                    } else {
                        console.log("falsch")
                        return false
                    }
                } else {
                    console.log("elseinelsein", )
                    return false
                }
            }
        } else {
            console.log("elsein")
            return false
        }
    }

}

class pawn extends piece {

    constructor(tile, colour) {
        super(tile, colour)
        this.pos = tile
        this.colour = colour
        this.img = "pieces/"+(colour == "w" ? "white-pawn.png" : "black-pawn.png")
    }

    moved = false
    type = "P"

    printShit() {
        console.log(this.pos)
        console.log(this.colour)
    }

    ValidateMove(posTo) {
        console.log(boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1])
        if (boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1] == null) {
            if ((parseInt(this.pos[1])+(this.colour == "w" ? 1 : -1) == posTo[1]) && (this.pos[0] == posTo[0])) {
                this.moved = true
                return true
            } else if ((!this.moved) && (boardArr[alphabet.indexOf(this.pos[0])][parseInt(this.pos[1])+(this.colour == "w" ? 0 : -2)] == null) && (parseInt(this.pos[1])+(this.colour == "w" ? 2 : -2) == posTo[1]) && (this.pos[0] == posTo[0])) {
                console.log("aloha")
                this.moved = true
                return true
            } else {
                console.log((parseInt(this.pos[1])+(this.colour == "w" ? 2 : -2)), posTo[1])
                console.log(parseInt(this.pos[1])+(this.colour == "w" ? 1 : -1))
                return false
            }
        } else if ((boardArr[alphabet.indexOf(posTo[0])][posTo[1]-1].colour != this.colour) && ((parseInt(this.pos[1])+(this.colour == "w" ? 1 : -1) == posTo[1])) && (Math.abs(alphabet.indexOf(this.pos[0])-alphabet.indexOf(posTo[0])))) {
            this.moved = true
            return true
        } else {
            return false
        }
    }

}
