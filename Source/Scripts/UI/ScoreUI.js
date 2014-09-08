ScoreUI = ClassFactory.createClass(UIBase, {
    init: function () {
        UIBase.init.call(this);

        this.setSize(Const.SCREEN_WIDTH, Const.SCREEN_HEIGHT);
        this.setBackground("#000000");
        this.setPosition(0, 0);
        this.setZ(9999);

        this.highestScoreLabel = new Label("HI-SCORE");
        this.highestScoreLabel.setCSS({ "color": "#E05000" });
        this.highestScoreLabel.setPosition(132, 32);
        this.highestScoreLabel.show();
        this.append(this.highestScoreLabel);

        this.highestScoreNumberLabel = new Label("200000");
        this.highestScoreNumberLabel.setCSS({ "color": "#FFA000" });
        this.highestScoreNumberLabel.setPosition(308, 32);
        this.highestScoreNumberLabel.show();
        this.append(this.highestScoreNumberLabel);

        this.scoreStageLabel = new Label("STAGE     " + this.stage);
        this.scoreStageLabel.setCSS({ "color": "#ffffff" });
        this.scoreStageLabel.setPosition(190, 64);
        this.scoreStageLabel.show();
        this.append(this.scoreStageLabel);

        this.player1Label = new Label("I-PLAYER");
        this.player1Label.setCSS({ "color": "#E05000" });
        this.player1Label.setPosition(50, 96);
        this.player1Label.show();
        this.append(this.player1Label);

        this.player1ScoreLabel = new Label("0");
        this.player1ScoreLabel.setCSS({ "color": "#FFA000" });
        this.player1ScoreLabel.setSize(115, 32);
        this.player1ScoreLabel.setAlign("right");
        this.player1ScoreLabel.setPosition(50, 128);
        this.player1ScoreLabel.show();
        this.append(this.player1ScoreLabel);

        this.enemy1ScoreLabel = new Label("0  PTS");
        this.enemy1ScoreLabel.setCSS({ "color": "#ffffff" });
        this.enemy1ScoreLabel.setSize(115, 32);
        this.enemy1ScoreLabel.setAlign("right");
        this.enemy1ScoreLabel.setPosition(50, 172);
        this.enemy1ScoreLabel.show();
        this.append(this.enemy1ScoreLabel);

        this.enemy1NumberLabel = new Label("18");
        this.enemy1NumberLabel.setCSS({ "color": "#ffffff" });
        this.enemy1NumberLabel.setSize(32, 32);
        this.enemy1NumberLabel.setAlign("right");
        this.enemy1NumberLabel.setPosition(190, 172);
        this.enemy1NumberLabel.show();
        this.append(this.enemy1NumberLabel);

        this.enemy1ArrowLayer = new Layer();
        this.enemy1ArrowLayer.setSize(16, 16);
        this.enemy1ArrowLayer.setBackground("url(" + Const.IMAGE_MISC.src + ") -96px 0px");
        this.enemy1ArrowLayer.setPosition(225, 180);
        this.enemy1ArrowLayer.show();
        this.append(this.enemy1ArrowLayer);

        this.enemy1Layer = new Layer();
        this.enemy1Layer.setSize(32, 32);
        this.enemy1Layer.setBackground("url(" + Const.IMAGE_TANK.src + ") -128px 0px");
        this.enemy1Layer.setPosition(242, 172);
        this.enemy1Layer.show();
        this.append(this.enemy1Layer);

        this.enemy2ScoreLabel = new Label("0  PTS");
        this.enemy2ScoreLabel.setCSS({ "color": "#ffffff" });
        this.enemy2ScoreLabel.setSize(115, 32);
        this.enemy2ScoreLabel.setAlign("right");
        this.enemy2ScoreLabel.setPosition(50, 220);
        this.enemy2ScoreLabel.show();
        this.append(this.enemy2ScoreLabel);

        this.enemy2NumberLabel = new Label("18");
        this.enemy2NumberLabel.setCSS({ "color": "#ffffff" });
        this.enemy2NumberLabel.setSize(32, 32);
        this.enemy2NumberLabel.setAlign("right");
        this.enemy2NumberLabel.setPosition(190, 220);
        this.enemy2NumberLabel.show();
        this.append(this.enemy2NumberLabel);

        this.enemy2ArrowLayer = new Layer();
        this.enemy2ArrowLayer.setSize(16, 16);
        this.enemy2ArrowLayer.setBackground("url(" + Const.IMAGE_MISC.src + ") -96px 0px");
        this.enemy2ArrowLayer.setPosition(225, 228);
        this.enemy2ArrowLayer.show();
        this.append(this.enemy2ArrowLayer);

        this.enemy2Layer = new Layer();
        this.enemy2Layer.setSize(32, 32);
        this.enemy2Layer.setBackground("url(" + Const.IMAGE_TANK.src + ") -192px 0px");
        this.enemy2Layer.setPosition(242, 220);
        this.enemy2Layer.show();
        this.append(this.enemy2Layer);

        this.enemy2ScoreLabel = new Label("0  PTS");
        this.enemy2ScoreLabel.setCSS({ "color": "#ffffff" });
        this.enemy2ScoreLabel.setSize(115, 32);
        this.enemy2ScoreLabel.setAlign("right");
        this.enemy2ScoreLabel.setPosition(50, 268);
        this.enemy2ScoreLabel.show();
        this.append(this.enemy2ScoreLabel);

        this.enemy3NumberLabel = new Label("18");
        this.enemy3NumberLabel.setCSS({ "color": "#ffffff" });
        this.enemy3NumberLabel.setSize(32, 32);
        this.enemy3NumberLabel.setAlign("right");
        this.enemy3NumberLabel.setPosition(190, 268);
        this.enemy3NumberLabel.show();
        this.append(this.enemy3NumberLabel);

        this.enemy3ArrowLayer = new Layer();
        this.enemy3ArrowLayer.setSize(16, 16);
        this.enemy3ArrowLayer.setBackground("url(" + Const.IMAGE_MISC.src + ") -96px 0px");
        this.enemy3ArrowLayer.setPosition(225, 276);
        this.enemy3ArrowLayer.show();
        this.append(this.enemy3ArrowLayer);

        this.enemy3Layer = new Layer();
        this.enemy3Layer.setSize(32, 32);
        this.enemy3Layer.setBackground("url(" + Const.IMAGE_TANK.src + ") -256px 0px");
        this.enemy3Layer.setPosition(242, 268);
        this.enemy3Layer.show();
        this.append(this.enemy3Layer);

        this.enemy4ScoreLabel = new Label("0  PTS");
        this.enemy4ScoreLabel.setCSS({ "color": "#ffffff" });
        this.enemy4ScoreLabel.setSize(115, 32);
        this.enemy4ScoreLabel.setAlign("right");
        this.enemy4ScoreLabel.setPosition(50, 316);
        this.enemy4ScoreLabel.show();
        this.append(this.enemy4ScoreLabel);

        this.enemy4NumberLabel = new Label("0");
        this.enemy4NumberLabel.setCSS({ "color": "#ffffff" });
        this.enemy4NumberLabel.setSize(32, 32);
        this.enemy4NumberLabel.setAlign("right");
        this.enemy4NumberLabel.setPosition(190, 316);
        this.enemy4NumberLabel.show();
        this.append(this.enemy4NumberLabel);

        this.enemy4ArrowLayer = new Layer();
        this.enemy4ArrowLayer.setSize(16, 16);
        this.enemy4ArrowLayer.setBackground("url(" + Const.IMAGE_MISC.src + ") -96px 0px");
        this.enemy4ArrowLayer.setPosition(225, 324);
        this.enemy4ArrowLayer.show();
        this.append(this.enemy4ArrowLayer);

        this.enemy4Layer = new Layer();
        this.enemy4Layer.setSize(32, 32);
        this.enemy4Layer.setBackground("url(" + Const.IMAGE_TANK.src + ") -320px 0px");
        this.enemy4Layer.setPosition(242, 316);
        this.enemy4Layer.show();
        this.append(this.enemy4Layer);

        this.underlineLayer = new Layer();
        this.underlineLayer.setSize(130, 3);
        this.underlineLayer.setBackground("#ffffff");
        this.underlineLayer.setPosition(185, 350);
        this.underlineLayer.show();
        this.append(this.underlineLayer);

        this.totalLayer = new Label("TOTAL");
        this.totalLayer.setCSS({ "color": "#ffffff" });
        this.totalLayer.setPosition(85, 352);
        this.totalLayer.show();
        this.append(this.totalLayer);

        this.totalNumberLabel = new Label("0");
        this.totalNumberLabel.setCSS({ "color": "#ffffff" });
        this.totalNumberLabel.setPosition(207, 352);
        this.totalNumberLabel.show();
        this.append(this.totalNumberLabel);

        this.counter = new Counter(180, false, true);
    },
    onEnter: function () {
        this.show();
    },
    onLevel: function () {
        this.hide();
    },
    onUpdate: function () {
        if (!this.counter.countdown()) {
            return false;
        }

        return true;
    }
});