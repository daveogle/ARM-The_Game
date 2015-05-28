/* 
 * GameView Class
 */
var canvas;
var stage;
var queue;

function GameView(canvas, stage, queue, mute)
{
    this.canvas = canvas;
    this.stage = stage;
    this.queue = queue[0];
    this.gameOver = false;
    this.taskSelected = 0;
    this.tankerSelected = 0;
    this.driverSelected = 0;
    this.TANKER_TOP = 485;
    this.tankerContainer = new Array();
    this.driverContainer = new Array(); //2D array each element is a array holding the driverContainer at 0 and the button at 1
    this.taskContainer = {};
    this.driverLevelUp = new Array();
    this.DRIVER_TOP = 114;
    this.TANKER_FONT = "40px Impact";
    this.DRIVER_FONT = "15px Impact";
    this.TASK_FONT = "35px Lucida Console";
    this.TANKER_FONT_COLOUR = "#000000";
    this.TANKER_FONT_Y = 9;
    this.CANVAS_BOTTOM = 667;
    this.TASK_TOP = [716, 583, 450, 317, 184, 50];
    this.scoreDisplay;
    this.fundsDisplay;
    this.aircraftSpritesheet = queue[1];
    this.tankerSpritesheet = queue[2];
    this.slotX = [452, 552, 652, 752, 852, 952, 1052, 1152];
    this.tankers = {};
    this.mute = mute;
    this.menuBar;
    this.pause = false;
    this.myIdIndex = 1;
}

