var craig = "CRAIG"
var nextCraig = 0
var score = window.localStorage.getItem("CRAIG")
score == null ? score = 0 : 

document.getElementById("craigletter").innerHTML = craig[score%5]
nextCraig = score%5
document.getElementById("score").innerHTML = Math.floor(score/5)

// if (e.key === "Backspace" || e.key === "Delete") {
//     deleteKey()
//     return
// }


document.onkeydown = function(keyboardEvent) {
    // console.log(keyboardEvent.key)
    // console.log(keyboardEvent.key.toLowerCase().match(/^[a-z]$/))
    if (keyboardEvent.key.toLowerCase().match(/^[a-z]$/)) {
        // console.log("success")
        if (keyboardEvent.key.toUpperCase() == craig[nextCraig]) {
            nextCraig == 4 ? nextCraig = 0 : nextCraig++
            document.getElementById("craigletter").innerHTML = craig[nextCraig]
            window.localStorage.setItem("CRAIG", ++score)
            if (keyboardEvent.key.toUpperCase() == "G") {
                document.getElementById("score").innerHTML++
            }
        } else {
            document.getElementsByTagName("body")[0].style = "background-color: red"
            setTimeout(() => {
                document.getElementsByTagName("body")[0].style = "background-color: black"
            }, 400);
            score -= score%5
            document.getElementById("craigletter").innerHTML = "C"
            nextCraig = 0
            window.localStorage.setItem("CRAIG", score)
        }
    }
}

document.getElementById("reset").onclick = function() {
    nextCraig = 0
    score = 0
    window.localStorage.setItem("CRAIG", 0)
    document.getElementById("craigletter").innerHTML = craig[nextCraig]
    document.getElementById("score").innerHTML = 0
}