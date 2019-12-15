function Wall(x, y) {

    //X Position ohne Scale
    this.x = x;

    //Y Position ohne Scale
    this.y = y;

    //Wände des Feldes : r     l     u     o
    this.walls = [true, true, true, true];

    //Ob das Feld bereits berechnet wurde oder nicht
    this.visited = false;

    //Für die Berechnung des A* Algorithmus
    this.f = 0; //G+H addiert
    this.g = 0; //Kosten bis zu this.Feld vom Start
    this.h = 0; //heuristischer Wert, der die Distanz zum End schätzt

    //Nachbarn vom Feld
    this.pathNeighbors = [];

    //Optimales Feld vor dem jetztigem (für den A* Algorithmus)
    this.pre = undefined


    //Zeichnet die Wände des Feldes
    this.drawWalls = function () {

        //Passt die X und Y Werte an den Scale an
        var x = this.x * scale;
        var y = this.y * scale;

        ctx.strokeStyle = "black";

        if (this.visited) {
            //RECHTS
            if (this.walls[0]) {
                ctx.beginPath();
                ctx.moveTo(x + scale, y);
                ctx.lineTo(x + scale, y + scale);
                ctx.stroke();
            }
            //LINKS
            if (this.walls[1]) {
                ctx.beginPath();
                ctx.moveTo(x, y + scale);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            //UNTEN
            if (this.walls[2]) {
                ctx.beginPath();
                ctx.moveTo(x + scale, y + scale);
                ctx.lineTo(x, y + scale);
                ctx.stroke();
            }
            //OBEN
            if (this.walls[3]) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + scale, y);
                ctx.stroke();
            }
        }
    }

    //Makiert das aktuelle Feld mit einem kleinem Quadrat
    this.highlightColor = function (c) {

        //Passt X und Y an den Scale an
        var x = this.x * scale;
        var y = this.y * scale;

        //Passt die LineWidth an den Scale an
        ctx.lineWidth = Math.floor(scale / 50) + 1;

        //fillStyle = gewünschte Farbe
        ctx.fillStyle = c;

        //Zeichnet ein Quadrat an X*scale und Y*scale
        ctx.fillRect(x + scale * 0.25, y + scale * 0.25, scale - scale * 0.5, scale - scale * 0.5);
    }

    //Zeigt die bereits generierten Felder
    this.show = function () {

        //Wenn das aktuelle Feld schon berechnet wurde
        if (this.visited) {
            this.showPath("brown");//Makiert es Braun
        }
    }

    //Guckt sich die Nachbarn des Feldes an und gibt ein Zufälliges zurück
    this.checkNeighbours = function () {

        //Array für die Nachbarn, die noch nicht berechnet wurden
        var neighbors = [];

        //Berechnet die Nachbarn anhand der aktuell X und Y position
        var top = grid[index(this.x, this.y - 1)];
        var bottom = grid[index(this.x, this.y + 1)];
        var right = grid[index(this.x + 1, this.y)];
        var left = grid[index(this.x - 1, this.y)];

        //Prüft ob es den Nachbarn gibt und ob sie bereits berechnet wurden
        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }
        if (right && !right.visited) {
            neighbors.push(right);
        }
        if (left && !left.visited) {
            neighbors.push(left);
        }

        //Wenn das Feld mindestens einen Nachbarn hat
        if (neighbors.length > 0) {

            //Wählt einen zufälligen Nachbarn aus und...
            var r = Math.floor(Math.random() * neighbors.length);

            //Returned diesen
            return neighbors[r];
        } else {
            //Wenn das Feld keine zu berechnenden Nachbarn mehr hat return "undefined"
            return undefined;
        }

    }

    //Visualisiert das Feld mit der Farbe "c"
    this.showPath = function (c) {
        //Passt X, Y und lineWidth an den Scale an
        var x = this.x * scale;
        var y = this.y * scale;
        ctx.lineWidth = Math.floor(scale / 50) + 1;

        //Zeichnet das Quadrat
        ctx.fillStyle = c;
        ctx.fillRect(x, y, scale, scale);

        //Zeichnet die Wände erneut
        this.drawWalls();
    }

    //Fügt dem Array pathNeighbors alle Nachbarn hinzu
    this.addNeighbours = function () {

        //Berechnet die Nachbarn anhand der X und Y Position
        var top = grid[index(this.x, this.y - 1)];
        var bottom = grid[index(this.x, this.y + 1)];
        var right = grid[index(this.x + 1, this.y)];
        var left = grid[index(this.x - 1, this.y)];

        
        if (top) {
            this.pathNeighbors.push(top);
        }
        if (bottom) {
            this.pathNeighbors.push(bottom);
        }
        if (right) {
            this.pathNeighbors.push(right);
        }
        if (left) {
            this.pathNeighbors.push(left);
        }

    }

}