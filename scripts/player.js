function Player() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;



    //Weg
    weg = [grid[0]];
    this.timesMoved = 1;



    this.show = function () {
        var x = this.x * scale;
        var y = this.y * scale;

        ctx.fillStyle = "yellow";
        /* ctx.beginPath();
        ctx.arc(this.x+0.5*scale,this.y+0.5*scale,scale/4,0,360);
        ctx.fill(); */
        //ctx.fillRect(this.x + 0.25 * scale, this.y + 0.25 * scale, scale / 2, scale / 2);
        ctx.fillRect(x + scale * 0.25, y + scale * 0.25, scale / 2, scale / 2);
    }
    this.update = function () {
        var i = index(this.x, this.y);

        /* if (!grid[i].walls[0]) {//NACH RECHTS
            if (this.xSpeed > 0) {
                this.x += this.xSpeed;
                if (!weg.includes(grid[i])) {
                    weg.push(grid[i]);
                }
            }
        }
        if (!grid[i].walls[1]) {//NACH LINKS
            if (this.xSpeed < 0) {
                this.x += this.xSpeed;
                if (!weg.includes(grid[i])) {
                    weg.push(grid[i]);
                }
            }
        }
        if (!grid[i].walls[2]) { //NACH UNTEN
            if (this.ySpeed > 0) {
                this.y += this.ySpeed;
                if (!weg.includes(grid[i])) {
                    weg.push(grid[i]);
                }
            }
        }
        if (!grid[i].walls[3]) { //NACH OBEN
            if (this.ySpeed < 0) {
                this.y += this.ySpeed;
                if (!weg.includes(grid[i])) {
                    weg.push(grid[i]);
                }
            }
        } */
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
/*     this.changeDirection = function (dir) {
        switch (dir) {
            case "w":
                this.xSpeed = 0;
                this.ySpeed = -1;
                break;
            case "s":
                this.xSpeed = 0;
                this.ySpeed = 1;
                break;
            case "d":
                this.xSpeed = 1;
                this.ySpeed = 0;
                break;
            case "a":
                this.xSpeed = -1;
                this.ySpeed = 0;
                break;
        }
    } */
    this.stop = function () {
        this.xSpeed = 0;
        this.ySpeed = 0;
    }


}