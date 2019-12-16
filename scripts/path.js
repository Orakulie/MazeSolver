//Felder die noch berechnet werden müssen
var openSet = [];

//Felder die bereits berechnet wurden
var closedSet = [];

//start punkt
var start;

//end punkt
var end;

//Path Array
var path = [];

var pathTime = 0;
var pathTimeNano = 0;

//PATH

function timer() {
    pathTime++;
}

function generatePath() {
    if (pathTime < 10) {
        timeDocument.innerHTML = "Verstrichene Zeit: " + "0" + time + "s || 0" + pathTime + "s";
    } else {
        timeDocument.innerHTML = "Verstrichene Zeit: " + time + "s || " + pathTime + "s";
    }

    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    //Solange es noch zu berechnede Felder gibt
    if (openSet.length > 0) {

        //Bester F Wert
        var optimalF = 0;

        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[optimalF].f) { //Wenn ein Weg mit geringeren Kosten gefunden wird...
                optimalF = i;   //wird er abgespeichert
            }
        }

        //Current wird zum bestem Feld
        current = openSet[optimalF];

        //Wenn das current das Ende ist, wurde ein Weg gefunden
        if (current == end) {

            //Stats werden angepasst
            if(weg.length != 0){
            amountMovedDocument.innerHTML = "Kürzester Weg: " + (path.length + 1) + " Felder, dein Weg war " + Math.floor(100 - ((path.length + 1) / (weg.length) * 100)) + "% schlechter";
            }else {
                amountMovedDocument.innerHTML = "Kürzester Weg: " + (path.length + 1) + " Felder";
            }
            //Update function wird gestoppt
            clearInterval(updateInteval);
            clearInterval(timer);
        }

        //Current wird aus dem OpenSet gelöscht, weil er bereits berechnet wurde
        remove(openSet, current);

        //Current kommt in das closedSet, damit er nicht nochmal berechnet wird
        closedSet.push(current);

        //Wir gucken uns die Nachbarn des Current an:
        var nachbarn = current.pathNeighbors;

        //für alle Nachbarn von Current...
        for (var i = 0; i < nachbarn.length; i++) {
            var nachbar = nachbarn[i];

            //Wenn der Nachbar noch nicht berechnet wurde und auch nicht durch eine Wand abgeblockt ist
            if (!closedSet.includes(nachbar) && checkWalls(current, nachbar)) {

                //Kosten bis zum Current + 1
                var tempG = current.g + 1;
                var newPath = false;

                //Wenn der Nachbar im openSet ist...
                if (openSet.includes(nachbar)) {

                    //Wenn G vom Current kleiner ist als vom Nachbar...
                    if (tempG < nachbar.g) {

                        // neuen Wert zuweisen, da ein kürzerer Pfad zum Nachbar gefunden wurde
                        nachbar.g = tempG;

                        //Neuer Pfad wurde gefunden
                        newPath = true;
                    } else { //G vom Nachbar ist kleiner als der G+1 vom Current

                        //Kein neuer Pfad wurde gefunden
                        newPath = false;
                    }
                } else { //wenn der Nachbar noch nicht im openSet ist...

                    //G = current.g + 1
                    nachbar.g = tempG;

                    //Nachbar kommt ins openSet
                    openSet.push(nachbar);

                    //es wurde ein neuer Pfad gefunden
                    newPath = true;
                }

                //Wenn ein neuer Pfad gefunden wurde...
                if (newPath) {

                    //Berechnet geschätzen Abstand zum Ende
                    nachbar.h = heuristic(nachbar, end);

                    //F = h + g
                    nachbar.f = nachbar.h + nachbar.g;

                    //Optimales vorheriges Feld = current
                    nachbar.pre = current;
                }
            }
        }



    }

    //Path wird von hinten nach vorne neu aufgebaut
    path = [];
    var temp = current;
    path.push(temp);

    while (temp.pre) {
        path.push(temp.pre); //Dem Pfad wird dem Vorgänger von Temp übergeben(beim ersten mal ist das unser Current, also der letzte untersuchte)
        temp = temp.pre; //Der Vorgänger wird der neue Temp -> geht bis zum Anfang zurück
    }

    //Falls man das Maze selber versucht hat, zeichnet den Player weg
    if (weg) {
        for (var i = 0; i < weg.length; i++) {
            weg[i].showPath("#6100C9");
            if (!path.includes(weg[i + 1])) {
                if (path.includes(weg[i])) {
                    ctx.fillStyle = c;
                    ctx.beginPath();
                    ctx.arc((weg[i].x * scale) + (scale / 2), (weg[i].y * scale) + (scale / 2), scale / 4, 0, 360);
                    ctx.fill();
                }
            } else {
                if (!path.includes(weg[i])) {
                    ctx.fillStyle = c;
                    ctx.beginPath();
                    ctx.arc((weg[i + 1].x * scale) + (scale / 2), (weg[i + 1].y * scale) + (scale / 2), scale / 4, 0, 360);
                    ctx.fill();
                }
            }
        }
    }

    //Zeichnet den Optimalen Pfad
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineWidth = scale / 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.moveTo(path[0].x * scale + scale / 2, path[0].y * scale + scale / 2);
    for (var i = 0; i < path.length - 1; i++) {
        ctx.lineTo(path[i + 1].x * scale + scale / 2, path[i + 1].y * scale + scale / 2)
    }
    ctx.stroke();

    drawStartEnd();


}

//PATH

//Entfernt ein Element aus einem Array
function remove(array, element) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] == element) {
            array.splice(i, 1);
        }
    }
}

//Berechnet die Distanz von a zu b
function heuristic(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y)
    //return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}

//Guckt ob a und b durch eine Wand getrennt sind
function checkWalls(a, b) {
    return moveRight(a, b) || moveLeft(a, b) || moveUp(a, b) || moveDown(a, b);
}
function moveRight(a, b) {
    var differenceX = a.x - b.x;
    if (differenceX == -1) {//bewegung von links nach rechts
        if (!a.walls[0])
            return true;
    }
    return false;
}
function moveLeft(a, b) {
    var differenceX = a.x - b.x;
    if (differenceX == 1) {//bewegung von rechts nach links
        if (!a.walls[1])
            return true;
    }
    return false;
}
function moveUp(a, b) {
    var differenceY = a.y - b.y;
    if (differenceY == 1) {//bewegung von unten nach oben
        if (!a.walls[3])
            return true;
    }
    return false;
}
function moveDown(a, b) {
    var differenceY = a.y - b.y;
    if (differenceY == -1) {//bewegung von oben nach unten
        if (!a.walls[2])
            return true;
    }
    return false;
}