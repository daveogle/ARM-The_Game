/*
 * Event Class
 */

function Event(eventType, description, targetTime)
{
    this.targetTime = targetTime;
    this.eventType = eventType; // 0 = soft; 1 = hard; 2 = positive
    this.description = description;
}

Event.prototype = {
    getTargetTime: function ()
    {
        return this.targetTime;
    },
    setTargetTime: function (time)
    {
        this.targetTime = time;
    },
    getEventType: function ()
    {
        return this.eventType;
    },
    setEventType: function (eventType)
    {
        this.eventType = eventType;
    },
    getDescription: function ()
    {
        return this.description;
    },
    setDescription: function (description)
    {
        this.description = description;
    }
};
//EOF