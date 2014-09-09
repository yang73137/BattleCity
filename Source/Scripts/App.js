﻿UIMode = {
    Opening: 0,
    Stage: 1,
    Game: 2,
    Score: 3,
    Ending: 4
};

App = {
    init: function () {
        this.container = document.getElementById("app");

        this.openingUI = new OpeningUI();
        this.openingUI.appendTo(this.container);

        this.stageUI = new StageUI();
        this.stageUI.appendTo(this.container);

        this.gameUI = new GameUI();
        this.gameUI.appendTo(this.container);

        this.endingUI = new EndingUI();
        this.endingUI.appendTo(this.container);

        this.tanks = [];

        this.scenes = [this.openingUI, this.gameUI, this.endingUI];
        this.scenesIndex = -1;

        this.mode = UIMode.Opening;
    },
    process: function (src, loaded, total) {
        /*
        console.log(src + " has been loaded");
        */
    },
    complete: function () {

        App.init();

        this.openingUI.enter();
        App.onTimer();
        /*
        this.openingUI.enter();
        if (App.scenesIndex == -1) {
            App.scenesIndex = 0;
            App.scenes[0].enter();
        }
        var app = App;
        setInterval(function () {

            if (!app.scenes[app.scenesIndex].update()) {
                app.scenes[app.scenesIndex].level();
                app.scenesIndex++;
                if (app.scenesIndex == app.scenes.length) {
                    app.scenesIndex = 0;
                }
                app.scenes[app.scenesIndex].enter();
            }
        }, 16);*/
    },
    error: function (src, loaded, total) {
        alert("加载图片 " + src + " 出错");
        /*
        console.log(src + " is error");
        */
    },
    run: function () {
        ImageLoader.load(this, ["../Images/Boom.png", "../Images/Frag.png", "../Images/Misc.png", "../Images/Tank.png", "../Images/Terr.png", "../Images/UI.png"]);
    },
    onTimer: function () {
        
        var app = App;
        setInterval(function () {
            switch (app.mode) {
                case UIMode.Opening:
                    if (!app.openingUI.update()) {
                        app.openingUI.level();
                        app.stageUI.enter();
                        app.mode = UIMode.Stage;
                    }
                    break;
                case UIMode.Stage:
                    if (!app.stageUI.update()) {
                        app.stageUI.level();
                        app.gameUI.enter();
                        app.mode = UIMode.Game;
                    }
                    break;
                case UIMode.Game:
                    if (!app.gameUI.update()) {
                        app.gameUI.level();
                        app.mode = UIMode.Score;
                        app.scoreUI.enter();
                    }
                    break;
                case UIMode.Score:
                    if (!app.scoreUI.update()) {
                        app.scoreUI.level();
                        if (app.gameUI.isFailed()) {
                            app.openingUI.enter();
                            app.mode = UIMode.Ending;
                        } else {
                            app.gameUI.enter();
                            app.mode = UIMode.Game;
                        }
                    }
                    break;
                case UIMode.Ending:
                    if (!app.endingUI.update()) {
                        app.endingUI.level();
                        app.openingUI.enter();
                        app.mode = UIMode.Opening;
                    }
                    break;
            }
        }, 16);
    }
};