const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Geschwindigkeit der Update Funktionen
var speed = 1;

disableButton("startPath", true);
disableButton("startPlay", true);
disableButton("startSurrender", true);

//Wenn bereits ein Wert für "felder" im Cache hinterlegt wurde, soll direkt mit dem Wert ein Maze generiert werden
if (localStorage["felder"]) {
    document.getElementById("felder").value = localStorage["felder"];
    generate();
}

//Start von der Maze Generation
function generate() {

    //deaktiviert den startMaze Button, damit nicht mehrere Mazes gleichzeitig generiert werden können
    disableButton("startMaze", false);
    //Wenn ein neues Maze generiert werden muss
    if (alreadyGenerated == false) {

        alreadyGenerated = true;
        //Maze größe wird anhand der Eingabe "Felder" skaliert
        felder = document.getElementById("felder").value;
        rows = columns = Math.floor(Math.sqrt(felder));
        scale = Math.floor(canvas.height / rows);
        canvas.width = columns * scale;
        canvas.height = rows * scale;

        //Grid wird generiert
        for (var y = 0; y < rows; y++) {//Jede Reihe
            for (var x = 0; x < columns; x++) {//Jede Zeile
                let wall = new Wall(x, y);//Neues Feld an X,Y wird erstellt und..
                grid.push(wall);//in das Grid Array gelegt

            }
        }

        //Erstes Zelle wird nach unten und nach rechts geöffnet
        current = grid[0];
        current.walls[0] = false;
        current.walls[2] = false;
        grid[index(0, 1)].walls[3] = false;
        grid[1].walls[1] = false;

        //Start Feld, oben links
        start = grid[0];
        last = start;
        //End Feld, unten rechts
        end = grid[grid.length - 1];

        //generateMaze wird jede Nanosekunde ausgeführt
        updateInteval = setInterval(generateMaze, speed);

    } else { //Wenn bereits ein Maze generiert wurde, soll die Seite neu geladen werden

        //Speichert die Anzahl der gewünschten Felder im Cache, damit direkt ein neues Maze generiert werden kann
        var temp = document.getElementById("felder").value;
        localStorage["felder"] = "" + temp;

        //Lädt die Seite neu
        window.location.reload(false);
    }
}

//Start von Spieler Steuerung
function play() {

    //Neuer Player wird erstellt
    player = new Player();

    //Wird ausgeführt wenn man eine Taste drückt
    document.addEventListener("keydown", (evt) => {
        keyPresses[evt.key] = true; //setzt die gedrückte Taste "true"
    });

    //Wird ausgeführt wenn man eine Taste loslässt
    document.addEventListener("keyup", (evt) => {
        keyPresses[evt.key] = false; //setzt die gedrückte Taste "false"
    });

    //Deaktiviert Path Button, damit man nicht den Weg generieren kann während man spielt
    disableButton("startPath", true);

    //Aktiviert den Aufgeben Button, damit man aufgeben kann
    disableButton("startSurrender", false);

    //Führt updatePlayer 10 mal in der Sekunde aus
    updateInteval = setInterval(updatePlayer, 1000 / 10);

}
//Aufgeben
function surrender() {

    //Stop die update Funktion vom Player
    clearInterval(updateInteval);

    //Zeichnet den gegangen Weg auf
    for (var i = 0; i < weg.length; i++) {
        weg[i].showPath("#6100C9");
    }
    //Makiert Start und End
    end.highlightColor("crimson");
    start.highlightColor("green");

    //Damit man den optimalen Weg generieren kann
    disableButton("startPath", false);
    disableButton("startSurrender", true);
    disableButton("startPlay", true);
}
//Start von Path
function findPath() {

    //Erstes zu betrachtende Feld soll start sein
    openSet.push(start);

    //Jedem Feld werden seine Nachbarn zugewiesen
    for (var i = 0; i < grid.length; i++) {
        grid[i].addNeighbours();
    }
    //Damit man während des Generierens nicht mehr spielen kann
    disableButton("startPlay", true);
    disableButton("startPath", true);

    //Startet update Funktion von Path
    updateInteval = setInterval(generatePath, speed);
}


//Funktion zum Berechnen des Index eines Grids, anhand der X und Y position
function index(x, y) {
    if (x < 0 || y < 0 || x > columns - 1 || y > rows - 1) {
        return -1;
    }
    return x + y * columns;
}

//Funktion zum deaktivieren eines Buttons
function disableButton(button, x) {
    document.getElementById(button).disabled = x;
}