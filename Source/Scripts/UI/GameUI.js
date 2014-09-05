GameUI = ClassFactory.createClass(UIBase, {
    init: function () {
        UIBase.init.call(this);

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
        this.tankTypes = [3, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 3];
        this.bonusArr = [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0];

        // 新建坦克索引
        this.birthIndex = 0;
        this.maxTank = 5;

        // 动态块
        this.animateBlocks = [];

        this.endCounter = new Counter(60, false, false);

        this.setSize(Const.SCREEN_WIDTH, Const.SCREEN_HEIGHT);
        this.setBackground("RGB(102,102,102)");
        this.setPosition(0, 0);
       

        // 游戏区域
        this.gameArea = new Layer();
        this.gameArea.setSize(416, 416);
        this.gameArea.setPosition(30, (Const.SCREEN_HEIGHT - 416) / 2);
        this.gameArea.setBackground("#000000");
        this.gameArea.show();
        this.append(this.gameArea);

        // 暂停
        this.pause = false;
        this.pauseLabel = new Label("暂停");
        this.pauseLabel.setColor("#FFF");
        this.pauseLabel.setSize(46, 46);
        this.pauseLabel.moveTo(233 - 15, 233 - 24);
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
        this.lifeLayer = new Layer();
        this.lifeLayer.setSize(18, 18);
        this.lifeLayer.setPosition(15, 410);
        this.lifeLayer.setBackground("url(" + Const.IMAGE_MISC.src + ") no-repeat -14px -18px");
        this.lifeLayer.show();
        this.statusArea.append(this.lifeLayer);

        this.lifeLabel = new Label("");
        this.lifeLabel.setColor("#000");
        this.lifeLabel.setSize(32, 18);
        this.lifeLabel.setCSS({ font: "16px 'Arial Black'" });
        this.lifeLabel.moveTo(35, 405);
        this.lifeLabel.show();
        this.statusArea.append(this.lifeLabel);

        this.baseDestoryed = false;
        this.baseProofCounter = new Counter(300, false, true);
        this.baseProofCounter.setEnabled(false);

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

        this.append(this.stageLayer);
        this.stageShowCounter = new Counter(90, false, true);

        this.bonus = new Bonus();     

        this.setPosition(0, 0);
    },
    onEnter: function () {
        this.player.life = 3;
        this.birthIndex = 0;

        this.show();
        this.moveToStage(28);
    },
    onLevel: function () {
        this.hide();
    },
    onUpdate: function () {

        if (this.stageShowCounter.enabled && this.stageShowCounter.countdown()) {
            this.stageLayer.show();
            return true;
        }
        else {
            this.stageLayer.hide();
            this.gameArea.show();
            this.stageShowCounter.setEnabled(false);
        }

        if (!this.bonus.taken) {
            this.bonus.update();
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
        if (Input.isPressed(13)) {
            this.pause = !this.pause;
        }
        if (this.pause) {
            this.pauseLabel.show();
            return true;
        }
        else {
            this.pauseLabel.hide();
        }

        if (this.baseDestoryed && !this.bomb.update()) {
            if (!this.bombCounter.countdown()) {
                return false;
            }
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

        for (var i = 0; i < this.animateBlocks.length; i++) {
            this.animateBlocks[i].update();
        }

        if (!over && liveTanks < 3 && this.birthIndex < this.tankTypes.length) {
            var newTank = new EnemyTank(this.gameArea, 1);
            newTank.setBonus(!!(this.bonusArr[this.birthIndex]));
            newTank.birth(192 * (this.birthIndex % 3), 0, this.tankTypes[this.birthIndex], Const.DIRECTION_DOWN);
            newTank.addToGameUI(this);
            this.birthIndex++;
            this.tanks.push(newTank);
            this.updateLeftTank();
        }

        if (this.player.life <= 0 || over) {
            if (!this.endCounter.countdown()) {
                this.player.life = 3;
                this.player.setType(0);
                return false;
            }
        }

        if (over) {
            this.moveToStage(++this.stage);
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
    setBaseProof: function(time) {
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
    clearBaseProof: function() {
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

        this.stageShowCounter.setEnabled(true);
        
        this.gameArea.hide();
        this.gameArea.div.innerHTML = "";
        
        // 初始化
        if (stage > this.maxStage) {
            stage = 1;
        }
        this.stage = stage;
        this.stageLabel.setText("Stage: " + this.stage);
        this.bonus.taken = true;
        this.bonus.sprite.hide();
        this.bonus.addToGameUI(this);
        this.baseProofCounter.setEnabled(false);
        this.baseDestoryed = false;
        this.pause = false;
        this.bomb.addToGameUI(this);

        this.player.state = TankState.RESET;
        this.player.birth(128, 384, this.player.type, Const.DIRECTION_UP);
        this.player.addToGameUI(this);

        this.tanks = [];
        this.tanks.push(this.player);

        for (this.birthIndex = 0; this.birthIndex < 3; this.birthIndex++) {
            var tank = new EnemyTank(1);
            tank.setBonus(!!(this.bonusArr[this.birthIndex]));
            tank.birth(192 * this.birthIndex, 0, this.tankTypes[this.birthIndex], Const.DIRECTION_DOWN);
            tank.addToGameUI(this);
            this.tanks.push(tank);
        }

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
    restart: function () {
        
    }
});