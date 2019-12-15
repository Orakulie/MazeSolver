const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//MAZE
var grid = [];
var current;
var stack = [1];
var next;
var alreadyGenerated = false;
var kreuzung = 0;
var felder;
//MAZE

//PATH
var openSet = [];
var closedSet = [];
var start;
var end;
var path = [];
var alreadyGeneratedPath = false;
//PLAYER
var player;
var weg = [];
var keyPresses = {};
var nanoTime = 0;
var time = 0;
var updateInteval;


var speed = 1;
document.getElementById("startPath").disabled = true;
document.getElementById("startPlay").disabled = true;
document.getElementById("startSurrender").disabled = true;


if(localStorage["felder"]) {
    document.getElementById("felder").value = localStorage["felder"];
    generate();
}


//PLAY
function play() {
    if (!player) {
        player = new Player();
    }
    document.getElementById("startPath").disabled = true;
    document.getElementById("startSurrender").disabled = false;
    updateInteval = setInterval(updatePlayer, 1000 / 10);
}
function surrender() {
    clearInterval(updateInteval);
    end.show();
    ctx.fillStyle = "green";
    ctx.fillRect(0 * scale + scale * 0.25, 0 * scale + scale * 0.25, scale - scale * 0.5, scale - scale * 0.5);
    document.getElementById("startPath").disabled = false;
    weg.push(grid[index(player.x, player.y)]);
    for (var i = 0; i < weg.length; i++) {
        weg[i].showPath("#6100C9");
    }
    ctx.fillStyle = "green";
    ctx.fillRect(0 * scale + scale * 0.25, 0 * scale + scale * 0.25, scale - scale * 0.5, scale - scale * 0.5);
    document.getElementById("startSurrender").disabled = false;
}
document.addEventListener("keydown", (evt) => {
    /*     if (player) {
            player.changeDirection(evt.key);
        } */
    keyPresses[evt.key] = true;

});

document.addEventListener("keyup", (evt) => {
    /*     if (player) {
            player.stop();
        } */
    keyPresses[evt.key] = false;
});
function updatePlayer() {
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }
    start.highlight();
    player.update();
    player.show();

    if (player.timesMoved < 10) {
        document.getElementById("amountMoved").innerHTML = "Zurückgelegte Felder: " + "0" + player.timesMoved;
    } else {
        document.getElementById("amountMoved").innerHTML = "Zurückgelegte Felder: " + player.timesMoved;
    }
    nanoTime++;
    if (nanoTime >= 10) {
        time++;
        nanoTime = 0;
        if (time < 10) {
            document.getElementById("time").innerHTML = "Verstrichene Zeit: " + "0" + time + "s";
        } else {
            document.getElementById("time").innerHTML = "Verstrichene Zeit: " + time + "s";
        }
    }

    if (player.x == end.x && player.y == end.y) {
        clearInterval(updateInteval);
        end.show();
        document.getElementById("startPath").disabled = false;

        weg.push(end);
        for (var i = 0; i < weg.length; i++) {
            weg[i].showPath("#6100C9");
        }
        ctx.fillStyle = "green";
        ctx.fillRect(0 * scale + scale * 0.25, 0 * scale + scale * 0.25, scale - scale * 0.5, scale - scale * 0.5);

    }
}

