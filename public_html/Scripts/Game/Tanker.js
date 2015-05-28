/* 
 * Tanker Class
 */
function Tanker(fleetNumber, maxLevel)
{
    this.fleetNumber = fleetNumber;
    this.selected = false;
    this.busy = false;
    this.maxLevel = maxLevel;
    this.fuelLevel = this.maxLevel;
}

Tanker.prototype = {
    constructor: Tanker,
    getFleetNumber: function ()
    {
        return this.fleetNumber;
    },
    setFleetNumber: function (fleetNumber)
    {
        this.fleetNumber = fleetNumber;
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
    getFuelLevel: function ()
    {
        return this.fuelLevel;
    },
    setFuelLevel: function (fuelLevel)
    {
        this.fuelLevel = fuelLevel;
    },
    getMaxLevel: function ()
    {
        return this.maxLevel;
    },
    setMaxLevel: function (maxLevel)
    {
        this.maxLevel = maxLevel;
    }
};
//EOF
