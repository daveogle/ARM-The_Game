/* 
 * Task Class
 */

function Task(parkingSlot, fuelRequired, aircraft)
{
    this.parkingSlot = parkingSlot; //A number between 1 and 16 inclusive
    this.aircraft = aircraft;
    this.fuelRequired = fuelRequired;
    this.totalFuel = fuelRequired;
    this.eventHappened = false;
    this.selected = false;
    this.busy = false;
}

Task.prototype = {
    getAircraft: function ()
    {
        return this.aircraft;
    },
    setAircraft: function (aircraft)
    {
        this.aircraft = aircraft;
    },
    getParkingSlot: function ()
    {
        return this.parkingSlot;
    },
    setParkingSlot: function (parkingSlot)
    {
        this.parkingSlot = parkingSlot;
    },
    getFuelRequired: function ()
    {
        return this.fuelRequired;
    },
    setFuelRequired: function (fuelRequired)
    {
        this.fuelRequired = fuelRequired;
    },
    getTotalFuel: function ()
    {
        return this.totalFuel;
    },
    setTotalFuel: function (totalFuel)
    {
        this.totalFuel = totalFuel;
    },
    getSelected: function ()
    {
        return this.selected;
    },
    setSelected: function (selected)
    {
        this.selected = selected;
    },
    getBusy: function ()
    {
        return this.busy;
    },
    setBusy: function (busy)
    {
        this.selected = false;
        this.busy = busy;
    },
    getEventHappened: function ()
    {
        return this.eventHappened;
    },
    setEventHappened: function (eventHappened)
    {
        this.eventHappened = eventHappened;
    }
};
//EOF
