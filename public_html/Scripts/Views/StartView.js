var canvas;
var stage;
var queue;
function StartView()
{
    this.aircraftSpritesheet;
    this.tankerSpritesheet;
    this.mute = true;
    this.scrolling = false;
    this.mainTheme;
}

StartView.prototype = {
    constructor: StartView,
    init: function ()
    {
        queue = new createjs.LoadQueue();
        createjs.Sound.alternateExtensions = ["wav"];
        queue.installPlugin(createjs.Sound);
        queue.addEventListener('complete', this.loadComplete.bind(this));
        queue.loadManifest([
            {id: "background", src: "Assets/background.png"},
            {id: "tankerMedium", src: "Assets/truckMedium.jpg"},
            {id: "tankerSmall", src: "Assets/truckSmall.png"},
            {id: "tankerMediumS", src: "Assets/truckMediumS.png"},
            {id: "tankerSmallS", src: "Assets/truckSmallS.png"},
            {id: "tankerMediumU", src: "Assets/truckMediumU.png"},
            {id: "tankerSmallU", src: "Assets/truckSmallU.png"},
            {id: "bulkButton", src: "Assets/bulkButton.png"},
            {id: "bulkButtonS", src: "Assets/bulkButtonS.png"},
            {id: "driverCard", src: "Assets/driverCard.png"},
            {id: "driverCardS", src: "Assets/driverCardS.png"},
            {id: "driverCardU", src: "Assets/driverCardU.png"},
            {id: "taskCard", src: "Assets/taskCard.png"},
            {id: "taskCardS", src: "Assets/taskCardS.png"},
            {id: "taskCardU", src: "Assets/taskCardU.png"},
            {id: "avatar1", src: "Assets/avatar1.gif"},
            {id: "avatar2", src: "Assets/avatar2.gif"},
            {id: "avatar3", src: "Assets/avatar3.gif"},
            {id: "avatar4", src: "Assets/avatar4.gif"},
            {id: "avatar5", src: "Assets/avatar5.gif"},
            {id: "avatar6", src: "Assets/avatar6.gif"},
            {id: "levelUpButtonU", src: "Assets/levelUpU.png"},
            {id: "levelUpButton", src: "Assets/levelUp.png"},
            {id: "aircraft", src: "Assets/aircraftSprites.png"},
            {id: "tankers", src: "Assets/tankerSprites.png"},
            {id: "startButton", src: "Assets/startButton.png"},
            {id: "helpButton", src: "Assets/help.png"},
            {id: "creditsButton", src: "Assets/credits.png"},
            {id: "mute", src: "Assets/mute.png"},
            {id: "unmute", src: "Assets/unmute.png"},
            //sound files
            {id: "flyby", src: "Assets/Sounds/flyby.wav"},
            {id: "taxi", src: "Assets/Sounds/taxi.wav"},
            {id: "truckMove", src: "Assets/Sounds/truckMove.wav"},
            {id: "taskComplete", src: "Assets/Sounds/taskComplete.wav"},
            {id: "eventSound", src: "Assets/Sounds/event.wav"},
            {id: "driverLevelUp", src: "Assets/Sounds/driverLevelUp.wav"},
            {id: "levelUp", src: "Assets/Sounds/levelUp.wav"},
            {id: "land", src: "Assets/Sounds/airland.wav"},
            {id: "themeTune", src: "Assets/Sounds/themeTune.wav"},
            {id: "bonus", src: "Assets/Sounds/bonus.wav"}
        ]);
    },
    setupStage: function ()
    {
        this.canvas = document.getElementById('myGame');
        stage = new createjs.Stage(this.canvas);
        createjs.Ticker.setFPS(120);
        createjs.Ticker.addEventListener("tick", function (e) {
            stage.update();
        });
    },
    drawSprites: function ()
    {
        var aircraftData = {
            "images": [queue.getResult("aircraft")],
            "frames": [[0, 0, 100, 80], [0, 90, 100, 80], [0, 180, 100, 80], [0, 270, 100, 80]],
            "animations": {"aircraft1": [0],
                "aircraft2": [1],
                "aircraft3": [2],
                "aircraft4": [3]}
        };
        var tankerData = {
            "images": [queue.getResult("tankers")],
            "frames": [[0, 0, 100, 40], [0, 50, 100, 80], [0, 140, 100, 40]],
            "animations": {"smallTanker": [0],
                "mediumTanker": [2],
                "largeTanker": [1]
            }
        };
        this.aircraftSpritesheet = new createjs.SpriteSheet(aircraftData);
        this.tankerSpritesheet = new createjs.SpriteSheet(tankerData);
    },
    loadComplete: function ()
    {
        this.setupStage();
        displayStartScreen("Welcome to Aircraft Refueller Manager - the game", true);
    },
    drawBackground: function ()
    {
        stage.removeAllChildren();
        this.canvas.style.borderStyle = "none";
    },
    drawStartButton: function ()
    {
        var startButton = new createjs.Bitmap(queue.getResult("startButton"));
        var helpButton = new createjs.Bitmap(queue.getResult("helpButton"));
        var creditsButton = new createjs.Bitmap(queue.getResult("creditsButton"));
        startButton.x = 270;
        startButton.y = 510;
        helpButton.x = 600;
        helpButton.y = 510;
        creditsButton.x = 800;
        creditsButton.y = 510;
        startButton.addEventListener('click', function startClick(e) {
            var loadedImages = [this.queue, this.aircraftSpritesheet, this.tankerSpritesheet];
            this.mainTheme.stop();
            startButtonClicked(this.canvas, this.stage, loadedImages, this.mute);
        }.bind(this));
        helpButton.addEventListener('click', function helpClick(e) {
            getHelp(false);
        });
        creditsButton.addEventListener('click', function helpClick(e) {
            getHelp(true);
        });
        stage.addChild(startButton, creditsButton, helpButton);
    },
    drawMuteButton: function ()
    {
        var button;
        if (this.mute)
        {
            createjs.Sound.setMute(false);
            button = new createjs.Bitmap(queue.getResult("mute"));
            this.mute = false;
        }
        else
        {
            createjs.Sound.setMute(true);
            this.mute = true;
            button = new createjs.Bitmap(queue.getResult("unmute"));
        }
        button.x = 930;
        button.y = 105;
        button.addEventListener('click', function startClick(e) {
            muteButtonClickedEventHandler();
        }.bind(this));
        stage.addChild(button);
    },
    drawMessage: function (message)
    {
        stage.removeAllChildren();
        var roundedRectangle = new createjs.Shape();
        roundedRectangle.graphics.beginStroke('#000');
        roundedRectangle.graphics.beginFill('#4E78A8');
        roundedRectangle.graphics.drawRoundRect(50, -50, 800, 500, 20);
        roundedRectangle.x = 150;
        roundedRectangle.y = 151;
        stage.addChild(roundedRectangle);
        var mainMessage = new createjs.Text(message, "5em Lora", "#880015");
        mainMessage.y = 100;
        mainMessage.x = 600;
        mainMessage.lineWidth = stage.canvas.width - 500;
        mainMessage.lineHeight = 75;
        mainMessage.textAlign = "center";
        stage.addChild(mainMessage);
        var aircraftImage1 = "aircraft1";
        var aircraftImage2 = "aircraft2";
        var aircraftImage3 = "aircraft3";
        var aircraftImage4 = "aircraft4";
        var aircraft1 = new createjs.Sprite(this.aircraftSpritesheet, aircraftImage1);
        var aircraft2 = new createjs.Sprite(this.aircraftSpritesheet, aircraftImage2);
        var aircraft3 = new createjs.Sprite(this.aircraftSpritesheet, aircraftImage3);
        var aircraft4 = new createjs.Sprite(this.aircraftSpritesheet, aircraftImage4);
        aircraft1.x = -100;
        aircraft2.x = -200;
        aircraft3.x = -300;
        aircraft4.x = -400;
        aircraft1.y = 420;
        aircraft2.y = 420;
        aircraft3.y = 420;
        aircraft4.y = 420;
        stage.addChild(aircraft1, aircraft2, aircraft3, aircraft4);
        createjs.Tween.get(aircraft1).to({x: 1200}, 3000);
        createjs.Tween.get(aircraft2).to({x: 1200}, 3500);
        createjs.Tween.get(aircraft3).to({x: 1200}, 4000);
        createjs.Tween.get(aircraft4).to({x: 1200}, 4500).call(function endFlyBy() {
            getScrollMessage();
        });
        createjs.Sound.play("flyby");
        this.mainTheme = createjs.Sound.play("themeTune", createjs.Sound.INTERUPT_NONE, 1000, 0, 10);
    },
    scrollMessage: function ()
    {
        if (!this.scrolling)
        {
            this.scrolling = true;
            var scrolltext = "A Game by Dave Ogle©                         Press 'Start Game' to begin.";
            var scrollMessagetxt = new createjs.Text(scrolltext, "60px Indie Flower", "#880015");
            scrollMessagetxt.x = 1400;
            scrollMessagetxt.y = 650;
            var aircraft = "aircraft1";
            var aircraftImage = new createjs.Sprite(this.aircraftSpritesheet, aircraft);
            aircraftImage.x = 1300;
            aircraftImage.y = 650;
            aircraftImage.scaleX = -1;
            stage.addChild(aircraftImage, scrollMessagetxt);
            createjs.Tween.get(aircraftImage).to({x: -750}, 17600);
            createjs.Tween.get(scrollMessagetxt).to({x: -2000}, 30000).call(function endScroll() {
                this.scrolling = false;
                getScrollMessage();
            }.bind(this));
        }
    },
    showHelpMessage: function (credits)
    {
        try
        {
            document.getElementById('helpMessageBox').removeChild(document.getElementById('helpOk'));
        }
        catch (Exception)
        {
            console.log("Help button not yet created");
        }
        var okButton = document.createElement('div');
        okButton.id = 'helpOk';
        okButton.style.backgroundColor = '#FFC90E';
        okButton.className = 'okButton';
        okButton.onclick = function hideEventMessage()
        {
            document.getElementById('helpMessageBox').removeChild(okButton);
            document.getElementById('helpMessageBox').style.display = 'none';
            stage.removeChild(desDOM);
        }.bind(this);
        var okButtonText = document.createElement('h2');
        okButtonText.innerHTML = "OK";
        document.getElementById('helpMessageBox').appendChild(okButton);
        document.getElementById('helpOk').appendChild(okButtonText);
        if (credits)
        {
            document.getElementById("helpMessageTitle").innerHTML = "Credits";
            document.getElementById("helpMessage").innerHTML = "Aircraft Refueller Manager - the game was designed and written by Dave Ogle<br><br>" +
                    "<strong>Special Thanks to:</strong><br> Tim Buckley of Ctrl+Alt+Del comics for use of driver avatar pictures.<br><br>" +
                    "<strong>Game Testers:</strong><br>Cassie Hinkson<br>Gavin Samuel<br>Sam Virgo-Brown<br>William Sayers<br><br>" +
                    "<strong>Theme Tune:</strong><br>The game theme tune, based on \"Top Gun Anthem\" by Harold Faltermeyer, was composed and played by Dave Ogle";
        }
        else
        {
            document.getElementById("helpMessageTitle").innerHTML = "How to play the game";
            document.getElementById("helpMessage").innerHTML =
                    "As the manager in charge of aircraft refueling at a military airbase your task is to allocate drivers and tankers to refuel aircraft as they arrive at the base. " +
                    "When an aircraft lands a task will be raised, you must select a task, a driver and a suitable tanker for the task, " +
                    "If more than six tasks stack up you will lose the game. " +
                    "Each driver has a skill level and each tanker has a fuel level, if your tanker has not got enough fuel the task will fail, " +
                    "also if your driver has a low skill level the task may also fail. Driver Bios can be viewed by double clicking on a driver card. " +
                    "Failed tasks will have to be re-attempted costing you valuable time. " +
                    "Drivers can be trained to improve performance and reduce the chance of events occuring by clicking the levelup button on the driver card when you have enough money. " +
                    "Tankers can be refilled by selecting them and clicking on the 'Bulk' button. " +
                    "If you successfully complete a task you will be paid by the airbase for your services, these funds can then be used to train your drivers. " +
                    "It’s a busy airbase and tasks will arrive with an increasing frequency, good luck!";
        }
        var desDOM = new createjs.DOMElement(helpMessageBox);
        desDOM.alpha = 0;
        desDOM.regX = 200;
        desDOM.x = stage.canvas.width / 2;
        stage.addChild(desDOM);
        document.getElementById('helpMessageBox').style.display = 'block';
        createjs.Tween.get(desDOM).wait(100).to({y: 20, alpha: 1}, 1000,
                createjs.Ease.quadOut);
        $('#helpMessageBox').css('zIndex', 600);
    },
    setMute: function (mute)
    {
        this.mute = mute;
    }
};
//EOF
