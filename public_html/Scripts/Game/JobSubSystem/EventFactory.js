/* 
 * Event Factory Class
 */

function EventFactory()
{
    this.description = ["Your driver forgot to go to the loo before going on task and has had to return to Tanker Pool in a hurry!",
        "The Aircraft has sprung a leak. The refuel will have to wait until the mess is mopped up.",
        "Your driver mistook the pilot waving a fly out of their face for a signal that the refuel was complete and has returned to Tanker Pool! (Sigh)",
        "Your driver saw a large bird they mistook for a Sea Eagle and returned to report it to the RSPB. It turned out to be a seagull.",
        "Your driver ate too many crew room biscuits before going on task and has returned complaining of feeling ill.",
        "Your driver was inspecting the hose for blockages when it went off in their face! They have returned to clean the fuel out of their eyes.",
        "Your driver was in the middle of watching a film before going on task and has returned early to catch the end.",
        "Your driver decided to move the tanker to a better position but forgot to detatch the hose and has lost all the fuel.",//Hard Events
        "Your driver found a plug at the bottom of the tanker and removed it to see what it was! It has drained the fuel from the tanker which is now empty.",
        "Your driver was checking the fuel level when he dropped the tanker keys in the tank! The tanker has been drained to retrieve the keys."
    ];
}

EventFactory.prototype = {
    getRandomEvent: function (targetTime)
    {
        var i = Math.floor((Math.random() * 10) + 1);
        var type;
        if (i <= 6)//soft
        {
            type = 0;
        }
        else if(i <=8) //false
        {
            type = 1;
        }
        else
        {
            type = 2;
        }
        var newEvent = new Event(type, this.description[i], targetTime);
        return newEvent;
    }
};
//EOF
