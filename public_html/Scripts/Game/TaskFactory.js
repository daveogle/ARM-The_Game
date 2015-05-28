/* 
 * TaskFactory Class
 */

function TaskFactory()
{
    this.aircaftSlots = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    this.aircraft = ["aircraft1", "aircraft2", "aircraft3", "aircraft4"];
    this.counter = 1;
}
;

TaskFactory.prototype = {
    constructor: TaskFactory,
    fuelNeededGenerator: function (max, level)
    {
        var min = 130 + (70 * level);
        if (this.counter === 4)
        {
            max = 1000;
            this.counter = 1;
        }
        //random fuel ammount between 200 and 10,000; increase by 600 each level
        var fuel;
        fuel = Math.floor((Math.random() * (max - min)/*9800*/) + 1);
        fuel = fuel + min;
        this.counter++;
        return fuel;
    },
    slotGenerator: function ()
    {
        var slot;
        do {
            slot = Math.floor((Math.random() * 16) + 1);
        } while (this.aircaftSlots[slot - 1]);
        this.aircaftSlots[slot - 1] = true;
        return slot;
    },
    createTask: function (max, level)
    {
        var slot = this.slotGenerator();
        var aircraft = this.aircraft[Math.floor(Math.random() * 4)];
        var fuel = this.fuelNeededGenerator(max, level);
        var task = new Task(slot, fuel, aircraft);
        return task;
    },
    isInUse: function (slot, inUse)
    {
        if (!inUse)
        {
            this.aircaftSlots[slot - 1] = false;
        }
        else
        {
            this.aircaftSlots[slot - 1] = true;
        }
    }
};
//EOF
