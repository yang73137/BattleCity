var Graph = ClassFactory.createClass("Graph", null, {
    context: null,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    image: null,
    children: [],
    draw: function () {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].deleted) {
                this.remove(this.children[i]);
                break;
            }
            else {
                this.children[i].draw();
            }
        }
    },
    add: function (graph) {
        if (graph.draw && graph.draw.constructor == Function) {
            graph.context = this.context;
            this.children.push(graph);
        }
    },
    remove: function (graph) {
        var i = 0;
        for (; i < this.children.length; i++) {
            if (this.children[i] == graph) {
                break;
            }
        }
        this.children.splice(i, 1);
    },
    getChild: function (index) {
        if (index < 0 || index > this.children.length) {
            alert("Out of Range");
        }
        return this.children[index];
    },
    clear: function () {
        this.context.clearRect(this.x, this.y, this.width, this.height);
    },
    deleted: false
});

var Mover = ClassFactory.createClass("Mover", Graph, {
    stage: null,
    speed: 0,
    direction: null,
    move: common.noop,
    draw: common.noop,
    hit: function () {
        var stage = this.stage;
        var direction = this.direction;
        var other = null;
        for (var i = 0; i < stage.children.length; i++) {
            var graph = stage.children[i];
            if (this == graph) {
                continue;
            }
            if (direction == common.direction.up) {
                if (this.y > (graph.y + graph.height) && this.y < (graph.y + graph.height + 10)) {
                    if ((this.x + this.width > graph.x) && (this.x + this.width <= graph.x + graph.width)) {
                        other = graph;
                        break;
                    }
                    if (this.x >= graph.x && (this.x <= graph.x + graph.width)) {
                        other = graph;
                        break;
                    }
                    if (this.x <= graph.x && (this.x + this.width >= graph.x + graph.width)) {
                        other = graph;
                        break;
                    }
                    if (this.x >= graph.x && (this.x + this.width <= graph.x + graph.width)) {
                        other = graph;
                        break;
                    }
                }
            }
            else if (direction == common.direction.down) {
                if ((this.y + this.height < graph.y) && (this.y + this.height > graph.y - 10)) {
                    if ((this.x + this.width > graph.x) && (this.x + this.width <= graph.x + graph.width)) {
                        other = graph;
                        break;
                    }
                    if (this.x >= graph.x && (this.x <= graph.x + graph.width)) {
                        other = graph;
                        break;
                    }
                    if (this.x <= graph.x && (this.x + this.width >= graph.x + graph.width)) {
                        other = graph;
                        break;
                    }
                    if (this.x >= graph.x && (this.x + this.width <= graph.x + graph.width)) {
                        other = graph;
                        break;
                    }
                }
            }
            else if (direction == common.direction.left) {
                if ((this.x > graph.x + graph.width) && (this.x < graph.x + graph.width + 10)) {
                    if ((this.y + this.height > graph.y) && (this.y + this.height <= graph.y + graph.height)) {
                        other = graph;
                        break;
                    }
                    if (this.y >= graph.y && (this.y <= graph.y + graph.height)) {
                        other = graph;
                        break;
                    }
                    if (this.y <= graph.y && (this.y + this.height >= graph.y + graph.height)) {
                        other = graph;
                        break;
                    }
                    if (this.y >= graph.y && (this.y + this.height <= graph.y + graph.height)) {
                        other = graph;
                        break;
                    }
                }
            }
            else if (direction == common.direction.right) {
                if ((this.x + this.width < graph.x) && (this.x + this.width > graph.x - 10)) {
                    if ((this.y + this.height > graph.y) && (this.y + this.height <= graph.y + graph.height)) {
                        other = graph;
                        break;
                    }
                    if (this.y >= graph.y && (this.y <= graph.y + graph.height)) {
                        other = graph;
                        break;
                    }
                    if (this.y <= graph.y && (this.y + this.height >= graph.y + graph.height)) {
                        other = graph;
                        break;
                    }
                    if (this.y >= graph.y && (this.y + this.height <= graph.y + graph.height)) {
                        other = graph;
                        break;
                    }
                }
            }
        }
        return other;
    }
});

