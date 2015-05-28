/* 
 * Game Controller class
 */
var model;
var gameView;
var gameOver;
var pause;
var waveTimer;
var tankerTimer;
var interval;
var counter;
var storePauseJobs;
var storePauseBulk;

function startNewGame(canvas, stage, queue, mute)
{
    this.storePauseJobs = new Array();
    this.storePauseBulk = new Array();
    this.intervalStoppedAt = 0;
    this.gameOver = false;
    this.pause = false;
    this.gameView = new GameView(canvas, stage, queue, mute);
    this.model = new GameModel();
    this.model.newGame();
    this.gameView.buildBackground();
    this.gameView.setTankerPool();
    this.gameView.drawDriverPool();
    this.gameView.displayLevel(1);
    this.interval = this.model.getWaveTimings();
    this.counter = -1;
    this.waveTimer = new Worker("Scripts/Game/WaveCountDownTimerWebWorker.js");
    var tankerTimer1 = new Worker("Scripts/Game/CountDownTimerWebWorker.js");
    var tankerTimer2 = new Worker("Scripts/Game/CountDownTimerWebWorker.js");
    var tankerTimer3 = new Worker("Scripts/Game/CountDownTimerWebWorker.js");
    var tankerTimer4 = new Worker("Scripts/Game/CountDownTimerWebWorker.js");
    this.tankerTimer = [tankerTimer1, tankerTimer2, tankerTimer3, tankerTimer4];
    startWaveTimer(2000);
}

function startNextWaveTimer()
{
    //if all tasks have been dropped this wave
    //console.log("Counter = " + this.counter + " Interval Length = " + this.interval.length);
    //check end of game
    var endGameScore = this.model.checkEndGame();
    if (endGameScore !== -1)
    {
        var jetsFueled = this.model.getJetsRefuelled();
        var wave = this.model.getWave();
        this.gameView.endGame(endGameScore, jetsFueled, wave);
    }
    else
    {
        if (this.counter === this.interval.length - 1)
        {
            var level = this.model.levelUp();
            var score = this.model.getFinalScore();
            var funds = this.model.getFunds();
            this.gameView.updateScore(funds, score);
            this.interval = this.model.getWaveTimings();
            this.counter = 0;
            this.gameView.displayLevel(level);
        }
        startWaveTimer(interval[this.counter]);//set next timer up
        //console.log(interval[counter]);
    }
}

function startWaveTimer(time)
{
//    console.log("Time is " + time);
//    console.log("Counter = " + counter);
    //interval = an array holding the timings for dropping tasks for this wave.
    this.waveTimer.postMessage(time);
    this.waveTimer.onmessage = function (event) {
        if (pause)
        {
            if (!isNaN(event.data))
            {
//                console.log("stopped at " + event.data);
                intervalStoppedAt = event.data;
                counter--;
            }
        }
        else if (gameOver)//drop a task
        {
            waveTimer.terminate();
        }
        else
        {
            var task = model.dropNewTask();
            if (task.getFuelRequired === 0)//GAME OVER MAN, GAME OVER!
            {
                gameOver = true;
                gameView.animateAircraftLand(task);
                waveTimer.terminate();
            }
            else
            {
                gameView.animateAircraftLand(task);
            }
        }
    };
    this.counter = this.counter + 1;//tick off an interval
}

function updateTankers()
{
    var tankerFuel = this.model.getTankerFuel();
    return tankerFuel;
}

function getNewDrivers()
{
    var driverPool = this.model.getAllDrivers();
    return driverPool;
}

function taskCardClickedEventHandler(slot)
{
    var taskValid = this.model.validateTaskNumber(slot); //convert the slot to a task number and check not selected
    if (taskValid)//task not already selected or busy
    {
        var fuel = this.model.taskClicked(slot);
        this.gameView.setTaskSelected(slot);
        if (fuel !== null)//if the fuel values for a started task have been set
        {
            startJob(fuel);
        }
    }
}

function tankerClickedEventHandler(tanker)
{
    if (!(this.model.getTanker(tanker).getBusy()) && !(this.model.getTanker(tanker).getSelected()))
    {
        var fuel = this.model.tankerClicked(tanker);
        this.gameView.setTankerSelected(tanker);
        if (fuel !== null)
        {
            startJob(fuel);
        }
    }
}

function driverClickedEventHandler(driver)
{
    if (!(this.model.getDriver(driver).getBusy()) && !(this.model.getDriver(driver).getSelected()))
    {
        var fuel = this.model.driverClicked(driver);
        this.gameView.setDriverSelected(driver);
        if (fuel !== null)
        {
            startJob(fuel);
        }
    }
}

function driverDoubleClickedEventHandler(driver)
{
    return model.getDriverDescription(driver);
}

