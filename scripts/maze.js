//Grid Array das aus allen Feldern besteht
var grid = [];

//Das aktuell zu berechnende Feld
var current;

var last;

//Der Stack, der dazu dient den Weg zurückzufinden
var stack = [1];

//Das nächste zu untersuchende Feld
var next;

//Ob bereits ein Maze generiert wurde
var alreadyGenerated = false;

//Fügt dem Maze kreuzungen hinzu
var kreuzung = 0;

//Anzahl der Felder die generiert werden sollen
var felder;

//Update function, die jede Nanosekunde ausgeführt wird
function generateMaze() {

    //Solange der Stack nicht 0 ist...
    if (stack.length != 0) {
        //Das zu berechnende Feld wird als bereits besucht makiert
        current.visited = true;
       // current.highlightColor("green");
        
       last.show();
        //Das nächste Feld ist ein zufälliger Nachbar
        next = current.checkNeighbours();

        //Falls noch ein Nachbar exestiert...
        if (next) {

            //Makiert Next als besucht
            next.visited = true;

            //Dem Stack wird das aktuelle Feld zugewiesen
            stack.push(current);

            //Die Wände zwischen dem aktuellem und nächstem Feld werden entfernt
            removeWalls(current, next);
            //Der Nachbar wird das aktuelle Feld
            last = current;
            current = next;

        } else if (stack.length > 0) { //Falls kein Nachbar exestiert..

            //Das zu betrachtende Feld soll das letzte Feld aus dem Stack werden
            current = stack.pop();
            
        }
    } else { //Wenn der Stack leer ist, wurde das Maze komplett generiert und dann..

        //Stoppt updateFunktion von dem Maze
        clearInterval(updateInteval);

        //Damit man Spielen oder den Weg generieren kann
        disableButton("startPath", false);
        disableButton("startPlay", false);

        //Ändert den Text des Generieren Buttons für das Maze zu "Neues Maze", falls man ein neues Maze generieren möchte
        document.getElementById("startMaze").innerHTML = "Neues Maze";

        //Setzt alreadyGenerated auf "true", damit beim nächstem Klick ein neues Maze generiert wird

        //Es werden (felder/15) Kreuzungen generiert
        for (var y = 0; y < parseInt(felder) / 7; y++) {
            //Wählt ein zufälliges Feld aus
            let i = Math.floor(Math.random() * (grid.length - 1));

            //Zufälliger Nachbar wird ausgewähtl und Wand entfernt
            let z = Math.floor(Math.random() * 4);
            switch (z) {
                case 0:
                    removeWalls(grid[i], grid[index(grid[i].x + 1, grid[i].y)]) //RECHTS
                    break;
                case 1:
                    removeWalls(grid[i], grid[index(grid[i].x, grid[i].y + 1)]) //UNTEN
                    break;
                case 2:
                    removeWalls(grid[i], grid[index(grid[i].x - 1, grid[i].y)]) //LINKS
                    break;
                case 3:
                    removeWalls(grid[i], grid[index(grid[i].x, grid[i].y - 1)]) //OBEN
                    break;

            }


        }
        start.highlightColor("green");
        end.highlightColor("crimson");
    }
}





//MAZE
function removeWalls(a, b) {
    //Wenn b existiert
    if (b) {
        //Berechne wie b und a zu einander stehen und entfernt dementsprechend die wände
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

        //Zeigt die neuen Wände
        a.show();
        b.show();

        //highlight current
        if(document.getElementById("startPath").disabled == true) {
            a.highlightColor("green");
        }
    }
}