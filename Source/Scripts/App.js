App = {
    init: function () {
        this.container = document.getElementById("app");

        this.openingUI = new OpeningUI();
        this.openingUI.appendTo(this.container);

        this.gameUI = new GameUI();
        this.gameUI.appendTo(this.container);

        this.endingUI = new EndingUI();
        this.endingUI.appendTo(this.container);

        this.tanks = [];

        this.scenes = [this.openingUI, this.gameUI, this.endingUI];
        this.scenesIndex = -1;
        
    },
    process: function (src, loaded, total) {
        /*
        console.log(src + " has been loaded");
        */
    },
    complete: function () {

        App.init();

        //this.scoreUI = new ScoreUI();
        //this.scenes = [this.scoreUI];
        //this.scoreUI.appendTo(this.container);

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
            //app.scenes[app.scenesIndex].update();
        }, 16);
    },
    error: function (src, loaded, total) {
        alert("加载图片 " + src + " 出错");
        /*
        console.log(src + " is error");
        */
    },
    run: function () {
        ImageLoader.load(this, ["../Images/Boom.png", "../Images/Frag.png", "../Images/Misc.png", "../Images/Tank.png", "../Images/Terr.png", "../Images/UI.png"]);
    }
};