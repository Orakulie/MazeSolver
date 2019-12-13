const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


var speed = document.getElementById("speed").value;

//MAZE
var grid = [];
var current;
var stack = [1];
var next;
var alreadyGenerated = false;
//MAZE

//PATH
var openSet = [];
var closedSet = [];
var start;
var end;

var updateInteval;
var path = [];

document.getElementById("startPath").disabled = true;


function generate() {
    var speed = document.getElementById("speed").value;
if(alreadyGenerated == false)
{
    var felder = document.getElementById("felder").value;
    scale = Math.floor((canvas.height * canvas.width) / felder / 100);
    rows = Math.floor(canvas.height / scale);
    columns = Math.floor(canvas.width / scale);


    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            wall = new Wall(x, y);
            grid.push(wall);

        }
    }
    current = grid[0];


    start = grid[0];
    end = grid[grid.length - 1];
    openSet.push(start);


    for (var i = 0; i < grid.length; i++) {
        grid[i].addNeighbours();
    }
    updateInteval = setInterval(generateMaze, speed);
}else {
   var temp = document.getElementById("felder").value;
    window.location.reload(false); 
    document.getElementById("felder").value = temp;
}
}

function generateMaze() {
    if (stack.length != 0) {
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
        alreadyGenerated = true;
    }
}
function findPath() {
    var speed = document.getElementById("speed").value;
    updateInteval = setInterval(generatePath, speed);
}
function generatePath() {


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


            clearInterval(updateInteval);
            document.getElementById("startPath").disabled = true;
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
    var path = [];
    var temp = current;
    path.push(temp);

    while (temp.pre) {
        path.push(temp.pre); //Dem Pfad wird dem Vorgänger von Temp übergeben(beim ersten mal ist das unser Current, also der letzte untersuchte)
        temp = temp.pre; //Der Vorgänger wird der neue Temp -> geht bis zum Anfang zurück
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
    ctx.fillRect(0 * scale+scale*0.25, 0 * scale+scale*0.25, scale -scale*0.5, scale -scale*0.5);
}

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
//MAZE
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