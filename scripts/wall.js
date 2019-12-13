function Wall(x, y) {
    this.x = x;
    this.y = y;  //r     l     u     o
    this.walls = [true, true, true, true];
    this.visited = false;

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.pathNeighbors = [];

    this.pre = undefined


    this.highlight = function () {
        ctx.fillStyle = "green ";
        ctx.fillRect(x * scale+scale*0.25, y * scale+scale*0.25, scale -scale*0.5, scale -scale*0.5);
    }
    this.show = function () {
        var x = this.x * scale;
        var y = this.y * scale;


        if (this.visited) {
            ctx.fillStyle = "purple";
            ctx.fillRect(x, y, scale, scale);
        }
        if (this.visited && this.x == grid[grid.length - 1].x && this.y == grid[grid.length - 1].y) {
            ctx.fillStyle = "Crimson";
            ctx.fillRect(x+scale*0.25, y+scale*0.25, scale-scale*0.5, scale-scale*0.5);
        }
        ctx.strokeStyle = "black";

        //RECHTS
        if (this.walls[0]) {
            ctx.lineWidth = scale / 50;
            ctx.beginPath();
            ctx.moveTo(x + scale, y);
            ctx.lineTo(x + scale, y + scale);
            ctx.stroke();
        }
        //LINKS
        if (this.walls[1]) {
            ctx.beginPath();
            ctx.lineWidth = scale / 50;
            ctx.moveTo(x, y + scale);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        //UNTEN
        if (this.walls[2]) {
            ctx.beginPath();
            ctx.lineWidth = scale / 50;
            ctx.moveTo(x + scale, y + scale);
            ctx.lineTo(x, y + scale);
            ctx.stroke();
        }
        //OBEN
        if (this.walls[3]) {
            ctx.beginPath();
            ctx.lineWidth = scale / 50;
            ctx.moveTo(x, y);
            ctx.lineTo(x + scale, y);
            ctx.stroke();
        }
    }
    this.checkNeighbours = function () {
        var neighbors = [];

        var top = grid[index(this.x, this.y - 1)];
        var bottom = grid[index(this.x, this.y + 1)];
        var right = grid[index(this.x + 1, this.y)];
        var left = grid[index(this.x - 1, this.y)];

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

        if (neighbors.length > 0) {
            var r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined;
        }

    }

    this.showPath = function (c) {
        var x = this.x * scale;
        var y = this.y * scale;
        ctx.fillStyle = c;
        ctx.fillRect(x,y,scale,scale);
        if (this.walls[0]) {
            ctx.lineWidth = scale / 50;
            ctx.beginPath();
            ctx.moveTo(x + scale, y);
            ctx.lineTo(x + scale, y + scale);
            ctx.stroke();
        }
        //LINKS
        if (this.walls[1]) {
            ctx.beginPath();
            ctx.lineWidth = scale / 50;
            ctx.moveTo(x, y + scale);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        //UNTEN
        if (this.walls[2]) {
            ctx.beginPath();
            ctx.lineWidth = scale / 50;
            ctx.moveTo(x + scale, y + scale);
            ctx.lineTo(x, y + scale);
            ctx.stroke();
        }
        //OBEN
        if (this.walls[3]) {
            ctx.beginPath();
            ctx.lineWidth = scale / 50;
            ctx.moveTo(x, y);
            ctx.lineTo(x + scale, y);
            ctx.stroke();
        }
    }

    this.addNeighbours = function () {
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