var Fixed = ClassFactory.createClass("Fixed", Graph, {
    xCount: 0,
    yCount: 0,
    smallWidth: 0,
    smallHeight: 0,
    draw: function () {
        var fixed = this;
        var image = new Image();
        image.src = fixed.image;
        image.onload = function() {
            for (var i = 0; i < fixed.xCount; i++) {
                for (var j = 0; j < fixed.yCount; j++) {
                    fixed.context.drawImage(image, fixed.x + i * fixed.smallWidth, fixed.y + j * fixed.smallHeight, fixed.smallWidth, fixed.smallHeight);
                }
            }
            image = null;
        };
    }
});

var Missile = ClassFactory.createClass("Missile", Mover, {
    width: 17,
    height: 17,
    shootLength: 200,
    moveLength: 0,
    speed: 6,
    shooting: false,
    tank: null,
    shoot: function () {
        var missile = this;
        var tank = missile.tank;
        missile.deleted = false;
        if (missile.shooting) {
            return;
        }

        switch (tank.direction) {
            case common.direction.up:
                missile.x = tank.x + Math.ceil((tank.width - missile.width) / 2);
                missile.y = tank.y - missile.height;
                missile.direction = common.direction.up;
                missile.move = function () {
                    this.y -= this.speed;
                };
                break;
            case common.direction.down:
                missile.x = tank.x + Math.ceil((tank.width - missile.width) / 2);
                missile.y = tank.y + tank.height;
                missile.direction = common.direction.down;
                missile.move = function () {
                    this.y += this.speed;
                };
                break;
            case common.direction.left:
                missile.x = tank.x - missile.width;
                missile.y = tank.y + Math.ceil((tank.height - missile.height) / 2);
                missile.direction = common.direction.left;
                missile.move = function () {
                    this.x -= this.speed;
                };
                break;
            case common.direction.right:
                missile.x = tank.x + tank.width;
                missile.y = tank.y + Math.ceil((tank.height - missile.height) / 2);
                missile.direction = common.direction.right;
                missile.move = function () {
                    this.x += this.speed;
                };
                break;
            default:
                break;
        }

        tank.stage.add(missile);
        missile.shooting = true;
    },
    draw: function () {
        var missile = this;
        missile.clear();
        missile.move();
        missile.moveLength += missile.speed;
        if (missile.moveLength <= missile.shootLength) {
            var hit = missile.hit();
            if (hit) {
                hit.deleted = true;
                missile.deleted = true;
                missile.shooting = false;
                missile.moveLength = 0;
                return;
            }

            var image = new Image();
            image.src = missile.image;
            image.onload = function () {
                missile.context.drawImage(image, missile.x, missile.y, missile.width, missile.height);
                image = null;
            };
        }
        else {
            missile.deleted = true;
            missile.shooting = false;
            missile.moveLength = 0;
        }
    },
    clone: function () {
        var newMissile = Missile.createNew();
        common.extend(true, newMissile, this);
        return newMissile;
    }
});