function startJob(fuel) //fuel = {truck fuel, task fuel}
{
    var jobDetails = this.model.getLatestJobDetails();//jobDetails = {task, tanker, driver} numbers
    if (fuel[0] === 0)
    {
        this.gameView.showEventMessage("Time to bulk!", "This Tanker is empty and can't be used for refueling until it has been sent to Bulk", '#FFC90E');
        this.model.setTaskBusy(jobDetails[0], false);
        this.model.getTanker(jobDetails[1]).setBusy(false);
        this.model.getDriver(jobDetails[2]).setBusy(false);
        this.gameView.toggleJobUnselectable(false, jobDetails[0], jobDetails[1], jobDetails[2]);
        this.model.endJob(jobDetails[0], fuel[1], 0);
    }
    else
    {
        this.model.setTaskBusy(jobDetails[0], true);
        this.model.getTanker(jobDetails[1]).setBusy(true);
        this.model.getDriver(jobDetails[2]).setBusy(true);
        this.gameView.toggleJobUnselectable(true, jobDetails[0], jobDetails[1], jobDetails[2]);
        this.gameView.animateTruckStart(fuel, jobDetails);
    }
}

function updateJobView(fuel, jobDetails)
{
    var taskEventTime = this.model.getEvent(jobDetails[0]).getTargetTime();
    var eventDescription = this.model.getEvent(jobDetails[0]).getDescription();
    var eventType = this.model.getEvent(jobDetails[0]).getEventType();
    var fuelNeeded = fuel[1];
    this.tankerTimer[jobDetails[1] - 1].postMessage((fuel[1] * 10) + 500);
    this.tankerTimer[jobDetails[1] - 1].onmessage = function (event) {
        if (pause)
        {
            var pausedJob = [fuel, jobDetails];
            storePauseJobs.push(pausedJob);
            tankerTimer[jobDetails[1] - 1].postMessage("stop");
        }
        else
        {
            fuel[1] = fuel[1] - 10;
            fuel[0] = fuel[0] - 10;
            if (fuel[1] < 10)//Round off
            {
                fuel[1] = 0;
            }
            if (fuel[0] < 10)
            {
                fuel[0] = 0;
            }
            //UPDATE THE JOB VIEW 
            gameView.refuelJet(jobDetails[1], fuel[0], jobDetails[0], fuel[1]);
            if (fuel[0] === 0 || fuel[1] === 0)//Job Complete
            {
                tankerTimer[jobDetails[1] - 1].postMessage("stop");
                gameView.animateTankerLeaving(jobDetails, fuel[0], fuel[1], false);
            }
            if (fuel[1] < taskEventTime && fuelNeeded >= taskEventTime)//if event has happened
            {
                tankerTimer[jobDetails[1] - 1].postMessage("stop");
                if (eventType === 2)
                {
                    fuel[1] = 0;
                    var slot = gameView.convertArrayIndexToSlot(jobDetails[0]);
                    gameView.animateTankerLeaving(jobDetails, fuel[0], fuel[1], false);
                    gameView.showEventMessage("Good News!", "The aircraft at slot " + slot + " did not need all the fuel it asked for, your driver gets to come back early!", '#22B14C');
                    createjs.Sound.play("bonus");
                }
                else
                {
                    gameView.animateTankerLeaving(jobDetails, fuel[0], fuel[1], true);
                    gameView.showEventMessage("Oh no!", eventDescription, '#E06666');
                }
            }
        }
    };
}

function refuelComplete(jobDetails, tankerFuel, taskFuelLeft)//also handles empty tanker
{
    if (!this.gameOver)
    {
        this.model.setTaskBusy(jobDetails[0], false);
        this.model.getTanker(jobDetails[1]).setBusy(false);
        this.model.getDriver(jobDetails[2]).setBusy(false);
        this.gameView.toggleJobUnselectable(false, jobDetails[0], jobDetails[1], jobDetails[2]);
        if (taskFuelLeft === 0)//refuel complete
        {
            this.gameView.animateAircraftLeaving(jobDetails[0]);
            var funds = this.model.endJob(jobDetails[0], taskFuelLeft);
            this.gameView.removeTask(jobDetails[0]);
            var reward = this.model.checkJetFueledReward();
            if (reward !== 0)
            {
                var jetNumber = this.model.getJetsRefuelled();
                if (jetNumber === 1)
                {
                    jetNumber = "your first";
                }
                this.gameView.showEventMessage("Congratulations!", "You have refuelled " + jetNumber + " aircraft and earned a cash bonus of £" + reward, '#22B14C');
                createjs.Sound.play("bonus");
            }
            var score = this.model.getFinalScore();
            this.gameView.updateScore((funds + reward), score);
        }
    }
    else
    {
        this.model.endJob(jobDetails[0], taskFuelLeft);
    }
    this.model.getTanker(jobDetails[1]).setFuelLevel(tankerFuel);
    updateDrivers();
}

