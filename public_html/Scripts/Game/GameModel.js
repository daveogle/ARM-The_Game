/* 
 * Game Model Class
 */
function GameModel()
{
    this.score = 0;
    this.wave = 1;
    this.funds = 0;
    this.tankerPool = new TankerPool(4);
    this.driverPool = new DriverPool();
    this.taskFactory = new TaskFactory();
    this.taskChute = new Array();
    this.jobFacade = new JobFacade();
    this.maxTaskFuel = 1500 + (this.wave * 150);
    this.jetsRefuelled = 0;
    this.driverRewardReached = 0;
}

GameModel.prototype.dropNewTask = function ()
{
    var task = this.taskFactory.createTask(this.maxTaskFuel, this.wave);
    this.taskChute.push(task);
    return task;
};

GameModel.prototype.checkEndGame = function ()
{
    if (this.taskChute.length === 7)
    {
        return this.getFinalScore();
    }
    return -1;
};

GameModel.prototype.getFinalScore = function ()
{
    var totalLevel = 0;
    for (var driver = 1; driver < 5; driver++)
    {
        totalLevel = (totalLevel + (this.driverPool.getDriver(driver - 1).getCurrentLevel() * 100));//100 points for every driver for every level
    }
    //Final score = current wave * 10, to the power of 2, times the total of all driver levels, plus the money saved
    totalLevel = (totalLevel + (this.jetsRefuelled * (50 * this.wave)));//50 points for each jet refuelled * level
    var finalScore = totalLevel + (this.wave * 1000);
    if (finalScore === 1400)
    {
        finalScore = 0;
    }
    return finalScore;
};

GameModel.prototype.validateTaskNumber = function (slot)
{
    var taskNumber = this.getTaskArrayNumber(slot);
    if (this.taskChute[taskNumber].getSelected() || this.taskChute[taskNumber].getBusy())
    {
        return false; //return 0 if the task is selected already
    }
    return true;
};

GameModel.prototype.getTaskArrayNumber = function (slot)
{
    for (var i = 0; i < this.taskChute.length; i++)
    {
        if (this.taskChute[i].getParkingSlot() === slot)
        {
            return i;
        }
    }
};

GameModel.prototype.getLatestJobDetails = function ()
{
    var trio = this.jobFacade.getLatestJobDetails();
    return trio;
};

GameModel.prototype.endJob = function (slot, fuelLeft)
{
    var newScore = 0;
    var task = this.getTaskArrayNumber(slot);
    this.jobFacade.stopJob(slot);
    if (fuelLeft !== 0)
    {
        this.taskChute[task].setFuelRequired(fuelLeft);
    }
    else
    {
        newScore = this.jobFacade.calculateScore(this.taskChute[task].getTotalFuel(), this.wave);
        this.taskChute.splice(task, 1);
        this.taskFactory.isInUse(slot, false);
        this.jetsRefuelled++;
        this.score = this.getFinalScore();
    }
    this.funds = this.funds + newScore;
    return this.funds;
};
GameModel.prototype.getJetsRefuelled = function ()
{
    return this.jetsRefuelled;
};
/**
 * A function to check if the player is due an award for refuelling jets
 * 
 * @returns the reward for the player
 */
GameModel.prototype.checkJetFueledReward = function ()
{
    var reward = 0;
    switch (this.jetsRefuelled)
    {
        case 1:
            reward = 500;
            break;
        case 10:
            reward = 2000;
            break;
        case 30:
            reward = 5000;
            break;
        case 50:
            reward = 10000;
            break;
        case 75:
            reward = 25000;
            break;
        case 100:
            reward = 30000;
            break;
        case 200:
            reward = 50000;
            break;
    }
    this.funds = this.funds + reward;
    return reward;
};

