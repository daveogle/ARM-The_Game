/*
 * Job Class
 */
function Job()
{
    this.jobCompletionProbability;
    this.inProgress = false;
    this.randomEvent = null;
    this.driver = 0;
    this.driverRank;
    this.task = 0;
    this.tanker = 0;
    this.score;
}

Job.prototype = {
    checkAllItemsSet: function ()
    {
        if (this.driver > 0 && this.task > 0 && this.tanker > 0)
        {
            this.inProgress = true;
            var jobRef = [this.tanker, this.driver, this.task];
            return jobRef;
        }
        return null;
    },
    getJobCompletionProbability: function ()
    {
        return this.jobCompletionProbability;
    },
    setJobCompletionProbability: function (jobCompletionProbability)
    {
        this.jobCompletionProbability = jobCompletionProbability;
    },
    getInProgess: function ()
    {
        return this.inProgress;
    },
    setInProgress: function (inProgress)
    {
        this.inProgress = inProgress;
    },
    getRandomEvent: function ()
    {
        return this.randomEvent;
    },
    setRandomEvent: function (randomEvent)
    {
        this.randomEvent = randomEvent;
    },
    getDriver: function ()
    {
        return this.driver;
    },
    setDriver: function (driver)
    {
        this.driver = driver;
    },
    getDriverRank: function ()
    {
        return this.driverRank;
    },
    setDriverRank: function (rank)
    {
        this.driverRank = rank;
    },
    getTanker: function ()
    {
        return this.tanker;
    },
    setTanker: function (tanker)
    {
        this.tanker = tanker;
    },
    getTask: function ()
    {
        return this.task;
    },
    setTask: function (task)
    {
        this.task = task;
    }
};
//EOF