//MAZE
function generate() {
    document.getElementById("startMaze").disabled = true;
    if (alreadyGenerated == false) {
        felder = document.getElementById("felder").value;
        rows = columns = Math.floor(Math.sqrt(felder));
        scale = Math.floor(canvas.height / rows);
        canvas.width = columns * scale;
        canvas.height = rows * scale;
        // ctx.translate(0.5, 0.5);


        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < columns; x++) {
                wall = new Wall(x, y);
                grid.push(wall);

            }
        }
        current = grid[0];
        current.walls[0] = false;
        current.walls[2] = false;
        grid[index(0, 1)].walls[3] = false;
        grid[1].walls[1] = false;

        start = grid[0];
        end = grid[grid.length - 1];
        openSet.push(start);

        for (var i = 0; i < grid.length; i++) {
            grid[i].addNeighbours();
        }
        updateInteval = setInterval(generateMaze, speed);

    } else {
        var temp = document.getElementById("felder").value;
        localStorage["felder"] = ""+temp;
        window.location.reload(false);
        document.getElementById("felder").value = temp;
    }
}
function generateMaze() {
    if (stack.length != 0) {
        ctx.fillStyle = "coral";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < grid.length; i++) {
            grid[i].show();
        }

        current.visited = true;
        current.highlight();
        next = current.checkNeighbours();
        if (next) {
            next.visited = true;

            stack.push(current);

            removeWalls(current, next);

            current = next;
        } else if (stack.length > 0) {
            current = stack.pop();
        }
    } else {
        clearInterval(updateInteval);
        document.getElementById("startPath").disabled = false;
        document.getElementById("startMaze").innerHTML = "Neues Maze";
        document.getElementById("startPlay").disabled = false;
        alreadyGenerated = true;
        for (var y = 0; y < parseInt(felder) / 15; y++) {
            var i = Math.floor(Math.random() * (grid.length - 1));
            if (grid[index(grid[i].x + 1, grid[i].y)] && grid[index(grid[i].x, grid[i].y + 1)]) {
                removeWalls(grid[i], grid[index(grid[i].x + 1, grid[i].y)])
                removeWalls(grid[i], grid[index(grid[i].x, grid[i].y + 1)]);
            }
        }
        for (var i = 0; i < grid.length; i++) {
            grid[i].show();
        }
        start.highlight();
        document.getElementById("startMaze").disabled = false;
    }
}