GameModel.prototype.checkDriverLevelReward = function ()
{
    var min = this.driverPool.getDriver(0).getCurrentLevel();
    for (var i = 1; i < 4; i++)
    {
        if (this.driverPool.getDriver(i).getCurrentLevel() < min)
        {
            min = this.driverPool.getDriver(i).getCurrentLevel();
        }
    }
    var reward = 0;
    if (min > this.driverRewardReached)
    {
        switch (min)
        {
            case 2:
                reward = 1000;
                this.driverRewardReached = 2;
                break;
            case 4:
                reward = 3000;
                this.driverRewardReached = 4;
                break;
            case 6:
                reward = 5000;
                this.driverRewardReached = 6;
                break;
            case 8:
                reward = 10000;
                this.driverRewardReached = 8;
                break;
            case 10:
                reward = 25000;
                this.driverRewardReached = 10;
                break;
        }
        this.funds = this.funds + reward;
    }
    return reward;
};

GameModel.prototype.getEvent = function (slot)
{
    var event = this.jobFacade.getEvent(slot);
    return event;
};

GameModel.prototype.newGame = function ()
{
    this.tankerPool.generateTankers();
    this.driverPool.generateDrivers();
};

GameModel.prototype.getTankerFuel = function ()
{
    var tankerFuel = new Array(4);
    tankerFuel = this.tankerPool.getAllLevels();
    return tankerFuel;
};

GameModel.prototype.getAllDrivers = function ()
{
    var driverPool = this.driverPool.getDriverPool();
    return driverPool;
};

GameModel.prototype.getDriverDescription = function (driver)
{
    return this.driverPool.getDriver(driver - 1).getDescription();
};

GameModel.prototype.getWave = function ()
{
    return this.wave;
};

GameModel.prototype.getWaveTimings = function ()
{
    var aircraftPerWave = 7;
    var waveNumber = this.wave;
    if ((waveNumber % 2) !== 0)
    {
        waveNumber = waveNumber - 1;
    }
    aircraftPerWave = aircraftPerWave + (waveNumber / 2);
    //console.log("Aircraft in wave = " + aircraftPerWave);
    var intervalStart = 20000;
    var rFactor = 0.96 - (this.wave / 100);//shave 0.01 of the reduction factor each wave
    //console.log("Reduction factor = " + rFactor);
    var reduceInterval = false;
    //Set up the wave length and the start interval for each wave
    if (this.wave !== 1)//Except for the first wave
    {
        if ((this.wave % 3) === 0) //every third wave
        {
            intervalStart = intervalStart - (850 * (this.wave - 1));//dont change the interval lengths
        }
        else
        {
            intervalStart = intervalStart - (850 * this.wave);
        }
    }
    //Set up the intervals for the wave
    if (intervalStart < 0)
    {
        intervalStart = 0;
    }
    var interval = [intervalStart];
    var i = 0;
    while (i < aircraftPerWave)
    {
        var newInterval;
        if (reduceInterval)//every other interval
        {
            newInterval = Math.round(interval[interval.length - 1] * rFactor);
            reduceInterval = false;
        }
        else
        {
            newInterval = interval[interval.length - 1];
            rFactor = rFactor - 0.02;
            reduceInterval = true;
        }
        if (newInterval < 0)
        {
            newInterval = 0;
        }
        interval.push(newInterval);
        i++;
    }
//    for (var j = 0; j < interval.length; j++)
//    {
//        console.log(": Interval " + j + " = " + interval[j]);
//    }
    return interval;
};

GameModel.prototype.taskClicked = function (slot)//Task is the position in the array
{
    //Set the task and only the task to be selected
    for (var i = 0; i < this.taskChute.length; i++)
    {
        this.taskChute[i].setSelected(false);
    }
    var task = this.getTaskArrayNumber(slot);
    this.taskChute[task].setSelected(true);

    if (this.jobFacade.unstartedJob())//if there is an unstarted job
    {
        var jobRef = this.jobFacade.setTask(slot);
        if (jobRef !== null)//if there are now no unstarted jobs the job must have been started.
        {
            var truckFuel = this.tankerPool.getTanker(jobRef[0] - 1).getFuelLevel();
            var rank = this.driverPool.getDriver(jobRef[1] - 1).getCurrentLevel();
            var taskFuel = this.taskChute[task].getFuelRequired();
            var event = this.taskChute[task].getEventHappened();
            this.taskChute[task].setEventHappened(this.jobFacade.startJob(event, rank, this.maxTaskFuel));
            var fuel = [truckFuel, taskFuel];
            return fuel;
        }
    }
    else
    {
        this.jobFacade.newJob();
        this.jobFacade.setTask(slot);
    }
    return null;
};

