BonusType = {
    BaseProof: 0,
    Star: 1,
    Life: 2,
    BulletProof: 3,
    Bomb: 4,
    Timer: 5
};

Bonus = ClassFactory.createClass(GameObject, {
    init: function () {
        GameObject.init.call(this);
        this.taken = true;
        this.type = -1;
        this.sprite = new Sprite(Const.IMAGE_TANK, 32, 32);
        this.sprite.setZ(Const.Z_BONUS);

        this.flashCounter = new Counter(8, true, true);
    },
    random: function () {
        this.type = Math.round(Math.random() * 5);
        var x = Math.round(Math.random() * 12) * 32;
        var y = Math.round(Math.random() * 12) * 32;
        this.sprite.setPosition(x, y);
        this.sprite.setFrameSequence([121 + this.type]);
        this.sprite.moveToFrame(0);
        this.flash = true;
        this.taken = false;
    },
    take: function () {
        this.taken = true;
        this.sprite.hide();
        switch (this.type) {
            case BonusType.BaseProof:
                this.gameUI.setBaseProof(600);
                break;
            case BonusType.Star:
                this.gameUI.player.levelUp();
                break;
            case BonusType.Life:
                this.gameUI.lifeLabel.setText(this.gameUI.player.life++);
                break;
            case BonusType.BulletProof:
                this.gameUI.player.setBulletProofTime(480);
                break;
            case BonusType.Bomb:
                for (var i = 1; i < this.gameUI.tanks.length; i++) {
                    if (this.gameUI.tanks[i].state == TankState.LIVE) {
                        this.gameUI.tanks[i].boom();
                    }
                }
                break;
            case BonusType.Timer:
                for (var i = 1; i < this.gameUI.tanks.length; i++) {
                    if (this.gameUI.tanks[i].state == TankState.LIVE) {
                        this.gameUI.tanks[i].stop(300);
                    }
                }
                break;
        }
    },
    update: function () {
        if (!this.taken) {
            if (!this.flashCounter.countdown()) {
                this.sprite.setVisible(!this.sprite.visible);
            }
        }
    },
    addToGameUI: function (gameUI) {
        GameObject.prototype.addToGameUI.call(this, gameUI);
        gameUI.gameArea.append(this.sprite);
    }
});