//PATH
function findPath() {
    document.getElementById("startPlay").disabled = true;
    updateInteval = setInterval(generatePath, speed);
}
function generatePath() {

    if (!alreadyGeneratedPath) {
        for (var i = 0; i < grid.length; i++) {
            grid[i].show();
        }
        if (openSet.length > 0) {

            var optimalF = 0;

            for (var i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[optimalF].f) { //wenn f(also die kosten) kleiner sind als der Optimale davor, wird der Optimale neue zugewiesen
                    optimalF = i;
                }
            }
            current = openSet[optimalF]; //Current wird dem neuen Wert zugewiesen

            if (openSet[optimalF] == end) { //Wenn das Element mit der besten F dass Ende ist FERTIG
                //LÖSUNG
                document.getElementById("rightMoves").innerHTML = "Kürzester Weg: " + path.length + " Felder, dein Weg war " + Math.floor(100 - (path.length / (weg.length - 1) * 100)) + "% schlechter";
                alreadyGeneratedPath = true;
                clearInterval(updateInteval);
                document.getElementById("startPath").disabled = true;
                document.getElementById("startPlay").disabled = false;
            }

            remove(openSet, current);
            closedSet.push(current);

            //Wir gucken uns die Nachbarn des Current an:
            var nachbarn = current.pathNeighbors;
            for (var i = 0; i < nachbarn.length; i++) { //für alle Nachbarn von Current
                var nachbar = nachbarn[i];

                if (!closedSet.includes(nachbar) && checkWalls(current, nachbar)) { //wenn der Nachbar nicht bereits berechnet wurde...
                    //Kosten bis zum Current + 1
                    var tempG = current.g + 1
                    var newPath = false;
                    if (openSet.includes(nachbar)) { //wenn der nachbar schon im openset ist...
                        if (tempG < nachbar.g) { //soll geguckt werden ob der G von dem Nachbar besser oder schlechter ist, falls er besser ist...
                            nachbar.g = tempG; // neuen Wert zuweisen (es wurde ein neuer Pfad zu dem Punkt gefunden!)
                            newPath = true;
                        } else {
                            newPath = false;
                        }
                    } else { //wenn der Nachbar noch nicht im openSet ist...
                        nachbar.g = tempG; //G setzen 
                        openSet.push(nachbar); //Nachbar in das openSet legen
                        newPath = true;
                    }
                    if (newPath) {
                        nachbar.h = heuristic(nachbar, end);
                        nachbar.f = nachbar.h + nachbar.g;
                        nachbar.pre = current;
                    }
                }
            }



        } else {
            //keine Lösung
        }
        path = [];
        var temp = current;
        path.push(temp);

        while (temp.pre) {
            path.push(temp.pre); //Dem Pfad wird dem Vorgänger von Temp übergeben(beim ersten mal ist das unser Current, also der letzte untersuchte)
            temp = temp.pre; //Der Vorgänger wird der neue Temp -> geht bis zum Anfang zurück
        }
        if (weg) {

            for (var i = 0; i < weg.length; i++) {
                weg[i].showPath("#6100C9");
            }
        }
        for (var i = 1; i < weg.length; i++) {
            if (!path.includes(weg[i])) {
                if (path.includes(weg[i - 1])) {
                    ctx.fillStyle = "crimson";
                    ctx.beginPath();
                    ctx.arc((weg[i - 1].x * scale) + (scale / 2), (weg[i - 1].y * scale) + (scale / 2), scale / 4, 0, 360);
                    ctx.fill();
                }
            } else {
                if (!path.includes(weg[i - 1])) {
                    ctx.fillStyle = "crimson";
                    ctx.beginPath();
                    ctx.arc((weg[i].x * scale) + (scale / 2), (weg[i].y * scale) + (scale / 2), scale / 4, 0, 360);
                    ctx.fill();
                }
            }
        }
        ctx.beginPath();
        ctx.strokeStyle = "Crimson";
        ctx.lineWidth = scale / 10;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.moveTo(path[0].x * scale + scale / 2, path[0].y * scale + scale / 2);
        for (var i = 0; i < path.length - 1; i++) {
            ctx.lineTo(path[i + 1].x * scale + scale / 2, path[i + 1].y * scale + scale / 2)
        }
        ctx.stroke();

        ctx.fillStyle = "green";
        ctx.fillRect(0 * scale + scale * 0.25, 0 * scale + scale * 0.25, scale - scale * 0.5, scale - scale * 0.5);

    } else {
        for (var i = 1; i < weg.length; i++) {
            if (!path.includes(weg[i])) {
                if (path.includes(weg[i - 1])) {
                    ctx.fillStyle = "crimson";
                    ctx.beginPath();
                    ctx.arc((weg[i - 1].x * scale) + (scale / 2), (weg[i - 1].y * scale) + (scale / 2), scale / 4, 0, 360);
                    ctx.fill();
                }
            } else {
                if (!path.includes(weg[i - 1])) {
                    ctx.fillStyle = "crimson";
                    ctx.beginPath();
                    ctx.arc((weg[i].x * scale) + (scale / 2), (weg[i].y * scale) + (scale / 2), scale / 4, 0, 360);
                    ctx.fill();
                }
            }
        }
        ctx.beginPath();
        ctx.strokeStyle = "Crimson";
        ctx.lineWidth = 10;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.moveTo(path[0].x * scale + scale / 2, path[0].y * scale + scale / 2);
        for (var i = 0; i < path.length - 1; i++) {
            ctx.lineTo(path[i + 1].x * scale + scale / 2, path[i + 1].y * scale + scale / 2)
        }
        ctx.stroke();

        ctx.fillStyle = "green";
        ctx.fillRect(0 * scale + scale * 0.25, 0 * scale + scale * 0.25, scale - scale * 0.5, scale - scale * 0.5);
        alreadyGeneratedPath = true;
        clearInterval(updateInteval);
        document.getElementById("startPath").disabled = true;
        document.getElementById("startPlay").disabled = false;
    }
}

//PATH
function remove(array, element) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] == element) {
            array.splice(i, 1);
        }
    }
}
function heuristic(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y)
    //return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}
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

//MAZE
function index(x, y) {
    if (x < 0 || y < 0 || x > columns - 1 || y > rows - 1) {
        return -1;
    }
    return x + y * columns;
}
function removeWalls(a, b) {
    var differenceX = a.x - b.x;
    if (differenceX == 1) {//bewegung von rechts nach links
        a.walls[1] = false; //links entfernen
        b.walls[0] = false; //rechts entfernen
    } else if (differenceX == -1) {//bewegung von links nach rechts
        a.walls[0] = false;//rechts entfernen
        b.walls[1] = false;//links entfernen
    }
    var differenceY = a.y - b.y;
    if (differenceY == -1) { //bewegung von oben nach unten
        a.walls[2] = false;
        b.walls[3] = false;
    } else if (differenceY == 1) { //bewegung von unten nach oben
        a.walls[3] = false;
        b.walls[2] = false;
    }
}