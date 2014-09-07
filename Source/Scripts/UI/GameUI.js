GameState = {
    None: 0,
    SelectStage: 1,
    ShowStage: 2,
    Gaming: 3,
    Calculating: 4,
    GameOver: 5,
};

GameUI = ClassFactory.createClass(UIBase, {
    init: function () {
        UIBase.init.call(this);

        this.state = GameState.None;
        this.stage = 1;
        this.maxStage = 35;

        // 玩家
        this.player = new PlayerTank(0);

        // 块
        this.block32x32 = [];
        this.block16x16 = [];

        // 坦克数组
        this.tanks = [];

        // 坦克类型数组
        this.tankTypes = [0, 0, 0, 0, 1, 2, 0, 1, 2, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 3];
        this.bonusArr = [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0];

        // 新建坦克索引
        this.birthIndex = 0;
        this.maxTank = 5;

        // 动态块
        this.animateBlocks = [];

        this.endCounter = new Counter(120, false, true);

        this.setSize(Const.SCREEN_WIDTH, Const.SCREEN_HEIGHT);
        this.setBackground("#7F7F7F");
        this.setPosition(0, 0);


        // 游戏区域
        this.gameArea = new Layer();
        this.gameArea.setSize(416, 416);
        this.gameArea.setPosition(30, (Const.SCREEN_HEIGHT - 416) / 2);
        this.gameArea.setBackground("#000000");
        this.gameArea.show();
        this.append(this.gameArea);

        // 暂停
        this.pauseCounter = new Counter(15, false, true);
        this.pauseCounter.setEnabled(false);
        this.pauseLabel = new Label("PAUSE");
        this.pauseLabel.setColor("#E05000");
        this.pauseLabel.moveTo(196, 220);
        this.pauseLabel.hide();
        this.append(this.pauseLabel);
        

        // 状态
        this.statusArea = new Layer();
        this.statusArea.setSize(64, 448);
        this.statusArea.setPosition(450, 0);
        this.statusArea.show();
        this.append(this.statusArea);

        // 剩余坦克
        this.leftTankLayer = new Layer();
        this.leftTankLayer.setSize(32, 159);
        this.leftTankLayer.setPosition(15, 30);
        for (var i = 0; i < this.tankTypes.length; i++) {
            var layer = new Layer();
            layer.setBackground("url(" + Const.IMAGE_MISC.src + ") no-repeat 0px -16px");
            layer.setSize(16, 16);
            layer.setPosition(i % 2 * 16, parseInt(i / 2) * 16);
            layer.show();
            this.leftTankLayer.append(layer);
        }
        this.leftTankLayer.show();
        this.statusArea.append(this.leftTankLayer);

        // 玩家生命
        this.playerLabel = this.lifeLabel = new Label("IP");
        this.playerLabel.setColor("#000");
        this.playerLabel.setCSS({ font: "22px 'Arial Black'" });
        this.playerLabel.setPosition(15, 240);
        this.playerLabel.show();
        this.statusArea.append(this.playerLabel);

        this.lifeLayer = new Layer();
        this.lifeLayer.setSize(18, 18);
        this.lifeLayer.setPosition(15, 270);
        this.lifeLayer.setBackground("url(" + Const.IMAGE_MISC.src + ") no-repeat -14px -18px");
        this.lifeLayer.show();
        this.statusArea.append(this.lifeLayer);

        this.lifeLabel = new Label("");
        this.lifeLabel.setColor("#000");
        this.lifeLabel.setCSS({ font: "19px 'Arial Black'" });
        this.lifeLabel.setPosition(35, 263);
        this.lifeLabel.show();
        this.statusArea.append(this.lifeLabel);

        this.baseDestoryed = false;
        this.baseProofCounter = new Counter(300, false, true);
        this.baseProofCounter.setEnabled(false);
        
        // 旗子
        this.flagLayer = new Layer();
        this.flagLayer.setSize(32, 32);
        this.flagLayer.setPosition(15, 350);
        this.flagLayer.setBackground("url(" + Const.IMAGE_MISC.src + ") no-repeat -128px -0px");
        this.flagLayer.show();
        this.statusArea.append(this.flagLayer);
        
        this.flagLabel = new Label();
        this.flagLabel.setColor("#000");
        this.flagLabel.setCSS({ font: "19px 'Arial Black'" });
        this.flagLabel.setPosition(35, 375);
        this.flagLabel.show();
        this.statusArea.append(this.flagLabel);

        // 基地爆炸
        this.bomb = new Bomb(true);
        this.bombCounter = new Counter(30, false, false);

        // 显示关数
        this.stageLayer = new Layer();
        this.stageLayer.setSize(this.width, this.height);
        this.stageLayer.setPosition(0, 0);
        this.stageLayer.setZ(9999);
        this.stageLayer.setBackground("rgb(102,102,102)");

        this.stageLabel = new Label();
        this.stageLabel.setColor("#000");
        this.stageLabel.setSize(150, 30);
        this.stageLabel.moveTo((this.width - this.stageLabel.width) / 2, (this.height - this.stageLabel.height) / 2);
        this.stageLabel.show();
        this.stageLayer.append(this.stageLabel);
        
        // GameOver
        this.gameOverLabel = new Label();
        this.gameOverLabel.setHTML("GAME<br/>OVER");
        this.gameOverLabel.setSize(72, this.height);
        this.gameOverLabel.setPosition(208, this.height);
        this.gameOverLabel.setZ(Const.Z_UI);
        this.gameOverLabel.setColor("#E05000");
        this.gameOverLabel.hide();
        this.append(this.gameOverLabel);

        this.append(this.stageLayer);
        this.stageCounter = new Counter(120, false, true);

        this.bonus = new Bonus();

        this.setPosition(0, 0);
        
        this.stopCounter = new Counter(0, false, true);
        this.enemyBirthCounter = new Counter(120, true, true);
    },
    onEnter: function () {
        this.player.life = 3;
        this.player.setType(0);
        this.birthIndex = 0;
        this.state = GameState.SelectStage;
        this.setStage(1);
        this.show();
    },
    onLevel: function () {
        this.hide();
    },
    onUpdate: function () {

        switch (this.state) {
            case GameState.SelectStage:
                this.stageLayer.show();
                if (Input.isPressed(InputAction.GAME_A)) {
                    this.setStage(++this.stage);
                }
                if (Input.isPressed(InputAction.GAME_B)) {
                    this.setStage(--this.stage);
                }
                if (Input.isPressed(InputAction.START)) {
                    this.stageLayer.hide();
                    this.moveToStage(this.stage);
                    this.state = GameState.Gaming;
                }
                return true;
            case GameState.ShowStage:
                this.stageLayer.show();
                if (!this.stageCounter.countdown()) {
                    this.stageLayer.hide();
                    this.stageCounter.setEnabled(false);
                    this.state = GameState.Gaming;
                }
                return true;
            case GameState.Gaming:
                
                this.gameArea.show();
                this.bonus.update();
                
                if (this.stopCounter.enabled && !this.stopCounter.countdown()) {
                    this.stopCounter.setEnabled(false);
                }
                
                for (var i = 0; i < this.animateBlocks.length; i++) {
                    this.animateBlocks[i].update();
                }

                if (this.baseProofCounter.enabled) {
                    if (!this.baseProofCounter.countdown()) {
                        this.baseProofCounter.setEnabled(false);
                        this.clearBaseProof();
                    }
                }

                if (Input.isPressed(17) && Input.isPressed(77)) {
                    this.cheat();
                }
                
                if (Input.isPressed(InputAction.START)) {
                    this.pauseCounter.setEnabled(!this.pauseCounter.enabled);
                }
                
                if (this.pauseCounter.enabled) {
                    if (!this.pauseCounter.countdown()) {
                        this.pauseLabel.setVisible(!this.pauseLabel.visible);
                    }
                    return true;
                }
                else {
                    this.pauseLabel.hide();
                }

                if (this.player.state == TankState.NONE) {
                    if (this.player.life > 1) {
                        this.player.birth(128, 384, 0, Const.DIRECTION_UP);
                    }

                    this.player.life--;

                    if (this.player.life >= 1) {
                        this.lifeLabel.setText(this.player.life - 1);
                    }
                }

                var over = this.birthIndex == this.tankTypes.length;
                var liveTanks = 0;
                for (var i = 0; i < this.tanks.length; i++) {
                    var tank = this.tanks[i];
                    if (tank != this.player && tank.state != TankState.NONE) {
                        over = false;
                        liveTanks++;
                    }
                    this.tanks[i].update();
                }

                if (!over && liveTanks < 4 && this.birthIndex < this.tankTypes.length) {
                    var x = 192 * ((this.birthIndex + 1) % 3);
                    if (!this.enemyBirthCounter.countdown()) {
                        var newTank = new EnemyTank(1);
                        newTank.setBonus(!!(this.bonusArr[this.birthIndex]));
                        newTank.birth(x, 0, this.tankTypes[this.birthIndex], Const.DIRECTION_DOWN);
                        newTank.addToGameUI(this);
                        this.birthIndex++;
                        this.tanks.push(newTank);
                        this.updateLeftTank();
                    }
                }

                if (this.baseDestoryed) {
                    this.bomb.update();
                }

                if (this.player.life <= 0 || this.baseDestoryed) {
                    this.gameOverLabel.show();
                    if (this.gameOverLabel.y > 180) {
                        this.gameOverLabel.moveBy(0, -2);
                    } else {
                        this.player.life = 3;
                        this.player.setType(0);
                        return false;
                    }
                }

                if (over && !this.endCounter.countdown() ) {
                    this.moveToStage(++this.stage);
                    this.state = GameState.ShowStage;
                }
                return true;
        }
        
        return true;
    },
    updateLeftTank: function () {
        for (var i = this.tankTypes.length; i > this.tankTypes.length - this.birthIndex; i--) {
            this.leftTankLayer.div.childNodes[i - 1].style.display = "none";
        }
    },
    createMap: function (stage) {

        this.clearBlock();

        var map = window["map" + stage];

        map += "6,12,6,15|";
        map += "5,11,1,8|";
        map += "5,12,1,10|";
        map += "6,11,1,12|";
        map += "7,11,1,4|";
        map += "7,12,1,5";

        var matrix = map.split("|");
        for (var i = 0; i < matrix.length; i++) {
            var arr = matrix[i].split(",");

            var x = +arr[0];
            var y = +arr[1];
            var typeId = +arr[2];
            var area = +arr[3];

            var block = new Block(typeId, 32 * x, 32 * y, area);

            block.addToGameUI(this);
            this.block32x32[x][y] = block;

            if ((area & 1) == 1) {
                this.block16x16[x * 2][y * 2] = { block: block, typeId: typeId, areaIndex: 0 };
            }
            if ((area & 2) == 2) {
                this.block16x16[x * 2 + 1][y * 2] = { block: block, typeId: typeId, areaIndex: 1 };
            }
            if ((area & 4) == 4) {
                this.block16x16[x * 2][y * 2 + 1] = { block: block, typeId: typeId, areaIndex: 2 };
            }
            if ((area & 8) == 8) {
                this.block16x16[x * 2 + 1][y * 2 + 1] = { block: block, typeId: typeId, areaIndex: 3 };
            }

            if (typeId == BlockTypeId.Water) {
                this.animateBlocks.push(block);
            }
        }
    },
    clearBlock: function () {

        this.animateBlocks = [];

        for (var x = 0; x < 13; x++) {
            this.block32x32[x] = [];
            for (var y = 0; y < 13; y++) {
                this.block32x32[x][y] = null;
            }
        }

        for (var x = 0; x < 26; x++) {
            this.block16x16[x] = [];
            for (var y = 0; y < 26; y++) {
                this.block16x16[x][y] = null;
            }
        }
    },
    setBaseProof: function (time) {
        this.baseProofCounter.setEnabled(true);
        var map = "";
        map += "5,11,2,8|";
        map += "5,12,2,10|";
        map += "6,11,2,12|";
        map += "7,11,2,4|";
        map += "7,12,2,5";
        var matrix = map.split("|");
        for (var i = 0; i < matrix.length; i++) {
            var arr = matrix[i].split(",");
            var x = +arr[0];
            var y = +arr[1];
            var typeId = +arr[2];
            var area = +arr[3];
            this.block32x32[x][y].sprite.hide();
            var block = new Block(typeId, 32 * x, 32 * y, area);
            block.addToGameUI(this);
            this.block32x32[x][y] = block;

            if ((area & 1) == 1) {
                this.block16x16[x * 2][y * 2] = { block: block, typeId: typeId, areaIndex: 0 };
            }
            if ((area & 2) == 2) {
                this.block16x16[x * 2 + 1][y * 2] = { block: block, typeId: typeId, areaIndex: 1 };
            }
            if ((area & 4) == 4) {
                this.block16x16[x * 2][y * 2 + 1] = { block: block, typeId: typeId, areaIndex: 2 };
            }
            if ((area & 8) == 8) {
                this.block16x16[x * 2 + 1][y * 2 + 1] = { block: block, typeId: typeId, areaIndex: 3 };
            }
        }
    },
    clearBaseProof: function () {
        var map = "";
        map += "5,11,1,8|";
        map += "5,12,1,10|";
        map += "6,11,1,12|";
        map += "7,11,1,4|";
        map += "7,12,1,5";
        var matrix = map.split("|");
        for (var i = 0; i < matrix.length; i++) {
            var arr = matrix[i].split(",");
            var x = +arr[0];
            var y = +arr[1];
            var typeId = +arr[2];
            var area = +arr[3];
            this.block32x32[x][y].sprite.hide();
            var block = new Block(typeId, 32 * x, 32 * y, area);
            block.addToGameUI(this);
            this.block32x32[x][y] = block;

            if ((area & 1) == 1) {
                this.block16x16[x * 2][y * 2] = { block: block, typeId: typeId, areaIndex: 0 };
            }
            if ((area & 2) == 2) {
                this.block16x16[x * 2 + 1][y * 2] = { block: block, typeId: typeId, areaIndex: 1 };
            }
            if ((area & 4) == 4) {
                this.block16x16[x * 2][y * 2 + 1] = { block: block, typeId: typeId, areaIndex: 2 };
            }
            if ((area & 8) == 8) {
                this.block16x16[x * 2 + 1][y * 2 + 1] = { block: block, typeId: typeId, areaIndex: 3 };
            }
        }
    },
    moveToStage: function (stage) {
        this.gameOverLabel.setPosition(208, this.height);
        this.gameOverLabel.hide();
        this.player.bulletProofSprite.hide();
        this.birthIndex = 0;
        this.stageCounter.setEnabled(true);
        this.stopCounter.setEnabled(false);

        this.gameArea.hide();
        this.gameArea.div.innerHTML = "";

        // 初始化
        if (stage > this.maxStage) {
            stage = 1;
        }
        this.stage = stage;
        this.stageLabel.setText("Stage: " + this.stage);
        this.flagLabel.setText(this.stage);
        this.bonus.flashCounter.setEnabled(false);
        this.bonus.sprite.hide();
        this.bonus.addToGameUI(this);
        this.baseProofCounter.setEnabled(false);
        this.baseDestoryed = false;
        this.pauseCounter.setEnabled(false);
        this.bomb.addToGameUI(this);

        this.player.state = TankState.RESET;
        this.player.birth(128, 384, this.player.type, Const.DIRECTION_UP);
        this.player.addToGameUI(this);

        this.tanks = [];
        this.tanks.push(this.player);

        for (var i = 0; i < this.tankTypes.length; i++) {
            this.leftTankLayer.div.childNodes[i].style.display = "block";
        }

        this.lifeLabel.setText(this.player.life - 1);

        this.updateLeftTank();

        this.createMap(stage);
    },
    cheat: function () {
        this.player.bulletProofTime = 99999999999;
        this.player.setType(3);

        var map = "";
        map += "5,11,2,8|";
        map += "5,12,2,10|";
        map += "6,11,2,12|";
        map += "7,11,2,4|";
        map += "7,12,2,5";
        var matrix = map.split("|");
        for (var i = 0; i < matrix.length; i++) {
            var arr = matrix[i].split(",");
            var x = +arr[0];
            var y = +arr[1];
            var typeId = +arr[2];
            var area = +arr[3];
            this.block32x32[x][y].sprite.hide();
            var block = new Block(typeId, 32 * x, 32 * y, area);
            block.addToGameUI(this);
            this.block32x32[x][y] = block;

            if ((area & 1) == 1) {
                this.block16x16[x * 2][y * 2] = { block: block, typeId: typeId, areaIndex: 0 };
            }
            if ((area & 2) == 2) {
                this.block16x16[x * 2 + 1][y * 2] = { block: block, typeId: typeId, areaIndex: 1 };
            }
            if ((area & 4) == 4) {
                this.block16x16[x * 2][y * 2 + 1] = { block: block, typeId: typeId, areaIndex: 2 };
            }
            if ((area & 8) == 8) {
                this.block16x16[x * 2 + 1][y * 2 + 1] = { block: block, typeId: typeId, areaIndex: 3 };
            }
        }
    },
    setStage: function (stage) {
        if (stage < 1) {
            stage = this.maxStage;
        }
        else if (stage > this.maxStage) {
            stage = 1;
        }
        this.stage = stage;
        this.stageLabel.setText("Stage: " + this.stage);
    },
    stop: function (time) {
        this.stopCounter.setCount(time);
        this.stopCounter.setEnabled(true);
    },
});