var Tank = ClassFactory.createClass("Tank", Mover, {
    step: 0,
    type: "",
    missile: Missile.createNew({
        image: "Images/enemymissile.png"
    }),
    imageDictionary: { up: "", down: "", left: "", right: "" },
    setMissile: function (missile) {
        missile.tank = this;
        missile.context = this.context;
        missile.stage = this.stage;
        this.missile = missile;
    },
    shoot: function () {
        this.missile.shoot();
    },
    moveRandom: function () {
        var random = Math.round(Math.random() * 3);
        var nextDirection = ["up", "down", "left", "right"][random];
        var dict = { up: "moveUp", down: "moveDown", left: "moveLeft", right: "moveRight" };
        if (!this.direction) {
            this.direction = nextDirection;
            ++this.step;
            this[dict[this.direction]]();
        }
        else {
            if (++this.step == 15) {
                this.direction = nextDirection;
                this.step = 0;
                if (Math.random() * 100 > 50) {
                    if (Math.random() * 100 > 50) {
                        this.shoot();
                    }
                }
            }
            this[dict[this.direction]]();
        }
    },
    moveUp: function () {
        this.move = function () {
            this.direction = common.direction.up;
            var hit = this.hit();
            if (!hit) {
                this.y -= this.image == this.imageDictionary.up ? this.speed : 0;
                this.y = this.y <= 0 ? 0 : this.y;
            }
            this.image = this.imageDictionary.up;
        }
    },
    moveDown: function () {
        this.move = function () {
            this.direction = common.direction.down;
            var hit = this.hit();
            if (!hit) {
                this.y += this.image == this.imageDictionary.down ? this.speed : 0;
                this.y = (this.y + this.height >= this.stage.height) ? (this.stage.height - this.height) : this.y;
            }
            this.image = this.imageDictionary.down;
        }
    },
    moveLeft: function () {
        this.move = function () {
            this.direction = common.direction.left;
            var hit = this.hit();
            if (!hit) {
                this.x -= this.image == this.imageDictionary.left ? this.speed : 0;
                this.x = this.x <= 0 ? 0 : this.x;
            }
            this.image = this.imageDictionary.left;
        }
    },
    moveRight: function () {
        this.move = function () {
            this.direction = common.direction.right;
            var hit = this.hit();
            if (!hit) {
                this.x += this.image == this.imageDictionary.right ? this.speed : 0;
                this.x = (this.x + this.width) >= this.stage.width ? (this.stage.width - this.width) : this.x;
            }
            this.image = this.imageDictionary.right;
        }
    },
    draw: function () {
        var tank = this;
        tank.clear();
        if (tank.deleted) {
            return;
        }
        if (tank.move != common.noop) {
            tank.move();
            tank.move = common.noop;
        }
        var image = new Image();
        image.src = tank.imageDictionary[tank.direction];
        image.onload = function () {
            if (!tank.deleted) {
                tank.context.drawImage(image, tank.x, tank.y, tank.width, tank.height);
            }
            image = null;
        };
    },
    clone: function () {
        var newTank = Tank.createNew();
        common.extend(true, newTank, this);
        return newTank;
    },
    destory: function () {
        this.deleted = true;
    },
    stop: function () {
        this.move = common.noop();
    }
});

var Stage = ClassFactory.createClass("Stage", Graph, {
    context: context,
    player: null,
    enemies: [],
    addEnemy: function (enemy) {
        this.add(enemy);
        this.enemies.push(enemy);
        enemy.stage = this;
    },
    removeEnemy: function (enemy) {
        var i = 0;
        for (; i < this.enemies.length; i++) {
            if (this.enemies[i] == enemy) {
                break;
            }
        }
        this.enemies.splice(i, 1);
    },
    setPlayer: function (player) {
        this.add(player);
        this.player = player;
        player.stage = this;
    },
    start: function () {
        this.draw();
        var stage = this;
        $(document).on("keydown", function (e) {
            switch (e.which) {
                case 32:
                    stage.player.shoot();
                    break;
                case 37:
                    stage.player.moveLeft();
                    break;
                case 38:
                    stage.player.moveUp();
                    break;
                case 39:
                    stage.player.moveRight();
                    break;
                case 40:
                    stage.player.moveDown();
                    break;
                default:
                    break;
            }
            return false;
        });

        var fps = 1000 / 30;
        var timer = setInterval(function () {
            for (var i = 0; i < stage.enemies.length; i++) {
                stage.enemies[i].moveRandom();
            }
            for (var i = 0; i < stage.children.length; i++) {
                stage.children[i].draw();
            }
            var newArr = [];
            for (var i = 0; i < stage.children.length; i++) {
                if (!stage.children[i].deleted) {
                    newArr.push(stage.children[i]);
                }
                else {
                    stage.removeEnemy(stage.children[i]);
                }
            }
            stage.children = newArr;

            if (stage.enemies.length == 0) {
                clearInterval(timer);
                alert("胜利");
            }

        }, fps);
    }
});