GameView.prototype = {
    constructor: GameView,
    buildBackground: function ()
    {
        stage.removeAllChildren();
        var background = queue.getResult("background");
        background = new createjs.Bitmap(background);
        background.y = 50;
        stage.addChild(background);
        this.canvas.style.borderStyle = "double";
        this.drawMenuBar();
    },
    drawMenuBar: function ()
    {
        stage.removeChild(this.menuBar, this.scoreDisplay);
        var pauseLabel = "Pause";
        var pauseColour = "#FFF2CC";
        var pauseX = 637;
        this.menuBar = new createjs.Container();
        var background = new createjs.Shape().set({x: 0, y: 0});
        var quitButton = new createjs.Shape().set({x: 0, y: 0});
        var helpButton = new createjs.Shape().set({x: 204, y: 0});
        var creditsButton = new createjs.Shape().set({x: 403, y: 0});
        var pauseButton = new createjs.Shape().set({x: 602, y: 0});
        if (this.pause)
        {
            pauseLabel = "Resume";
            pauseColour = "#E06666";
            pauseX = 628;
        }
        var quitText = new createjs.Text("Quit", "40px Lucida Console", "#000000").set({x: 55, y: 5});
        var helpText = new createjs.Text("Help", "40px Lucida Console", "#000000").set({x: 250, y: 5});
        var creditsText = new createjs.Text("Credits", "40px Lucida Console", "#000000").set({x: 417, y: 5});
        var pauseText = new createjs.Text(pauseLabel, "40px Lucida Console", "#000000").set({x: pauseX, y: 5});
        background.graphics.beginStroke('#000');
        background.graphics.beginFill('#4E78A8');
        background.graphics.drawRect(0, 0, 1200, 50);
        helpButton.graphics.beginStroke('#000');
        var helpFill = helpButton.graphics.beginFill('#FFF2CC').command;
        helpButton.graphics.drawRect(0, 0, 198, 50);

        helpButton.on("mousedown", function () {
            if (!this.pause)
            {
                helpFill.style = "#E06666";
            }
        }.bind(this));
        helpButton.on("pressup", function () {
            if (!this.pause)
            {
                helpFill.style = "#FFF2CC";
                getHelp(false);
            }
        }.bind(this));
        quitButton.graphics.beginStroke('#000');
        var quitFill = quitButton.graphics.beginFill('#FFF2CC').command;
        quitButton.graphics.drawRect(0, 0, 204, 50);

        quitButton.on("mousedown", function () {
            if (!this.pause)
            {
                quitFill.style = "#E06666";
            }
        }.bind(this));
        quitButton.on("pressup", function () {
            if (!this.pause)
            {
                quitFill.style = "#FFF2CC";
                this.gameOver = true;
                this.pause = true;
                quit(this.mute);
            }
        }.bind(this));
        pauseButton.graphics.beginStroke('#000');
        var pauseFill = pauseButton.graphics.beginFill(pauseColour).command;
        pauseButton.graphics.drawRect(0, 0, 198, 50);
        pauseButton.on("pressup", function () {
            if (!this.gameOver)
            {
                pauseFill.style = "#FFF2CC";
                pauseGame(!this.pause);
            }
        }.bind(this));
        creditsButton.graphics.beginStroke('#000');
        var credFill = creditsButton.graphics.beginFill('#FFF2CC').command;
        creditsButton.graphics.drawRect(0, 0, 198, 50);

        creditsButton.on("mousedown", function () {
            if (!this.gameOver)
            {
                credFill.style = "#E06666";
            }
        }.bind(this));
        creditsButton.on("pressup", function () {
            if (!this.gameOver)
            {
                credFill.style = "#FFF2CC";
                getHelp(true);
            }
        }.bind(this));
        var muteButton = this.getMuteButton();
        this.menuBar.addChild(background, helpButton, helpText, quitButton, quitText, creditsButton, creditsText, muteButton, pauseButton, pauseText);
        stage.addChild(this.menuBar, this.scoreDisplay);
    },
    getMuteButton: function ()
    {
        var muteButton;
        if (this.mute)
        {
            muteButton = new createjs.Bitmap(queue.getResult("unmute")).set({x: 1150, y: 1});
            createjs.Sound.setMute(true);
        }
        else
        {
            muteButton = new createjs.Bitmap(queue.getResult("mute")).set({x: 1150, y: 1});
            createjs.Sound.setMute(false);
        }
        var originalW = muteButton.image.width;
        var originalH = muteButton.image.height;
        var newW = 50;
        var newH = 49;
        muteButton.scaleX = muteButton.scaleY = newW / originalW;
        muteButton.scaleX = muteButton.scaleY = Math.min(newW / originalW, newH / originalH);
        muteButton.addEventListener('click', function startClick(e) {
            this.menuBar.removeChildAt(7);
            this.mute = !this.mute;
            muteButton = this.getMuteButton();
            this.menuBar.addChildAt(muteButton, 7);
        }.bind(this));
        return muteButton;
    },
    displayLevel: function (level)
    {
        var newLevelCard = new createjs.Container().set({x: 600, y: -100});
        var newLevelBox = new createjs.Shape().set({x: 0, y: 0});
        newLevelBox.graphics.beginStroke('#000');
        newLevelBox.graphics.beginFill('#880015');
        newLevelBox.graphics.drawRect(0, 0, 350, 100);
        var text = "Start Level " + level;
        var levelTxt = new createjs.Text(text, "50px Lora", "#F1C232").set({x: 20, y: 20});
        levelTxt.lineWidth = 350;
        newLevelCard.addChild(newLevelBox, levelTxt);
        stage.addChild(newLevelCard);
        this.drawMenuBar();
        function handleComplete() {
            stage.removeChild(newLevelCard);
        }
        handleComplete.bind(this);
        if (level !== 1)
        {
            createjs.Sound.play("levelUp");
        }
        createjs.Tween.get(newLevelCard).to({y: 850}, 1900).call(handleComplete);
    },
    /*
     * A function to set the initial tanker pool 
     */
    setTankerPool: function ()
    {
        var tankerFuel = updateTankers();
        var image = "tankerSmall";
        for (var i = 0; i < 4; i++)
        {
            if (i !== 0)
            {
                image = "tankerMedium";
            }
            var container = this.setTankerContainer(i + 1, tankerFuel[i], image);
            var a = this.tankerContainer;
            this.tankerContainer.push(container);
            stage.addChild(this.tankerContainer[i]);
        }
        var bulkButton = new createjs.Bitmap(queue.getResult("bulkButton"));
        var bulkButtonS = new createjs.Bitmap(queue.getResult("bulkButtonS"));
        bulkButton.y = this.tankerContainer[3].y + 122;
        bulkButtonS.y = this.tankerContainer[3].y + 122;
        //Bulk 
        bulkButton.addEventListener('mousedown', function bulkDown(e) {
            if (this.tankerSelected !== 0 && !this.gameOver)
            {
                stage.removeChild(bulkButton);
                stage.addChild(bulkButtonS);
            }
        }.bind(this));
        bulkButton.addEventListener('pressup', function bulkUp(e) {
            if (this.tankerSelected !== 0 && !this.gameOver)
            {
                bulkClickedEventHander(this.tankerSelected);
            }
            stage.removeChild(bulkButtonS);
            stage.addChild(bulkButton);
        }.bind(this));
        stage.addChild(bulkButton);
    },
    /**
     * A function to create and return a container with for a tanker
     * @param {type} tanker
     * @param {type} fuel
     * @param {type} picture
     * @returns {setTankerContainer.tankerContainer|createjs.Container}
     */
    setTankerContainer: function (tanker, fuel, picture) {
        var tankerFuel = fuel;
        var image = queue.getResult(picture);
        if (tanker === 1)
        {
            image = queue.getResult(picture);
        }
        var tankerContainer = new createjs.Container();
        var truck = new createjs.Bitmap(image);
        var tankerTxt = new createjs.Text(tankerFuel, this.TANKER_FONT, this.TANKER_FONT_COLOUR);
        tankerTxt.y = tankerContainer.y + 9;
        tankerTxt.x = 10;
        tankerContainer.y = this.TANKER_TOP + (61 * (tanker - 1));
        if (tanker === 4)
        {
            tankerTxt.y = tankerTxt.y * 4;
            truck.scaleY = 2;
        }
        truck.addEventListener('click', function tankerClicked(e)
        {
            if (this.tankerSelected !== tanker && !this.pause)
            {
                tankerClickedEventHandler(tanker);
            }
        }.bind(this));
        tankerContainer.addChild(truck, tankerTxt);
        return tankerContainer;
    },
    setTankerSelected: function (tanker)
    {
        var image;
        var oldSelection = this.tankerSelected;
        var fuel = this.tankerContainer[tanker - 1].getChildAt(1).text;
        stage.removeChild(this.tankerContainer[tanker - 1]);
        //Update the selected tanker
        image = "tankerMediumS";
        if (tanker === 1)
        {
            image = "tankerSmallS";
        }
        this.tankerContainer[tanker - 1] = this.setTankerContainer(tanker, fuel, image);
        stage.addChild(this.tankerContainer[tanker - 1]);
        //update old selection
        this.tankerSelected = tanker;
        if (oldSelection !== 0)
        {
            fuel = this.tankerContainer[oldSelection - 1].getChildAt(1).text;
            stage.removeChild(this.tankerContainer[oldSelection - 1]);
            image = "tankerMedium";
            if (oldSelection === 1)
            {
                image = "tankerSmall";
            }
            this.tankerContainer[oldSelection - 1] = this.setTankerContainer(oldSelection, fuel, image);
            stage.addChild(this.tankerContainer[oldSelection - 1]);
        }
    },
    toggleTankerUnselectable: function (tanker, unselectable)
    {
        if (this.gameOver)
        {
            unselectable = true;
        }
        var image;
        var fuel;
        fuel = this.tankerContainer[tanker - 1].getChildAt(1).text;
        stage.removeChild(this.tankerContainer[tanker - 1]);
        if (!unselectable)
        {
            //make selectable
            image = "tankerMedium";
            if (tanker === 1)
            {
                image = "tankerSmall";
            }
        }
        else
        {
            //make unselectable
            image = "tankerMediumU";
            if (tanker === 1)
            {
                image = "tankerSmallU";
            }
        }
        if (this.tankerSelected === tanker)
        {
            this.tankerSelected = 0;
        }
        this.tankerContainer[tanker - 1] = this.setTankerContainer(tanker, fuel, image);
        stage.addChild(this.tankerContainer[tanker - 1]);
    },
    /**
     * Function to animate the bulk fuel action
     * 
     * @param {type} tanker
     * @param {type} fuel
     * @returns {undefined}
     */
    updateTankerFuel: function (tanker, fuel, fontColour)
    {
        if (!this.gameOver)
        {
            stage.removeChild(this.tankerContainer[tanker - 1]);
            this.tankerContainer[tanker - 1].removeChildAt(1);
            var tankerText = new createjs.Text(fuel.toString(), this.TANKER_FONT, fontColour);
            tankerText.y = 9;
            tankerText.x = 10;
            if (tanker === 4)
            {
                tankerText.y = tankerText.y * 4;
                tankerText.x = 15;
            }
            this.tankerContainer[tanker - 1].addChild(tankerText);
            stage.addChild(this.tankerContainer[tanker - 1]);
        }
    },
    bulkTanker: function (tanker, fuel, needed)
    {
        if (fuel !== needed)
        {
            this.toggleTankerUnselectable(tanker, true);
            return true;
        }
        else
        {
            this.showEventMessage("Tanker Full!", "Tanker " + tanker + " is full!", '#FFC90E');
        }
        return false;
    },
    drawDriverPool: function ()
    {
        var driverPool = getNewDrivers();
        var levelUpButton = new createjs.Bitmap(queue.getResult("levelUpButtonU"));
        for (var i = 0; i < 4; i++)
        {
            var cardImage = new createjs.Bitmap(queue.getResult("driverCard"));
            this.driverLevelUp.push(false);
            var levelUpButton = new createjs.Bitmap(queue.getResult("levelUpButtonU"));
            var driver = driverPool[i];
            var picture = new createjs.Bitmap(queue.getResult(driver.getAvatar()));
            var container = new Array();
            var newDriverContainer = this.setDriverContainer(i + 1, driver.getCurrentLevel(), driver.getName(), driver.getNextLevelCost(), cardImage, picture);
            var lUbutton = this.setDriverLevelUpButtonContainer(levelUpButton, newDriverContainer, i + 1, false);
            container.push(newDriverContainer);
            container.push(lUbutton);
            this.driverContainer.push(container);
            stage.addChild(this.driverContainer[i][0], this.driverContainer[i][1]);
        }
        this.updateScore(0, 0);
    },
    updateDriverCard: function (driver, currentLevel, nextLevelCost, canLevelUp)
    {
        var driverCardImage = this.driverContainer[driver - 1][0].getChildAt(0);
        var driverPic = this.driverContainer[driver - 1][0].getChildAt(1);
        var nameTxt = this.driverContainer[driver - 1][0].getChildAt(2).text;
        var levelTxt = currentLevel;
        var levelUp;
        if (!canLevelUp)
        {
            this.driverLevelUp[driver - 1] = false;
            levelUp = new createjs.Bitmap(queue.getResult("levelUpButtonU"));
        }
        else
        {
            this.driverLevelUp[driver - 1] = true;
            levelUp = new createjs.Bitmap(queue.getResult("levelUpButton"));
        }
        var levelUpTxt = nextLevelCost;
        stage.removeChild(this.driverContainer[driver - 1][0]);
        stage.removeChild(this.driverContainer[driver - 1][1]);
        this.driverContainer[driver - 1][0] = this.setDriverContainer(driver, levelTxt, nameTxt, levelUpTxt, driverCardImage, driverPic);
        this.driverContainer[driver - 1][1] = this.setDriverLevelUpButtonContainer(levelUp, this.driverContainer[driver - 1][0], driver, false);
        stage.addChild(this.driverContainer[driver - 1][0]);
        stage.addChild(this.driverContainer[driver - 1][1]);
    },
    setDriverContainer: function (driver, level, name, nextLevel, card, picture)
    {
        //driver picture and levelup button are added as BitMaps so they can be pulled straight from the view for update
        var driverContainer = new createjs.Container();
        var driverPicture = picture; //Text
        var nameTxt = new createjs.Text(name, "30px Impact", this.TANKER_FONT_COLOUR);
        var levelTxt = new createjs.Text(level.toString(), "20px Impact", this.TANKER_FONT_COLOUR);
        var nextLevelTxt = new createjs.Text(nextLevel, this.DRIVER_FONT, this.TANKER_FONT_COLOUR);
        driverContainer.y = this.DRIVER_TOP + ((driver - 1) * 92);
        driverPicture.y = 5;
        nameTxt.y = 25;
        nextLevelTxt.y = 73;
        driverPicture.x = 4;
        nameTxt.x = 135;
        levelTxt.x = 135;
        nextLevelTxt.x = 95;
        //Event listeners
        driverContainer.on("dblclick", function (evt)
        {
            if (!this.gameOver)
            {
                var description = driverDoubleClickedEventHandler(driver);
                this.showEventMessage("Driver " + name + "<br> Level " + level, description, "#22B14C");
            }
        }.bind(this));
        driverContainer.addEventListener('click', function driverClicked(e)
        {
            if (this.driverSelected !== driver && !this.pause)
            {
                driverClickedEventHandler(driver);
            }
        }.bind(this));
        driverContainer.addChild(card, driverPicture, nameTxt, levelTxt, nextLevelTxt);
        return driverContainer;
    },
    setDriverLevelUpButtonContainer: function (levelUpButton, container, driver, unselectable)
    {
        lUbuttonContainer = new createjs.Container();
        var image = levelUpButton;
        lUbuttonContainer.y = container.y + 5;
        lUbuttonContainer.x = 165;
        lUbuttonContainer.addEventListener('click', function levelUpClicked(e)
        {
            if (!this.pause && !this.gameOver)
            {
                var levelUpTxt = this.driverContainer[driver - 1][0].getChildAt(4).text;
                if (unselectable)
                {
                    this.showEventMessage("Not yet!", "You cannot level up a driver who is currently on a task", '#22B14C');
                }
                else if (this.driverLevelUp[driver - 1] === false)
                {
                    this.showEventMessage("Not enough funds!", "To level up this driver requires at least £" + levelUpTxt, '#22B14C');
                }
                else
                {
                    createjs.Sound.play("driverLevelUp");
                    levelUpClickedEventHandler(driver);
                }
            }
        }.bind(this));
        lUbuttonContainer.addChild(image);
        return lUbuttonContainer;
    },
    setDriverSelected: function (driver)
    {
        driver = (driver - 1);
        var image = new createjs.Bitmap(queue.getResult("driverCardS"));
        var oldSelection = this.driverSelected;
        var driverPic = this.driverContainer[driver][0].getChildAt(1);
        var nameTxt = this.driverContainer[driver][0].getChildAt(2).text;
        var levelTxt = this.driverContainer[driver][0].getChildAt(3).text;
        var levelUp = this.driverContainer[driver][1].getChildAt(0);
        var levelUpTxt = this.driverContainer[driver][0].getChildAt(4).text;
        stage.removeChild(this.driverContainer[driver][0]);
        stage.removeChild(this.driverContainer[driver][1]);
        this.driverContainer[driver][0] = this.setDriverContainer(driver + 1, levelTxt, nameTxt, levelUpTxt, image, driverPic);
        this.driverContainer[driver][1] = this.setDriverLevelUpButtonContainer(levelUp, this.driverContainer[driver][0], driver + 1, false);
        stage.addChild(this.driverContainer[driver][0]);
        stage.addChild(this.driverContainer[driver][1]);
        //update old selection
        this.driverSelected = driver + 1;
        if (oldSelection !== 0)
        {
            oldSelection = (oldSelection - 1);
            var image = new createjs.Bitmap(queue.getResult("driverCard"));
            var driverPic = this.driverContainer[oldSelection][0].getChildAt(1);
            var nameTxt = this.driverContainer[oldSelection][0].getChildAt(2).text;
            var levelTxt = this.driverContainer[oldSelection][0].getChildAt(3).text;
            var levelUp = this.driverContainer[oldSelection][1].getChildAt(0);
            var levelUpTxt = this.driverContainer[oldSelection][0].getChildAt(4).text;
            stage.removeChild(this.driverContainer[oldSelection][0]);
            stage.removeChild(this.driverContainer[oldSelection][1]);
            this.driverContainer[oldSelection][0] = this.setDriverContainer(oldSelection + 1, levelTxt, nameTxt, levelUpTxt, image, driverPic);
            this.driverContainer[oldSelection][1] = this.setDriverLevelUpButtonContainer(levelUp, this.driverContainer[oldSelection][0], oldSelection + 1, false);
            stage.addChild(this.driverContainer[oldSelection][0]);
            stage.addChild(this.driverContainer[oldSelection][1]);
        }
    },
    showEventMessage: function (title, descriptionText, colour)
    {
        if (!this.gameOver || this.myIdIndex === 0)
        {
            var zindex = 400 + this.myIdIndex;
            var endGameMessage;
            if (this.myIdIndex !== 0 && colour === '#E06666')
            {
                createjs.Sound.play("eventSound").INTERRUPT_ANY;
            }
            else if (this.myIdIndex === 0)
            {
                zindex = 999;
                endGameMessage = "Game Over! Your Final Score Is: " + title;
                title = "Game Over!";
            }
            var myId = this.myIdIndex + "messageBox";
            if (this.myIdIndex !== 0)
            {
                this.myIdIndex++;
            }
            var newEventMessage = document.createElement('div');
            newEventMessage.className = 'messageBox';
            if (colour === '#22B14C')
            {
                newEventMessage.className = 'driverMessageBox';
            }
            newEventMessage.id = myId;
            newEventMessage.style.backgroundColor = colour;
            var newEventMessageHeader = document.createElement('h3');
            newEventMessageHeader.id = myId + 'eventMessageTitle';
            newEventMessageHeader.style.fontFamily = 'arial';
            var newEventMessageText = document.createElement('p');
            newEventMessageText.id = myId + 'eventMessage';
            //Ok button
            var okButton = document.createElement('div');
            okButton.id = myId + 'Button';
            okButton.style.backgroundColor = colour;
            okButton.className = "okButton";
            okButton.onclick = function hideEventMessage()
            {
                document.getElementsByTagName('body')[0].removeChild(newEventMessage);
                if (myId === 0 + "messageBox")
                {
                    displayStartScreen(endGameMessage, !this.mute);
                }
                stage.removeChild(desDOM);
            }.bind(this);
            var okButtonText = document.createElement('h2');
            okButtonText.innerHTML = "OK";
            document.getElementsByTagName('body')[0].appendChild(newEventMessage);
            document.getElementById(myId).appendChild(newEventMessageHeader);
            document.getElementById(myId).appendChild(newEventMessageText);
            document.getElementById(myId).appendChild(okButton);
            document.getElementById(myId + 'Button').appendChild(okButtonText);
            document.getElementById(myId + "eventMessageTitle").innerHTML = title;
            document.getElementById(myId + "eventMessage").innerHTML = descriptionText;
            var desDOM = new createjs.DOMElement(myId);
            desDOM.alpha = 0;
            desDOM.regX = 200;
            desDOM.x = stage.canvas.width / 2;
            stage.addChild(desDOM);
            document.getElementById(myId).style.display = 'block';
            createjs.Tween.get(desDOM).wait(100).to({y: 40, alpha: 1}, 1000,
                    createjs.Ease.quadOut);
            $('#' + myId).css('zIndex', zindex);
        }
    },
    animateTaskDrop: function (task)
    {
        if (!this.gameOver)
        {
            var taskContainerLength = 0;
            for (var x in this.taskContainer)
            {
                taskContainerLength++;
            }
            var taskTop = this.TASK_TOP[taskContainerLength];
            var taskCard = "taskCard";
            var newTask = this.setTaskContainer((taskContainerLength + 1), task.getParkingSlot(), task.getFuelRequired(), taskCard);
            this.taskContainer[task.getParkingSlot()] = {task: newTask, image: task.getAircraft(), position: taskContainerLength};
            newTask.y = -100;
            stage.addChild(newTask);
            this.drawMenuBar();
            function handleComplete() {//check you've actualy reached the bottom
                var newTaskContainerLength = 0;
                for (var x in this.taskContainer)
                {
                    newTaskContainerLength++;
                }
                if (newTaskContainerLength !== (taskContainerLength + 1))
                {
                    taskTop = this.TASK_TOP[newTaskContainerLength - 1];
                    //console.log("Resetting task position: NewtaskTop = " + taskTop);
                    createjs.Tween.get(newTask).to({y: taskTop}, 1000);
                }
            }
            createjs.Tween.get(newTask).to({y: taskTop}, 1000).call(handleComplete.bind(this)); //animate the drop
        }
    },
    setTaskContainer: function (task, slot, fuel, cardImage)
    {
        var slotText = this.convertArrayIndexToSlot(slot);
        var image = queue.getResult(cardImage);
        var mytaskContainer = new createjs.Container();
        var taskCard = new createjs.Bitmap(image);
        var slotTxt = new createjs.Text(slotText, "40px Lucida Console", this.TANKER_FONT_COLOUR);
        var fuelTxt = new createjs.Text(fuel, this.TASK_FONT, this.TANKER_FONT_COLOUR);
        mytaskContainer.y = this.TASK_TOP[task];
        mytaskContainer.x = 205;
        slotTxt.y = 85;
        slotTxt.x = 25;
        fuelTxt.y = 87;
        fuelTxt.x = 103;
        mytaskContainer.addEventListener('click', function taskClicked(e) {
            if (!this.pause)
            {
                taskCardClickedEventHandler(slot);
            }
        }.bind(this));
        mytaskContainer.addChild(taskCard, slotTxt, fuelTxt);
        return mytaskContainer;
    }
    ,
    setTaskSelected: function (slot)
    {
        var image;
        var oldSelection = this.taskSelected;
        var taskContainer = this.taskContainer[slot].task;
        var position = this.taskContainer[slot].position;
        var fuel = taskContainer.getChildAt(2).text;
        stage.removeChild(taskContainer); //Update the selected task
        image = "taskCardS";
        taskContainer = this.setTaskContainer(position, slot, fuel, image);
        this.taskContainer[slot].task = taskContainer;
        stage.addChild(taskContainer);
        //update old selection
        this.taskSelected = slot;
        if (oldSelection !== 0)
        {
            taskContainer = this.taskContainer[oldSelection].task;
            position = this.taskContainer[oldSelection].position;
            fuel = taskContainer.getChildAt(2).text;
            stage.removeChild(taskContainer);
            image = "taskCard";
            taskContainer = this.setTaskContainer(position, oldSelection, fuel, image);
            this.taskContainer[oldSelection].task = taskContainer;
            stage.addChild(taskContainer);
        }
    }
    ,
    removeTask: function (slot)
    {
        var taskContainer = this.taskContainer[slot].task;
        var deletedPosition = this.taskContainer[slot].position;
        stage.removeChild(taskContainer);
        delete this.taskContainer[slot];
        createjs.Sound.play("taskComplete");
        for (var i in this.taskContainer)
        {
            var value = this.taskContainer[i];
            var oldPosition = value['position'];
            if (oldPosition > deletedPosition)
            {
                this.taskContainer[i].position = (oldPosition - 1);
                var taskTop = this.TASK_TOP[oldPosition - 1];
                var taskImage = value['task'];
                createjs.Tween.get(taskImage).to({y: taskTop}, 500);
            }
        }
    }
    ,
    toggleJobUnselectable: function (unselectable, slot, tanker, driver)
    {
        if (this.gameOver)
        {
            unselectable = true;
        }
        var taskCardImage;
        var driverCardImage;
        if (slot !== 0)
        {
            var taskContainer = this.taskContainer[slot].task;
            var position = this.taskContainer[slot].position;
            var fuel = taskContainer.getChildAt(2).text;
            stage.removeChild(taskContainer);
        }
        var driverPic = this.driverContainer[driver - 1][0].getChildAt(1);
        var nameTxt = this.driverContainer[driver - 1][0].getChildAt(2).text;
        var levelTxt = this.driverContainer[driver - 1][0].getChildAt(3).text;
        var levelUp;
        var levelUpTxt = this.driverContainer[driver - 1][0].getChildAt(4).text;
        stage.removeChild(this.driverContainer[driver - 1][0]);
        stage.removeChild(this.driverContainer[driver - 1][1]);
        if (!unselectable)
        {
            //make selectable
            taskCardImage = "taskCard";
            driverCardImage = new createjs.Bitmap(queue.getResult("driverCard"));
            this.toggleTankerUnselectable(tanker, false);
            if (this.driverLevelUp[driver - 1] === false)
            {
                levelUp = new createjs.Bitmap(queue.getResult("levelUpButtonU"));
            } else
            {
                levelUp = new createjs.Bitmap(queue.getResult("levelUpButton"));
            }
        }
        else
        {
            //make unselectable
            taskCardImage = "taskCardU";
            driverCardImage = new createjs.Bitmap(queue.getResult("driverCardU"));
            this.toggleTankerUnselectable(tanker, true);
            levelUp = new createjs.Bitmap(queue.getResult("levelUpButtonU"));
        }
        if (this.taskSelected === slot && !unselectable)
        {
            this.taskSelected = 0;
            if (this.driverSelected === driver)
            {
                this.driverSelected = 0;
            }
        }
        if (unselectable)
        {
            this.taskSelected = 0;
            this.driverSelected = 0;
        }
        if (slot !== 0)
        {
            taskContainer = this.setTaskContainer(position, slot, fuel, taskCardImage);
            this.taskContainer[slot].task = taskContainer;
            stage.addChild(taskContainer);
        }
        this.driverContainer[driver - 1][0] = this.setDriverContainer(driver, levelTxt, nameTxt, levelUpTxt, driverCardImage, driverPic);
        this.driverContainer[driver - 1][1] = this.setDriverLevelUpButtonContainer(levelUp, this.driverContainer[driver - 1][0], driver, unselectable);
        stage.addChild(this.driverContainer[driver - 1][0]);
        stage.addChild(this.driverContainer[driver - 1][1]);
    },
    refuelJet: function (tanker, tankerFuel, slot, taskFuel)
    {
        if (!this.gameOver)
        {
            var taskContainer = this.taskContainer[slot].task;
            stage.removeChild(taskContainer);
            taskContainer.removeChildAt(2);
            var taskFuelTxt = new createjs.Text(taskFuel, this.TASK_FONT, this.TANKER_FONT_COLOUR);
            taskFuelTxt.y = 85;
            taskFuelTxt.x = 103;
            taskContainer.addChild(taskFuelTxt);
            if (taskFuel !== 0)
            {
                this.updateTankerFuel(tanker, tankerFuel, "#880015");
            }
            else
            {
                this.updateTankerFuel(tanker, tankerFuel, "#000000");
            }
            stage.addChild(taskContainer);
        }
    }
    ,
    animateTruckStart: function (fuel, jobDetails)
    {
        //    tanker, slot, fuel
        createjs.Sound.play("truckMove").setVolume(0.2);
        var tanker = jobDetails[1];
        var tankerRegX;
        var tankerRegY;
        switch (tanker) {
            case 1:
                tanker = "smallTanker";
                tankerRegX = 35;
                tankerRegY = 20;
                break;
            case 4:
                tanker = "largeTanker";
                tankerRegX = 50;
                tankerRegY = 40;
                break;
            default:
                tanker = "mediumTanker";
                tankerRegX = 50;
                tankerRegY = 20;
                break;
        }
        var tankerImage = new createjs.Sprite(this.tankerSpritesheet, tanker);
        tankerImage.x = 405;
        tankerImage.regX = tankerRegX;
        tankerImage.regY = tankerRegY;
        var slotIndex = jobDetails[0];
        if (slotIndex < 9)
        {
            tankerImage.y = 517;
        }
        else
        {
            tankerImage.y = 817;
            slotIndex = (slotIndex - 8);
        }
        var slotx = (this.slotX[slotIndex - 1]) + 2;
        if (jobDetails[1] in this.tankers)
        {
            delete this.tankers[jobDetails[1]];
        }
        this.tankers[jobDetails[1]] = {image: tankerImage};
        stage.addChild(tankerImage);
        createjs.Tween.get(tankerImage).to({x: slotx}, this.getDuration(tankerImage.x, slotx, 30), createjs.Ease.none).call(driveComplete);
        function driveComplete() {
            tankerImage.x = slotx;
            createjs.Tween.get(tankerImage).to({rotation: -90}, 800).call(turnComplete);
        }
        function turnComplete()
        {
            createjs.Tween.get(tankerImage).to({y: tankerImage.y - 70}, 800).call(maneuverComplete);
        }
        function maneuverComplete()
        {
            createjs.Tween.get(tankerImage).to({rotation: 0}, 1300).call(function finished() {
                updateJobView(fuel, jobDetails);
            });
        }
    }
    ,
    animateTankerLeaving: function (jobDetails, tankerFuel, taskFuelLeft, event)
    {
        if (!this.gameOver)
        {
            createjs.Sound.play("truckMove").setVolume(0.2);
            var value = this.tankers[jobDetails[1]];
            var tankerImage = value['image'];
            createjs.Tween.get(tankerImage).to({rotation: 90}, 800).call(turnOneComplete);
            function turnOneComplete()
            {
                createjs.Tween.get(tankerImage).to({y: tankerImage.y + 70}, 800).call(maneuverComplete);
            }
            function maneuverComplete()
            {
                createjs.Tween.get(tankerImage).to({rotation: 0}, 800).call(turnTwoComplete);
            }
            function turnTwoComplete()
            {
                createjs.Tween.get(tankerImage).to({x: 1200}, GameView.prototype.getDuration(tankerImage.x, 1200, 30), createjs.Ease.none).call(tankerGone);
            }
            function tankerGone()
            {
                stage.removeChild(tankerImage);
                if (event)
                {
                    randomEvent(jobDetails, tankerFuel, taskFuelLeft);
                }
                else
                {
                    refuelComplete(jobDetails, tankerFuel, taskFuelLeft);
                }
            }
        }
    }
    ,
    animateAircraftLand: function (task)
    {
        if (!this.gameOver)
        {
            if (task.getParkingSlot() in this.taskContainer)
            {
                delete this.taskContainer[task.getParkingSlot()];
            }
            var aircraftImage = task.getAircraft();
            var aircraftImage = new createjs.Sprite(this.aircraftSpritesheet, aircraftImage);
            aircraftImage.x = 405;
            aircraftImage.y = 100;
            task.setAircraft(aircraftImage);
            stage.addChild(aircraftImage);
            createjs.Tween.get(aircraftImage).to({x: 1200}, 2000).call(handleComplete.bind(this), [task]);
            function handleComplete(task) {
                stage.removeChild(aircraftImage);
                this.animateAircraftTaxi(task);
            }
            createjs.Sound.play("land");
        }
    }
    ,
    animateAircraftTaxi: function (task)
    {
        if (!this.gameOver)
        {
            var taxiSound = createjs.Sound.play("taxi").setVolume(0.1);
            var slot = task.getParkingSlot();
            var aircraftImage = task.getAircraft();
            aircraftImage.regX = 50;
            aircraftImage.regY = 40;
            aircraftImage.scaleX = -1;
            aircraftImage.x = 1300;
            if (slot < 9)
            {
                aircraftImage.y = 286;
            }
            else
            {
                aircraftImage.y = 586;
                slot = (slot - 8);
            }
            maneuverComplete.bind(this);
            var slotx = this.slotX[slot - 1];
            createjs.Tween.get(aircraftImage).to({x: slotx}, this.getDuration(aircraftImage.x, slotx, 30), createjs.Ease.none).call(taxiComplete.bind(this));
            function taxiComplete() {
                aircraftImage.x = slotx;
                createjs.Tween.get(aircraftImage).to({rotation: -90}, 800).call(turnComplete.bind(this));
            }
            function turnComplete()
            {
                createjs.Tween.get(aircraftImage).to({y: aircraftImage.y + 75}, 800).call(maneuverComplete.bind(this), [task]);
            }
            function maneuverComplete()
            {
                createjs.Tween.get(aircraftImage).to({rotation: 0}, 1300);
                startNextWaveTimer(); //next timer
                this.animateTaskDrop(task, taxiSound);
            }
            stage.addChild(aircraftImage);
        }
    }
    ,
    animateAircraftLeaving: function (slot)
    {
        var taxiSound = createjs.Sound.play("taxi").setVolume(0.1);
        var value = this.taskContainer[slot];
        var aircraftImage = value['image'];
        createjs.Tween.get(aircraftImage).to({rotation: 90}, 800).call(turnOneComplete);
        function turnOneComplete()
        {
            createjs.Tween.get(aircraftImage).to({y: aircraftImage.y - 75}, 800).call(maneuverComplete);
        }
        function maneuverComplete()
        {
            createjs.Tween.get(aircraftImage).to({rotation: 0}, 800).call(turnTwoComplete);
        }
        function turnTwoComplete()
        {
            createjs.Tween.get(aircraftImage).to({x: 405}, GameView.prototype.getDuration(aircraftImage.x, 405, 30), createjs.Ease.none).call(aircraftGone);
        }
        function aircraftGone()
        {
            stage.removeChild(aircraftImage);
        }
    }
    ,
    endGame: function (finalScore, jetsFueled, wave)
    {
        //unselectable, slot, tanker, driver
        var tankerDriver = 5;
        for (var slot in this.taskContainer)
        {
            if (tankerDriver !== 1)
            {
                tankerDriver--;
            }
            this.toggleJobUnselectable(true, slot, tankerDriver, tankerDriver);
        }
        if (tankerDriver !== 1)//not all drivers and tankers blanked out
        {
            for (var i = (tankerDriver - 1); i > 0; i--)
            {
                this.toggleJobUnselectable(true, 0, i, i);
            }
        }
        this.gameOver = true;
        this.myIdIndex = 0;
        this.showEventMessage(finalScore, "<strong>Final Score: </strong>" + finalScore +
                "<br><strong>Jets Refulled: </strong>" + jetsFueled +
                "<br><strong>Waves survived: </strong>" + wave +
                "<br>Better luck next time!", '#E06666');
    }
    ,
    updateScore: function (funds, score)
    {
        stage.removeChild(this.fundsDisplay);
        stage.removeChild(this.scoreDisplay);
        this.fundsDisplay = new createjs.Text(funds, this.TANKER_FONT, this.TANKER_FONT_COLOUR);
        this.scoreDisplay = new createjs.Text("Score:" + score, this.TANKER_FONT, this.TANKER_FONT_COLOUR);
        this.fundsDisplay.y = 60;
        this.fundsDisplay.x = 30;
        this.scoreDisplay.y = 0;
        this.scoreDisplay.x = 820;
        stage.addChild(this.fundsDisplay, this.scoreDisplay);
    }
    ,
    /**
     * Code to keep the tween at a constant rate, modified from Carl Schooff's code at:
     * http://www.snorkl.tv/2010/11/tweenlite-tweens-with-constant-speed-independent-of-distance-traveled/
     * @param {type} startX
     * @param {type} destinationX
     * @param {type} pixelsPerSecond
     * @returns {Number}
     */
    getDuration: function (startX, destinationX, pixelsPerSecond) {
        var duration = Math.abs((startX - destinationX) / pixelsPerSecond); //    console.log(startX + " / " + destinationX + " duration " + duration);
        return (duration * 100);
    },
    convertArrayIndexToSlot: function (slotCode)
    {
        var slot;
        if (slotCode < 9)
        {
            slot = "A" + slotCode;
        }
        else
        {
            slot = "B" + (slotCode - 8);
        }
        return slot;
    },
    pauseGame: function (pause)
    {
        this.pause = pause;
        this.drawMenuBar();
        createjs.Ticker.setPaused(pause);
    }
};
//EOF