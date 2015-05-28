/* 
 * DriverPool Class
 */
function DriverPool()
{
    this.name = ["Bob", "Fred", "Sam", "Andy", "Dave", "Sally"];
    this.description = ["A hard working driver who always tries his best, Driver Bob  loves to refuel aircraft and his dream job is to work as an aircraft refueller driver. " +
"Driver Bob is from Sheffield and listens to Rush albums all the time. He has had several complaints from the " +
"pilots who say they can't hear their aircraft over the sound of Rush coming from Driver Bobs tanker. " +
"He enjoys cats, things made from steel,  Rush and all Rush related things.", 
                        "Often described as a happy-go-lucky idiot, Driver Fred is not the sharpest tool in the box. He became an aircraft refueller driver after failing his aptitude " +
"test for the Army. Driver Fred was once missing for two days after a misunderstanding where he was sent to the store room for a long weight and never came back. " +
"His hobbies include rock sniffing, counting to ten and football.", 
                        "Driver Sam is a sensitive person, easily startled by loud noises, aircraft and his own shadow. " +
"He once spent four hours hiding under his tanker after a smoke alarm went off until a co-worker coaxed him out with a chocolate bar. "+
"He is a good driver who could be better if only he wasn't  startled by each aircraft landing. " +
"Driver Sam enjoys sitting in a dark room listening to relaxing music.", 
                        "Driver Andy considers himself the coolest driver at the airbase. He has total self confidence in himself, " +
"which he uses to balance a total lack of ability.  Never seen without his sunglasses Driver Andy enjoys going to the gym, " +
"clubbing and admiring himself in a mirror.", 
                        "Driver Dave is an enthusiastic driver who has built a reputation for himself as the 'driver least likely to succeed'. Driver Dave rarely makes it through the " +
"day without at least one accident. Driver Dave became a aircraft refueller after tripping over his shoe laces and stumbling through the " +
"door of the recruitment office. He enjoys refuelling fast jets and not being in trouble. ", 
                        "Driver Sally is a competent driver when she can remember what she is supposed to be doing. " +
"She regularly forgets the way to the aircraft and what to do once she is there. " +
"She had a brief career as a singer in a band, but was dropped after regularly forgetting the words for the songs, " +
"when she remembered there was a gig at all. Driver Sally can't remember what her hobbies are but she hasn't time anyway as she is busy trying to remember what she came in the room for."];
    this.avatar = ["avatar1", "avatar2", "avatar3", "avatar4", "avatar5", "avatar6"];
    this.levelCost = [700, 1200, 2000, 3500, 5000, 8000, 10000, 15000, 20000, 50000]; 
    this.driverPool = new Array(4);
}

DriverPool.prototype = {
    constructor: DriverPool,
    generateDrivers: function ()
    {
        //Generate 4 random numbers
        var driverSelection = new Array();
        for (var i = 0; driverSelection.length < 4; i++)
        {
            var number = Math.floor((Math.random() * 6) + 1);
            if (driverSelection.indexOf(number - 1) < 0)
            {
                driverSelection.push(number - 1);
            }
        }
        //Add the drivers from the number list
        for (var i = 0; i < 4; i++)
        {
            this.driverPool[i] = new Driver(i, this.name[driverSelection[i]], this.description[driverSelection[i]], this.avatar[driverSelection[i]], this.levelCost[0]);
        }
    },
    getDriverPool: function ()
    {
        return this.driverPool;
    },
    isSelected: function (driver)
    {
        for (var i = 0; i < this.driverPool.length; i++)
        {
            this.driverPool[i].setSelected(false);
        }
        this.driverPool[(driver - 1)].setSelected(true);
    },
    setDriverLevelUp: function (driver, funds)
    {
        if (this.driverPool[driver].getNextLevelCost() <= funds && !this.driverPool[driver].getBusy())
        {
            this.driverPool[driver].setCanLevelUp(true);
        }
        else
        {
            this.driverPool[driver].setCanLevelUp(false);
        }
    },
    getDriver: function (driver)
    {
        return this.driverPool[driver];
    },
    levelUp: function (driver)
    {
        var thisLevelCost = this.levelCost[this.driverPool[driver].getCurrentLevel() - 1];
        this.driverPool[driver].setNextLevel();
        this.driverPool[driver].setNextLevelCost(this.levelCost[this.driverPool[driver].getCurrentLevel() - 1]);
        return thisLevelCost;
    }
};
//EOF
