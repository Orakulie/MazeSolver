var player;
var weg = [];
var keyPresses = {};
var nanoTime = 0;
var time = 0;
var updateInteval;

function Player() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;



    //Weg
    weg = [grid[0]];
    this.timesMoved = 1;


    //Zeigt den Spieler
    this.show = function () {
        grid[index(this.x, this.y)].highlightColor("yellow");
    }

    //Update function
    this.update = function () {
        var i = index(this.x, this.y);

        if (!grid[i].walls[0]) {//NACH RECHTS
            if (keyPresses.d) {
                this.x += 1;
                i = index(this.x, this.y);
                this.timesMoved++;
                if (!weg.includes(grid[i])) {
                    weg.push(grid[i]);
                }
            }
        }
        if (!grid[i].walls[1]) {//NACH LINKS
            if (keyPresses.a) {
                this.x += -1;
                i = index(this.x, this.y);
                this.timesMoved++;
                if (!weg.includes(grid[i])) {
                    weg.push(grid[i]);
                }
            }
        }
        if (!grid[i].walls[2]) { //NACH UNTEN
            if (keyPresses.s) {
                this.y += 1;
                i = index(this.x, this.y);
                this.timesMoved++;
                if (!weg.includes(grid[i])) {
                    weg.push(grid[i]);
                }
            }
        }
        if (!grid[i].walls[3]) { //NACH OBEN
            if (keyPresses.w) {
                this.y += -1;
                i = index(this.x, this.y);
                this.timesMoved++;
                if (!weg.includes(grid[i])) {
                    weg.push(grid[i]);
                }
            }
        }
    }

    //Stoppt den Spieler
    this.stop = function () {
        this.xSpeed = 0;
        this.ySpeed = 0;
    }

}

//Update function
function updatePlayer() {
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    drawStartEnd();
    player.update();
    player.show();

    if (player.timesMoved < 10) {
        amountMovedDocument.innerHTML = "Zurückgelegte Felder: " + "0" + player.timesMoved + " (" + (player.timesMoved - weg.length) + " Felder zurück gegangen)";
    } else {
        amountMovedDocument.innerHTML = "Zurückgelegte Felder: " + player.timesMoved + " (" + (player.timesMoved - weg.length) + " Felder zurück gegangen)";
    }
    nanoTime++;
    if (nanoTime >= 10) {
        time++;
        nanoTime = 0;
        if (time < 10) {
            time.innerHTML = "Verstrichene Zeit: " + "0" + time + "s";
        } else {
            time.innerHTML = "Verstrichene Zeit: " + time + "s";
        }
    }

    if (player.x == end.x && player.y == end.y) {
        clearInterval(updateInteval);
        disableButton("startPath", false);
        
        for (var i = 0; i < weg.length; i++) {
            weg[i].showPath("#6100C9");
        }
        drawStartEnd();

    }
}