GameModel.prototype.driverClicked = function (driver)
{
    this.driverPool.isSelected(driver);
    if (this.jobFacade.unstartedJob())//if there is an unstarted job
    {
        var jobRef = this.jobFacade.setDriver(driver);
        if (jobRef !== null)//if there are now no unstarted jobs the job must have been started.
        {
            var task = this.getTaskArrayNumber(jobRef[2]);
            var rank = this.driverPool.getDriver(driver - 1).getCurrentLevel();
            var truckFuel = this.tankerPool.getTanker(jobRef[0] - 1).getFuelLevel();
            var taskFuel = this.taskChute[task].getFuelRequired();
            var event = this.taskChute[task].getEventHappened();
            this.taskChute[task].setEventHappened(this.jobFacade.startJob(event, rank, this.maxTaskFuel));
            var fuel = [truckFuel, taskFuel];
            return fuel;
        }
    }
    else
    {
        this.jobFacade.newJob();
        this.jobFacade.setDriver(driver);
    }
    return null;
};

GameModel.prototype.tankerClicked = function (tanker)
{
    this.tankerPool.isSelected(tanker);
    if (this.jobFacade.unstartedJob())//if there is an unstarted job
    {
        var jobRef = this.jobFacade.setTanker(tanker);
        if (jobRef !== null)//if there are now no unstarted jobs the job must have been started.
        {
            var task = this.getTaskArrayNumber(jobRef[2]);
            var truckFuel = this.tankerPool.getTanker(jobRef[0] - 1).getFuelLevel();
            var rank = this.driverPool.getDriver(jobRef[1] - 1).getCurrentLevel();
            var taskFuel = this.taskChute[task].getFuelRequired();
            var event = this.taskChute[task].getEventHappened();
            this.taskChute[task].setEventHappened(this.jobFacade.startJob(event, rank, this.maxTaskFuel));
            var fuel = [truckFuel, taskFuel];
            return fuel;
        }
    }
    else
    {
        this.jobFacade.newJob();
        this.jobFacade.setTanker(tanker);
    }
    return null;
};

GameModel.prototype.getFunds = function ()
{
    return this.funds;
};

GameModel.prototype.setScore = function (score)
{
    this.score = score;
};

GameModel.prototype.levelUp = function ()
{
    this.wave++;
    //console.log("LEVEL: " + this.wave);
    this.maxTaskFuel = 1200 + (this.wave * 150);
    return this.wave;
};

GameModel.prototype.checkLevelUp = function (driver)
{
    this.driverPool.setDriverLevelUp(driver - 1, this.funds);
    return this.driverPool.getDriver(driver - 1);
};

GameModel.prototype.getTanker = function (tanker)
{
    var newTanker = this.tankerPool.getTanker(tanker - 1);
    return newTanker;
};

GameModel.prototype.getTask = function (slot)
{
    var newTask = this.taskChute[this.getTaskArrayNumber(slot)];
    return newTask;
};

GameModel.prototype.setTaskBusy = function (slot, busy)
{
    this.taskChute[this.getTaskArrayNumber(slot)].setBusy(busy);
};

GameModel.prototype.getDriver = function (driver)
{
    var newDriver = this.driverPool.getDriver(driver - 1);
    return newDriver;
};

GameModel.prototype.bulkTanker = function (tanker)
{
    this.tankerPool.bulkTanker(tanker - 1);
    this.tankerPool.getTanker(tanker - 1).setBusy(false);
};

GameModel.prototype.sendToBulk = function (tanker)
{
    this.jobFacade.removeTanker(tanker);
    this.tankerPool.getTanker(tanker - 1).setBusy(true);
    this.tankerPool.getTanker(tanker - 1).setSelected(false);
};

GameModel.prototype.levelUpDriver = function (driver)
{
    var nextLevelCost = this.driverPool.levelUp(driver - 1);
    this.funds = (this.funds - nextLevelCost);
    return this.funds;
};
//EOF
