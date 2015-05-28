/* 
 * JobFacade Class
 */
function JobFacade()
{
    this.eventFactory = new EventFactory;
    this.jobList = new Array();
}
;
JobFacade.prototype.startJob = function (event, rank, max)
{
    this.jobList[this.jobList.length - 1].setInProgress(true);
    var target = this.randomEventCalculator(rank, max);
    if (event)//if an event already happended or no event needed
    {
        target = 99999;
    }
    console.log("target amended = " + target);
    this.jobList[this.jobList.length - 1].setRandomEvent(this.eventFactory.getRandomEvent(target));
    return true;//only one attempt at a random event per task
};

JobFacade.prototype.newJob = function ()
{
    var job = new Job();
    this.jobList.push(job);
};

JobFacade.prototype.randomEventCalculator = function (rank, maxTaskFuel)
{
    var probability = this.calculateProbablity(rank);
    //remove probability % from max fuel
    //console.log("probability = " + probability);
    var target = Math.round(maxTaskFuel - ((probability / 100) * maxTaskFuel));
    return target;
};

JobFacade.prototype.stopJob = function (slot)
{
    var job = this.getJob(slot);
    this.jobList.splice(job, 1);//Remove the job
};

JobFacade.prototype.calculateProbablity = function (rank)
{
    var weight = 10;//how much the rank influences the outcome 10 = rank 1
    weight = weight + (8 * (rank - 1)); //1 = 10 : 10 = 82;
    //console.log("Weight = " + weight);
    var min = 1;
    if (rank <= 5)
    {
        min = 60 - (rank * 10);
    }
    var randomNumber = Math.floor((Math.random() * (100 - min)) + 1);
    randomNumber = randomNumber + min;
    var probability = randomNumber - weight;
    if (probability < 0)
    {
        probability = 0;
    }
    return probability; //return a probability between 0 and 100
};

JobFacade.prototype.setDriver = function (driver)
{
    this.jobList[this.jobList.length - 1].setDriver(driver);
    return this.jobList[this.jobList.length - 1].checkAllItemsSet();
};

JobFacade.prototype.setTanker = function (tanker)
{
    this.jobList[this.jobList.length - 1].setTanker(tanker);
    return this.jobList[this.jobList.length - 1].checkAllItemsSet();
};

JobFacade.prototype.setTask = function (task)
{
    this.jobList[this.jobList.length - 1].setTask(task);
    return this.jobList[this.jobList.length - 1].checkAllItemsSet();
};

JobFacade.prototype.getEvent = function (slot)
{
    var job = this.getJob(slot);
    var event = this.jobList[job].getRandomEvent();
    return event;
};

JobFacade.prototype.calculateScore = function (time, level)
{
    var score = Math.round((time / 10) * level);
    return score;
};

JobFacade.prototype.removeTanker = function (tanker)
{
    this.jobList[this.jobList.length - 1].setTanker(0);
};

JobFacade.prototype.unstartedJob = function ()
{
    if (this.jobList.length > 0)
    {
        if (!this.jobList[this.jobList.length - 1].getInProgess())//if there is a job that is not in progress
        {
            return true;
        }
    }
    return false;
};

JobFacade.prototype.checkInProgress = function (job)
{

};

JobFacade.prototype.setRandomEvent = function (job)
{

};

JobFacade.prototype.setTimer = function (job)
{

};

JobFacade.prototype.getJob = function (slot)
{
    var job;
    for (var i = 0; i < this.jobList.length; i++)
    {
        if (this.jobList[i].getTask() === slot)
        {
            job = i;
        }
    }
    return job;
};

JobFacade.prototype.getLatestJobDetails = function ()
{
    var task = this.jobList[this.jobList.length - 1].getTask();
    var tanker = this.jobList[this.jobList.length - 1].getTanker();
    var driver = this.jobList[this.jobList.length - 1].getDriver();
    var trio = [task, tanker, driver];
    return trio;
};
//EOF