function randomEvent(jobDetails, tankerFuel, taskFuelLeft)
{
    this.model.setTaskBusy(jobDetails[0], false);
    this.model.getTanker(jobDetails[1]).setBusy(false);
    this.model.getDriver(jobDetails[2]).setBusy(false);
    this.gameView.toggleJobUnselectable(false, jobDetails[0], jobDetails[1], jobDetails[2]);
    var event = this.model.getEvent(jobDetails[0]);
    this.model.endJob(jobDetails[0], taskFuelLeft);
    var eventType = event.getEventType();
    if (eventType === 1)//Hard
    {
        tankerFuel = 0;
        this.gameView.refuelJet(jobDetails[1], tankerFuel, jobDetails[0], taskFuelLeft);
    }
    this.model.getTanker(jobDetails[1]).setFuelLevel(tankerFuel);
}

function bulkClickedEventHander(tankerNumber)
{
    var tanker = this.model.getTanker(tankerNumber);
    if (!(tanker.getBusy()))
    {
        var fuel = tanker.getFuelLevel();
        var needed = tanker.getMaxLevel();
        if (this.gameView.bulkTanker(tankerNumber, fuel, needed))
        {
            this.model.sendToBulk(tankerNumber);
            this.bulkTankerUpdate(tankerNumber, fuel, needed);
        }
    }
}

function bulkTankerUpdate(tanker, fuel, needed)
{
    this.tankerTimer[tanker - 1].postMessage(((needed - fuel) + 500) * 10);
    this.tankerTimer[tanker - 1].onmessage = function (event) {
        if (pause)
        {
            var pausedBulk = [tanker, fuel, needed];
            storePauseBulk.push(pausedBulk);
            tankerTimer[tanker - 1].postMessage("stop");
        }
        fuel = (fuel + 10);
        if (fuel >= needed)
        {
            fuel = needed;
            gameView.updateTankerFuel(tanker, fuel, "#000000");
            tankerTimer[tanker - 1].postMessage("stop");
            model.bulkTanker(tanker);
            gameView.toggleTankerUnselectable(tanker, false);
        }
        else
        {
            gameView.updateTankerFuel(tanker, fuel, "#003D00");
        }
    };
}

function levelUpClickedEventHandler(driver)
{
    var funds = this.model.levelUpDriver(driver);
    var reward = this.model.checkDriverLevelReward();
    if (reward !== 0)
    {
        this.gameView.showEventMessage("Congratulations!", "You have trained all your drivers to level " + this.model.getDriver(1).getCurrentLevel() + " and earned a cash bonus of £" + reward, '#22B14C');
        createjs.Sound.play("bonus");
    }
    updateDrivers();
    var score = this.model.getFinalScore();
    this.gameView.updateScore((funds + reward), score);
}

//update all drivers
function updateDrivers()
{
    if (!this.gameOver)
    {
        for (var driverNum = 1; driverNum < 5; driverNum++)
        {
            var driver = this.model.checkLevelUp(driverNum);
            this.gameView.updateDriverCard(driverNum, driver.getCurrentLevel(), driver.getNextLevelCost(), driver.getCanLevelUp());
        }
    }
}

function quit()
{
    this.waveTimer.terminate();
    for (var i = 0; i < 4; i++)
    {
        this.tankerTimer[i].terminate();
    }
    var jetsFueled = this.model.getJetsRefuelled();
    var wave = this.model.getWave();
    var endGameScore = this.model.getFinalScore();
    this.gameView.endGame(endGameScore, jetsFueled, wave);
    this.gameOver = true;
    delete this.gameView;
    delete this.model;
}

function pauseGame(pause)
{
    if (pause)
    {
        this.pause = true;
        createjs.Sound.stop();
        this.waveTimer.postMessage("stop");
    }
    else
    {
        this.pause = false;
        for (var i in this.storePauseJobs)
        {
            var job = this.storePauseJobs[i];
            updateJobView(job[0], job[1]);
        }
        this.storePauseJobs = new Array();
        for (var i in this.storePauseBulk)
        {
            var bulk = this.storePauseBulk[i];
            bulkTankerUpdate(bulk[0], bulk[1], bulk[2]);
        }
        this.storePauseBulk = new Array();
        if (this.intervalStoppedAt !== 0)
        {
            startWaveTimer(this.intervalStoppedAt);
            this.intervalStoppedAt = 0;
        }
    }
    this.gameView.pauseGame(pause);//stop the ticker
}
//EOF
